import os
import tensorflow as tf
from data_loader import load_data, preprocess_features
from models import CollaborativeFilteringModel, ContentBasedModel, NeuMFModel

def train_all_models():
    print("Starting training process...")
    
    # 1. Load Data
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'DATA')
    movies, ratings = load_data(data_dir)
    
    # 2. Preprocess Features
    movies, ratings, num_users, num_movies, user_encoder, movie_encoder = preprocess_features(movies, ratings)
    
    # 3. Train Collaborative Filtering (CF)
    print("Training Collaborative Filtering Model...")
    cf_model = CollaborativeFilteringModel()
    cf_model.train(ratings)
    print("CF Model trained.")
    
    # 4. Train Content-Based Filtering (CBF)
    print("Training Content-Based Filtering Model...")
    cbf_model = ContentBasedModel()
    cbf_model.train(movies)
    print("CBF Model trained.")
    
    # 5. Train Neural Collaborative Filtering (NeuMF)
    print("Training NeuMF Model...")
    neumf_model = NeuMFModel(num_users, num_movies)
    neumf_model.compile(optimizer='adam', loss='mse')
    
    # Prepare data for NeuMF
    user_ids = ratings['user_encoded'].values
    movie_ids = ratings['movie_encoded'].values
    labels = ratings['rating'].values
    
    neumf_model.fit([user_ids, movie_ids], labels, epochs=5, batch_size=64, validation_split=0.2)
    print("NeuMF Model trained.")
    
    # Save models (conceptually)
    # neumf_model.save_weights('neumf_weights.h5')
    
    print("All models trained successfully!")

if __name__ == "__main__":
    train_all_models()

