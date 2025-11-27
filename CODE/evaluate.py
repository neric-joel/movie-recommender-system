import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from data_loader import load_data, preprocess_features
from models import CollaborativeFilteringModel, NeuMFModel

def evaluate_models():
    print("Starting evaluation...")
    
    # 1. Load Data
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'DATA')
    movies, ratings = load_data(data_dir)
    
    # 2. Preprocess
    movies, ratings, num_users, num_movies, user_encoder, movie_encoder = preprocess_features(movies, ratings)
    
    # 3. Split Data
    print("Splitting data into Train and Test sets...")
    train_ratings, test_ratings = train_test_split(ratings, test_size=0.2, random_state=42)
    
    # 4. Evaluate CF
    print("Evaluating Collaborative Filtering (CF)...")
    cf_model = CollaborativeFilteringModel()
    cf_model.train(train_ratings)
    
    cf_preds = []
    cf_actuals = []
    # Predict on a subset of test data for speed if needed, but here we do all
    for _, row in test_ratings.iterrows():
        pred = cf_model.predict(row['userId'], row['movieId'])
        cf_preds.append(pred)
        cf_actuals.append(row['rating'])
        
    cf_rmse = np.sqrt(mean_squared_error(cf_actuals, cf_preds))
    print(f"CF RMSE: {cf_rmse:.4f}")
    
    # 5. Evaluate NeuMF
    print("Evaluating Neural Collaborative Filtering (NeuMF)...")
    neumf_model = NeuMFModel(num_users, num_movies)
    neumf_model.compile(optimizer='adam', loss='mse')
    
    train_user_ids = train_ratings['user_encoded'].values
    train_movie_ids = train_ratings['movie_encoded'].values
    train_labels = train_ratings['rating'].values
    
    neumf_model.fit([train_user_ids, train_movie_ids], train_labels, epochs=5, batch_size=64, verbose=0)
    
    test_user_ids = test_ratings['user_encoded'].values
    test_movie_ids = test_ratings['movie_encoded'].values
    test_labels = test_ratings['rating'].values
    
    neumf_loss = neumf_model.evaluate([test_user_ids, test_movie_ids], test_labels, verbose=0)
    neumf_rmse = np.sqrt(neumf_loss)
    print(f"NeuMF RMSE: {neumf_rmse:.4f}")
    
    # Save results
    eval_path = os.path.join(os.path.dirname(__file__), '..', 'EVALUATIONS', 'results.txt')
    with open(eval_path, 'w') as f:
        f.write(f"Collaborative Filtering RMSE: {cf_rmse:.4f}\n")
        f.write(f"Neural Collaborative Filtering RMSE: {neumf_rmse:.4f}\n")
    
    print(f"Results saved to {eval_path}")

if __name__ == "__main__":
    evaluate_models()
