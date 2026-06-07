from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from bson import ObjectId
from cinescope_backend.mongo import watchlist_col, movies_col

def serialize(doc):
    doc['_id'] = str(doc['_id'])
    return doc

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_watchlist(request):
    user_id = str(request.user.id)
    items = list(watchlist_col.find({'user_id': user_id}))
    return Response([serialize(i) for i in items])

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_watchlist(request):
    user_id = str(request.user.id)
    movie_id = request.data.get('movie_id')

    existing = watchlist_col.find_one({'user_id': user_id, 'movie_id': movie_id})
    if existing:
        return Response({'message': 'Already in watchlist'}, status=400)

    movie = movies_col.find_one({'_id': ObjectId(movie_id)})
    if not movie:
        return Response({'error': 'Movie not found'}, status=404)

    item = {
        'user_id': user_id,
        'movie_id': movie_id,
        'title': movie['title'],
        'poster': movie.get('poster', ''),
        'genre': movie.get('genre', ''),
    }
    watchlist_col.insert_one(item)
    return Response(serialize(item), status=201)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_watchlist(request, movie_id):
    user_id = str(request.user.id)
    watchlist_col.delete_one({'user_id': user_id, 'movie_id': movie_id})
    return Response({'message': 'Removed'})

@api_view(['GET'])
@permission_classes([IsAdminUser])
def all_watchlists(request):
    items = list(watchlist_col.find())
    return Response([serialize(i) for i in items])