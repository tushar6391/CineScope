import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const GENRES = ['All','Action','Drama','Comedy','Sci-Fi','Thriller','Horror','Romance','Animation']

export default function Home() {
  const [movies, setMovies] = useState([])
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')

  useEffect(() => {
    const params = {}
    if (search) params.search = search
    if (genre && genre !== 'All') params.genre = genre
    api.get('/movies/', { params }).then(r => setMovies(r.data))
  }, [search, genre])

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-8">
      <h1 className="text-yellow-400 text-4xl font-bold mb-8 text-center tracking-wide">Browse Movies</h1>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-6">
        <input
          type="text" placeholder="Search movies..."
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-500 outline-none"
          value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {GENRES.map(g => (
          <button key={g}
            onClick={() => setGenre(g === 'All' ? '' : g)}
            className={`px-4 py-1 rounded-full text-sm font-medium border transition-all
              ${(genre === g || (g === 'All' && !genre))
                ? 'bg-yellow-500 text-black border-yellow-500'
                : 'border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-yellow-400'}`}
          >{g}</button>
        ))}
      </div>

      {/* Movie Grid */}
      {movies.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {movies.map(movie => (
            <Link to={`/movie/${movie._id}`} key={movie._id}>
              <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500 transition-all hover:scale-105">
                <img
                  src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-white font-semibold text-sm truncate">{movie.title}</h3>
                  <p className="text-yellow-400 text-xs mt-1">{movie.genre}</p>
                  <p className="text-gray-400 text-xs">{movie.year}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}