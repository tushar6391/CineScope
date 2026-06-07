import sys
import os
import joblib
import numpy as np
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

# Load models at startup
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS = os.path.join(BASE, 'saved_models')

similarity_matrix = joblib.load(os.path.join(MODELS, 'similarity_matrix.pkl'))
movies_df = joblib.load(os.path.join(MODELS, 'movies_df.pkl'))
user_movie_matrix = joblib.load(os.path.join(MODELS, 'user_movie_matrix.pkl'))
user_factors = joblib.load(os.path.join(MODELS, 'user_factors.pkl'))
movie_factors = joblib.load(os.path.join(MODELS, 'movie_factors.pkl'))


def get_content_recs(movie_id, top_n=8):
    movie_id = str(movie_id)
    idx_series = movies_df[movies_df['movie_id'].astype(str) == movie_id].index
    if len(idx_series) == 0:
        return []
    idx = idx_series[0]
    scores = list(enumerate(similarity_matrix[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
    result = movies_df.iloc[[i[0] for i in scores]][['movie_id','title','genre']].copy()
    result['score'] = [round(i[1], 3) for i in scores]
    return result.to_dict('records')


def get_cf_recs(user_id, top_n=8):
    user_id = str(user_id)
    if user_id not in user_movie_matrix.index:
        # cold start — return top rated from dataset
        return movies_df.head(top_n)[['movie_id','title','genre']].to_dict('records')

    user_idx = user_movie_matrix.index.get_loc(user_id)
    predicted = np.dot(user_factors[user_idx], movie_factors.T)

    user_ratings = user_movie_matrix.loc[user_id]
    unrated_mask = user_ratings.isna()
    unrated_cols = user_movie_matrix.columns[unrated_mask]
    unrated_indices = [user_movie_matrix.columns.get_loc(m) for m in unrated_cols]

    pairs = [(str(unrated_cols[i]), float(predicted[unrated_indices[i]])) for i in range(len(unrated_cols))]
    pairs.sort(key=lambda x: x[1], reverse=True)

    result = []
    for movie_id, score in pairs[:top_n]:
        row = movies_df[movies_df['movie_id'].astype(str) == movie_id]
        if len(row) > 0:
            r = row.iloc[0][['movie_id','title','genre']].to_dict()
            r['score'] = round(score, 3)
            result.append(r)
    return result


@api_view(['GET'])
@permission_classes([AllowAny])
def content_based(request, movie_id):
    results = get_content_recs(movie_id)
    return Response({'movie_id': movie_id, 'recommendations': results})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def collaborative(request):
    user_id = str(request.user.id)
    results = get_cf_recs(user_id)
    return Response({'user_id': user_id, 'recommendations': results})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hybrid(request):
    user_id = str(request.user.id)
    movie_id = request.query_params.get('movie_id')

    cf = get_cf_recs(user_id, top_n=8)
    cb = get_content_recs(movie_id, top_n=8) if movie_id else []

    # Merge — CF weighted more
    seen = set()
    merged = []
    for r in cf:
        if r['movie_id'] not in seen:
            seen.add(r['movie_id'])
            merged.append(r)
    for r in cb:
        if r['movie_id'] not in seen:
            seen.add(r['movie_id'])
            merged.append(r)

    return Response({'recommendations': merged[:8]})