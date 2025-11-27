import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder

def load_data(data_dir):
    """
    Load and preprocess the movies dataset.
    """
    print(f"Loading data from {data_dir}...")
    
    # Load movies metadata
    # Using low_memory=False because of mixed types in some columns
    movies = pd.read_csv(f"{data_dir}/movies_metadata.csv", low_memory=False)
    
    # Load ratings (using small dataset for development/testing)
    ratings = pd.read_csv(f"{data_dir}/ratings_small.csv")
    
    # Filter valid movies (numeric IDs only)
    movies = movies[movies['id'].str.isnumeric()]
    movies['id'] = movies['id'].astype(int)
    
    # Keep only relevant columns for content-based filtering
    movies = movies[['id', 'title', 'overview', 'genres', 'vote_average', 'vote_count']]
    
    # Merge to ensure we only have ratings for movies we have metadata for
    ratings = ratings[ratings['movieId'].isin(movies['id'])]
    
    return movies, ratings

def preprocess_features(movies, ratings):
    """
    Clean and encode features.
    """
    print("Preprocessing features...")
    
    # Fill missing overviews
    movies['overview'] = movies['overview'].fillna('')
    
    # Encode User IDs and Movie IDs for NeuMF
    user_encoder = LabelEncoder()
    movie_encoder = LabelEncoder()
    
    ratings['user_encoded'] = user_encoder.fit_transform(ratings['userId'])
    ratings['movie_encoded'] = movie_encoder.fit_transform(ratings['movieId'])
    
    num_users = len(user_encoder.classes_)
    num_movies = len(movie_encoder.classes_)
    
    return movies, ratings, num_users, num_movies, user_encoder, movie_encoder

