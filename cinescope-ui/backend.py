from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from difflib import SequenceMatcher
import os
import json

app = Flask(__name__)
CORS(app)

# Global variables for dataset and models
movies_df = None
tfidf_matrix = None
tfidf_vectorizer = None
watchlists = {}  # Simple in-memory storage {user_id: [movie_ids]}

def load_dataset():
    """Load and preprocess the MovieLens dataset"""
    global movies_df, tfidf_matrix, tfidf_vectorizer
    
    print("Loading dataset...")
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'DATA')
    
    # Load movies metadata
    movies_df = pd.read_csv(os.path.join(data_dir, 'movies_metadata.csv'), low_memory=False)
    
    # Clean data
    movies_df = movies_df[movies_df['id'].notna()]
    movies_df = movies_df[movies_df['id'].str.isnumeric()]
    movies_df['id'] = movies_df['id'].astype(int)
    
    # Fill missing values
    movies_df['overview'] = movies_df['overview'].fillna('')
    movies_df['title'] = movies_df['title'].fillna('Unknown')
    movies_df['genres'] = movies_df['genres'].fillna('[]')
    
    # Parse genres (they're stored as JSON strings)
    def parse_genres(genres_str):
        try:
            genres_list = eval(genres_str)
            return ' '.join([g['name'] for g in genres_list])
        except:
            return ''
    
    movies_df['genres_text'] = movies_df['genres'].apply(parse_genres)
    
    # Create combined text for TF-IDF
    movies_df['combined_features'] = (
        movies_df['overview'] + ' ' + 
        movies_df['genres_text'] + ' ' + 
        movies_df['title']
    )
    
    # Build TF-IDF matrix
    print("Building TF-IDF model...")
    tfidf_vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    tfidf_matrix = tfidf_vectorizer.fit_transform(movies_df['combined_features'])
    
    print(f"Loaded {len(movies_df)} movies")
    print("Dataset ready! (Similarities computed on-demand)")

def fuzzy_match_score(query, title):
    """Calculate fuzzy match score between query and title"""
    query_lower = query.lower()
    title_lower = title.lower()
    
    # Exact match gets highest score
    if query_lower == title_lower:
        return 1.0
    
    # Starts with query gets high score
    if title_lower.startswith(query_lower):
        return 0.9
    
    # Contains query gets medium score
    if query_lower in title_lower:
        return 0.7
    
    # Use SequenceMatcher for fuzzy matching
    return SequenceMatcher(None, query_lower, title_lower).ratio()

@app.route('/api/autocomplete', methods=['GET'])
def autocomplete():
    """Autocomplete endpoint for movie search"""
    query = request.args.get('query', '').strip()
    
    if not query or len(query) < 2:
        return jsonify({'suggestions': []})
    
    # Find matching movies
    matches = []
    for idx, row in movies_df.iterrows():
        title = row['title']
        score = fuzzy_match_score(query, title)
        
        if score > 0.3:  # Threshold for relevance
            matches.append({
                'title': title,
                'id': int(row['id']),
                'score': score,
                'year': str(row.get('release_date', ''))[:4] if pd.notna(row.get('release_date')) else ''
            })
    
    # Sort by score and limit to top 10
    matches.sort(key=lambda x: x['score'], reverse=True)
    suggestions = matches[:10]
    
    return jsonify({'suggestions': suggestions})

@app.route('/api/recommend_by_title', methods=['GET'])
def recommend_by_title():
    """Get similar movies based on title"""
    title = request.args.get('title', '').strip()
    
    if not title:
        return jsonify({'error': 'Title parameter required'}), 400
    
    # Find the movie
    movie_matches = movies_df[movies_df['title'].str.lower() == title.lower()]
    
    if movie_matches.empty:
        return jsonify({'error': 'Movie not found'}), 404
    
    movie_idx = movie_matches.index[0]
    movie_id = int(movie_matches.iloc[0]['id'])
    
    # Compute similarity scores on-demand (only for this movie)
    movie_tfidf = tfidf_matrix[movie_idx]
    sim_scores = cosine_similarity(movie_tfidf, tfidf_matrix)[0]
    
    # Get indices sorted by similarity
    sim_indices = sim_scores.argsort()[::-1]
    
    # Get top 10 similar movies (excluding the movie itself)
    sim_indices = sim_indices[1:11]
    movie_indices = sim_indices.tolist()
    
    # Build response
    similar_movies = []
    for idx in movie_indices:
        movie = movies_df.iloc[idx]
        
        # Parse genres for display
        genres_list = []
        try:
            genres_data = eval(movie['genres'])
            genres_list = [g['name'] for g in genres_data]
        except:
            pass
        
        # Get poster URL (using TMDB if available)
        poster_url = f"https://image.tmdb.org/t/p/w500{movie.get('poster_path', '')}" if pd.notna(movie.get('poster_path')) else None
        
        similar_movies.append({
            'id': int(movie['id']),
            'title': movie['title'],
            'rating': float(movie.get('vote_average', 0)) / 2,  # Convert 0-10 to 0-5
            'genres': genres_list,
            'poster': poster_url,
            'year': str(movie.get('release_date', ''))[:4] if pd.notna(movie.get('release_date')) else '',
            'overview': movie.get('overview', ''),
            'runtime': f"{int(movie.get('runtime', 0))}min" if pd.notna(movie.get('runtime')) else '',
            'releaseDate': movie.get('release_date', '')
        })
    
    return jsonify({
        'similar_movies': similar_movies,
        'query_movie': title
    })

@app.route('/api/movie/<int:movie_id>', methods=['GET'])
def get_movie_details(movie_id):
    """Get detailed information about a specific movie"""
    movie = movies_df[movies_df['id'] == movie_id]
    
    if movie.empty:
        return jsonify({'error': 'Movie not found'}), 404
    
    movie = movie.iloc[0]
    
    # Parse genres
    genres_list = []
    try:
        genres_data = eval(movie['genres'])
        genres_list = [g['name'] for g in genres_data]
    except:
        pass
    
    # Get poster and backdrop
    poster_url = f"https://image.tmdb.org/t/p/w500{movie.get('poster_path', '')}" if pd.notna(movie.get('poster_path')) else None
    backdrop_url = f"https://image.tmdb.org/t/p/original{movie.get('backdrop_path', '')}" if pd.notna(movie.get('backdrop_path')) else None
    
    return jsonify({
        'id': int(movie['id']),
        'title': movie['title'],
        'rating': float(movie.get('vote_average', 0)) / 2,
        'genres': genres_list,
        'poster': poster_url,
        'backdrop': backdrop_url,
        'year': str(movie.get('release_date', ''))[:4] if pd.notna(movie.get('release_date')) else '',
        'overview': movie.get('overview', ''),
        'runtime': f"{int(movie.get('runtime', 0))}min" if pd.notna(movie.get('runtime')) else '',
        'releaseDate': movie.get('release_date', ''),
        'popularity': float(movie.get('popularity', 0))
    })

@app.route('/api/watchlist/<int:user_id>', methods=['GET'])
def get_watchlist(user_id):
    """Get user's watchlist"""
    movie_ids = watchlists.get(user_id, [])
    
    watchlist_movies = []
    for movie_id in movie_ids:
        movie = movies_df[movies_df['id'] == movie_id]
        if not movie.empty:
            movie = movie.iloc[0]
            
            genres_list = []
            try:
                genres_data = eval(movie['genres'])
                genres_list = [g['name'] for g in genres_data]
            except:
                pass
            
            poster_url = f"https://image.tmdb.org/t/p/w500{movie.get('poster_path', '')}" if pd.notna(movie.get('poster_path')) else None
            
            watchlist_movies.append({
                'id': int(movie['id']),
                'title': movie['title'],
                'rating': float(movie.get('vote_average', 0)) / 2,
                'genres': genres_list,
                'poster': poster_url
            })
    
    return jsonify({'watchlist': watchlist_movies})

@app.route('/api/watchlist/add', methods=['POST'])
def add_to_watchlist():
    """Add movie to watchlist"""
    data = request.json
    user_id = data.get('user_id', 1)
    movie_id = data.get('movie_id')
    
    if not movie_id:
        return jsonify({'error': 'movie_id required'}), 400
    
    if user_id not in watchlists:
        watchlists[user_id] = []
    
    if movie_id not in watchlists[user_id]:
        watchlists[user_id].append(movie_id)
    
    return jsonify({'success': True})

@app.route('/api/watchlist/remove', methods=['DELETE'])
def remove_from_watchlist():
    """Remove movie from watchlist"""
    data = request.json
    user_id = data.get('user_id', 1)
    movie_id = data.get('movie_id')
    
    if user_id in watchlists and movie_id in watchlists[user_id]:
        watchlists[user_id].remove(movie_id)
    
    return jsonify({'success': True})

@app.route('/api/feedback', methods=['POST'])
def feedback():
    """Record user feedback (like/dislike)"""
    data = request.json
    # In a real app, you'd store this in a database
    print(f"Feedback received: {data}")
    return jsonify({'success': True})

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'movies_loaded': len(movies_df) if movies_df is not None else 0
    })

if __name__ == '__main__':
    load_dataset()
    print("\nStarting Flask server on http://localhost:5000")
    print("API Endpoints:")
    print("  GET  /api/autocomplete?query=<text>")
    print("  GET  /api/recommend_by_title?title=<movie>")
    print("  GET  /api/movie/<movie_id>")
    print("  GET  /api/watchlist/<user_id>")
    print("  POST /api/watchlist/add")
    print("  DELETE /api/watchlist/remove")
    print("\nPress Ctrl+C to stop\n")
    app.run(debug=True, port=5000)
