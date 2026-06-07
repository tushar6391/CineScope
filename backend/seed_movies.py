from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017')
db = client['cinescope_db']
col = db['movies']

movies = [
    {
        'title': 'Inception',
        'genre': 'Sci-Fi',
        'description': 'A thief enters dreams to steal secrets from deep within the subconscious.',
        'year': 2010,
        'rating': 8.8,
        'director': 'Christopher Nolan',
        'cast': ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
        'poster': 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
    },
    {
        'title': 'The Dark Knight',
        'genre': 'Action',
        'description': 'Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos.',
        'year': 2008,
        'rating': 9.0,
        'director': 'Christopher Nolan',
        'cast': ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
        'poster': 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
    },
    {
        'title': 'Interstellar',
        'genre': 'Sci-Fi',
        'description': 'Astronauts travel through a wormhole near Saturn to find a new home for humanity.',
        'year': 2014,
        'rating': 8.6,
        'director': 'Christopher Nolan',
        'cast': ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
        'poster': 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
    },
    {
        'title': 'Parasite',
        'genre': 'Thriller',
        'description': 'A poor family schemes to become employed by a wealthy family.',
        'year': 2019,
        'rating': 8.5,
        'director': 'Bong Joon-ho',
        'cast': ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
        'poster': 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'
    },
    {
        'title': 'The Shawshank Redemption',
        'genre': 'Drama',
        'description': 'Two imprisoned men bond over years, finding solace and redemption.',
        'year': 1994,
        'rating': 9.3,
        'director': 'Frank Darabont',
        'cast': ['Tim Robbins', 'Morgan Freeman'],
        'poster': 'https://image.tmdb.org/t/p/w500/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg'
    },
    {
        'title': 'Avengers: Endgame',
        'genre': 'Action',
        'description': 'The Avengers assemble to reverse Thanos snap and restore the universe.',
        'year': 2019,
        'rating': 8.4,
        'director': 'Russo Brothers',
        'cast': ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
        'poster': 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg'
    },
    {
        'title': 'The Godfather',
        'genre': 'Drama',
        'description': 'The aging patriarch of a crime dynasty transfers control to his reluctant son.',
        'year': 1972,
        'rating': 9.2,
        'director': 'Francis Ford Coppola',
        'cast': ['Marlon Brando', 'Al Pacino', 'James Caan'],
        'poster': 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLMId36VIqoh.jpg'
    },
    {
        'title': 'Pulp Fiction',
        'genre': 'Thriller',
        'description': 'Lives of criminals intertwine in four stories of violence and redemption.',
        'year': 1994,
        'rating': 8.9,
        'director': 'Quentin Tarantino',
        'cast': ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
        'poster': 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg'
    },
    {
        'title': 'The Matrix',
        'genre': 'Sci-Fi',
        'description': 'A hacker discovers reality is a simulation and joins a rebellion.',
        'year': 1999,
        'rating': 8.7,
        'director': 'Wachowski Sisters',
        'cast': ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
        'poster': 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg'
    },
    {
        'title': 'Forrest Gump',
        'genre': 'Drama',
        'description': 'A slow-witted man witnesses and influences major historical events.',
        'year': 1994,
        'rating': 8.8,
        'director': 'Robert Zemeckis',
        'cast': ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
        'poster': 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg'
    },
    {
        'title': 'Joker',
        'genre': 'Drama',
        'description': 'A failed comedian descends into madness and becomes the Joker.',
        'year': 2019,
        'rating': 8.4,
        'director': 'Todd Phillips',
        'cast': ['Joaquin Phoenix', 'Robert De Niro'],
        'poster': 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg'
    },
    {
        'title': 'Get Out',
        'genre': 'Horror',
        'description': 'A Black man visits his white girlfriend\'s family estate and uncovers a disturbing secret.',
        'year': 2017,
        'rating': 7.7,
        'director': 'Jordan Peele',
        'cast': ['Daniel Kaluuya', 'Allison Williams'],
        'poster': 'https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg'
    },
]

# Clear existing and insert fresh
col.delete_many({})
result = col.insert_many(movies)
print(f"Inserted {len(result.inserted_ids)} movies.")