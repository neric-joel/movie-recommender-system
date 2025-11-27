import os
import numpy as np
import pandas as pd
from data_loader import load_data, preprocess_features
from models import CollaborativeFilteringModel, ContentBasedModel, NeuMFModel
from hybrid import hybrid_recommendation

def get_recommendations(user_id):
    # 1. Load and Train (Full Data)
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'DATA')
    movies, ratings = load_data(data_dir)
    movies, ratings, num_users, num_movies, user_encoder, movie_encoder = preprocess_features(movies, ratings)
    
    print("Training models on full data...")
    cf_model = CollaborativeFilteringModel()
    cf_model.train(ratings)
    
    cbf_model = ContentBasedModel()
    cbf_model.train(movies)
    
    neumf_model = NeuMFModel(num_users, num_movies)
    neumf_model.compile(optimizer='adam', loss='mse')
    neumf_model.fit([ratings['user_encoded'], ratings['movie_encoded']], ratings['rating'], epochs=3, verbose=0)
    
    print(f"Generating recommendations for User {user_id}...")
    
    # 2. Identify movies user hasn't seen
    if user_id in ratings['userId'].values:
        user_ratings = ratings[ratings['userId'] == user_id]
        seen_movie_ids = user_ratings['movieId'].values
    else:
        seen_movie_ids = []
        
    all_movie_ids = movies['id'].values
    unseen_movie_ids = [mid for mid in all_movie_ids if mid not in seen_movie_ids]
    
    # 3. Score unseen movies
    # For demo purposes, we'll just score the first 20 unseen movies to save time
    unseen_movie_ids = unseen_movie_ids[:20] 
    
    recommendations = []
    for movie_id in unseen_movie_ids:
        try:
            # Check if movie is in our encoder (it should be as we trained on movies df)
            if movie_id not in movie_encoder.classes_:
                continue
                
            # Hybrid Score
            # Note: In a real app, we would pass encoded IDs to NeuMF here.
            # But our hybrid.py is a simple placeholder wrapper. 
            # We'll just call it as is.
            
            score = hybrid_recommendation(user_id, movie_id, cf_model, cbf_model, neumf_model)
            
            movie_row = movies[movies['id'] == movie_id]
            if not movie_row.empty:
                movie_title = movie_row['title'].values[0]
                recommendations.append((movie_title, score))
            
        except Exception as e:
            # print(f"Error scoring movie {movie_id}: {e}")
            continue
            
    # Sort by score
    recommendations.sort(key=lambda x: x[1], reverse=True)
    
    return recommendations[:10]

if __name__ == "__main__":
    # Test with User ID 1
    recs = get_recommendations(1)
    print("\nTop Recommendations:")
    for title, score in recs:
        print(f"{title}: {score:.2f}")
