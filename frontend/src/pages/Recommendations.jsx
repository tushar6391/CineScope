import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Recommendations() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/recommendations/hybrid/')
      .then(r => {
        setMovies(r.data.recommendations)
        setLoading(false)
      })
      .catch(() => {
        // fallback — fetch all movies shuffled
        api.get('/movies/').then(r => {
          const shuffled = [...r.data].sort(() => Math.random() - 0.5)
          setMovies(shuffled.slice(0, 8))
          setLoading(false)
        })
      })
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 animate-pulse">Finding movies for you...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <h1 className="text-yellow-400 text-4xl font-bold mb-2 text-center">Recommended For You</h1>
      <p className="text-gray-400 text-center mb-8 text-sm">Powered by hybrid ML engine</p>

      {movies.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">No recommendations yet. Add movies to watchlist first.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {movies.map((movie, i) => (
            <Link to={`/movie/${movie.movie_id}`} key={i}>
              <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden hover:border-yellow-500 hover:scale-105 transition-all">
                <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                  <span className="text-yellow-400 text-4xl">🎬</span>
                </div>
                <div className="p-3">
                  <h3 className="text-white text-sm font-semibold truncate">{movie.title}</h3>
                  <p className="text-yellow-400 text-xs mt-1 capitalize">{movie.genre}</p>
                  {movie.score && (
                    <p className="text-gray-500 text-xs mt-1">Score: {movie.score}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}