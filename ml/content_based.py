import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os

os.makedirs('saved_models', exist_ok=True)

# Load data
df = pd.read_csv('dataset/movies.csv')
df = df.drop_duplicates(subset='movie_id')
df['description'] = df['description'].fillna('')
df['genre'] = df['genre'].fillna('')
df = df.reset_index(drop=True)

# Feature engineering
df['tags'] = df['genre'] + ' ' + df['genre'] + ' ' + df['description']
df['tags'] = df['tags'].str.lower().str.strip()

# TF-IDF
vectorizer = TfidfVectorizer(max_features=5000, stop_words='english', ngram_range=(1,2))
tfidf_matrix = vectorizer.fit_transform(df['tags'])
print(f"TF-IDF matrix: {tfidf_matrix.shape}")

# Cosine similarity
similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)
print(f"Similarity matrix: {similarity_matrix.shape}")

# Save
joblib.dump(vectorizer, 'saved_models/tfidf_vectorizer.pkl')
joblib.dump(similarity_matrix, 'saved_models/similarity_matrix.pkl')
joblib.dump(df, 'saved_models/movies_df.pkl')

print("Content-based model saved.")