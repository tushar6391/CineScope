from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from cinescope_backend.mongo import movies_col

def serialize_movie(m):
    m['_id'] = str(m['_id'])
    return m

@api_view(['GET'])
@permission_classes([AllowAny])
def movie_list(request):
    genre = request.query_params.get('genre')
    search = request.query_params.get('search')

    query = {}
    if genre:
        query['genre'] = {'$regex': genre, '$options': 'i'}
    if search:
        query['title'] = {'$regex': search, '$options': 'i'}

    movies = list(movies_col.find(query))
    return Response([serialize_movie(m) for m in movies])

@api_view(['GET'])
@permission_classes([AllowAny])
def movie_detail(request, movie_id):
    try:
        movie = movies_col.find_one({'_id': ObjectId(movie_id)})
        if not movie:
            return Response({'error': 'Not found'}, status=404)
        return Response(serialize_movie(movie))
    except Exception:
        return Response({'error': 'Invalid ID'}, status=400)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_movie(request):
    data = request.data
    movie = {
        'title': data.get('title'),
        'genre': data.get('genre'),
        'description': data.get('description'),
        'year': data.get('year'),
        'rating': data.get('rating', 0),
        'poster': data.get('poster', ''),
        'director': data.get('director', ''),
        'cast': data.get('cast', []),
    }
    result = movies_col.insert_one(movie)
    movie['_id'] = str(result.inserted_id)
    return Response(movie, status=201)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_movie(request, movie_id):
    try:
        movies_col.update_one(
            {'_id': ObjectId(movie_id)},
            {'$set': request.data}
        )
        movie = movies_col.find_one({'_id': ObjectId(movie_id)})
        return Response(serialize_movie(movie))
    except Exception:
        return Response({'error': 'Invalid ID'}, status=400)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_movie(request, movie_id):
    try:
        movies_col.delete_one({'_id': ObjectId(movie_id)})
        return Response({'message': 'Deleted'})
    except Exception:
        return Response({'error': 'Invalid ID'}, status=400)