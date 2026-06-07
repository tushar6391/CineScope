import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
import joblib
import os

os.makedirs('saved_models', exist_ok=True)

# Load ratings
df = pd.read_csv('dataset/ratings.csv')
df['user_id'] = df['user_id'].astype(str)
df['movie_id'] = df['movie_id'].astype(str)
df['rating'] = df['rating'].astype(float)

# User-movie matrix
user_movie_matrix = df.pivot_table(
    values='rating', index='user_id', columns='movie_id', aggfunc='mean'
)
print(f"Matrix shape: {user_movie_matrix.shape}")

# User similarity
matrix_filled = user_movie_matrix.fillna(0)
user_similarity = cosine_similarity(matrix_filled)
user_sim_df = pd.DataFrame(user_similarity, index=user_movie_matrix.index, columns=user_movie_matrix.index)

# Item similarity
item_similarity = cosine_similarity(matrix_filled.T)
item_sim_df = pd.DataFrame(item_similarity, index=user_movie_matrix.columns, columns=user_movie_matrix.columns)

# SVD
svd = TruncatedSVD(n_components=5, random_state=42)
user_factors = svd.fit_transform(matrix_filled)
movie_factors = svd.components_.T
print(f"User factors: {user_factors.shape}")
print(f"Movie factors: {movie_factors.shape}")

# Save
joblib.dump(user_sim_df, 'saved_models/user_similarity.pkl')
joblib.dump(item_sim_df, 'saved_models/item_similarity.pkl')
joblib.dump(user_movie_matrix, 'saved_models/user_movie_matrix.pkl')
joblib.dump(svd, 'saved_models/svd_model.pkl')
joblib.dump(user_factors, 'saved_models/user_factors.pkl')
joblib.dump(movie_factors, 'saved_models/movie_factors.pkl')

print("CF models saved.")