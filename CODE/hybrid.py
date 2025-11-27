import numpy as np

def hybrid_recommendation(user_id, movie_id, cf_model, cbf_model, neumf_model, weights=[0.3, 0.3, 0.4]):
    """
    Combine predictions from different models.
    """
    # 1. Get CF Prediction
    cf_pred = cf_model.predict(user_id, movie_id)
    
    # 2. Get CBF Prediction (This is tricky as CBF usually ranks items given an item, not user-item rating)
    # For this hybrid system, we might assume CBF score is based on similarity to user's history
    # For simplicity here, we'll use a placeholder or assume we have a way to score user-item via CBF
    cbf_pred = 3.0 # Placeholder
    
    # 3. Get NeuMF Prediction
    # Need to encode IDs first
    # neumf_pred = neumf_model.predict([encoded_user_id, encoded_movie_id])
    neumf_pred = 3.0 # Placeholder as we need the encoders here
    
    final_score = (weights[0] * cf_pred) + (weights[1] * cbf_pred) + (weights[2] * neumf_pred)
    return final_score

