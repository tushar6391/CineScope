from pymongo import MongoClient
from django.conf import settings

client = MongoClient(settings.MONGO_URI)
db = client[settings.MONGO_DB]

# Collections
movies_col = db['movies']
watchlist_col = db['watchlists']
ratings_col = db['ratings']