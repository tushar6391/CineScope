import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function MovieDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [similar, setSimilar] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get(`/movies/${id}/`).then(r => setMovie(r.data))
  }, [id])

  useEffect(() => {
    if (id) {
      api.get(`/recommendations/content/${id}/`)
        .then(r => setSimilar(r.data.recommendations.slice(0, 4)))
        .catch(() => {})
    }
  }, [id])

  const addToWatchlist = async () => {
    if (!user) { navigate('/login'); return }
    try {
      await api.post('/watchlist/add/', { movie_id: id })
      setMsg('Added to watchlist!')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Already in watchlist')
    }
  }

  if (!movie) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">

      {/* Movie Info */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10">
        <img
          src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={movie.title}
          className="w-full md:w-72 h-auto rounded-xl border border-gray-700 object-cover"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">{movie.title}</h1>
          <div className="flex gap-4 text-sm text-gray-400 mb-4">
            <span>{movie.year}</span>
            <span className="text-yellow-500 font-semibold">{movie.genre}</span>
            <span>⭐ {movie.rating}</span>
          </div>
          <p className="text-gray-300 leading-relaxed mb-6">{movie.description}</p>
          {movie.director && (
            <p className="text-gray-400 text-sm mb-2">
              <span className="text-white font-semibold">Director: </span>{movie.director}
            </p>
          )}
          {movie.cast?.length > 0 && (
            <p className="text-gray-400 text-sm mb-6">
              <span className="text-white font-semibold">Cast: </span>{movie.cast.join(', ')}
            </p>
          )}
          <button
            onClick={addToWatchlist}
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
          >
            + Add to Watchlist
          </button>
          {msg && <p className="text-green-400 mt-3 text-sm">{msg}</p>}
        </div>
      </div>

      {/* Similar Movies */}
      {similar.length > 0 && (
        <div className="max-w-5xl mx-auto mt-16">
          <h2 className="text-yellow-400 text-2xl font-bold mb-6">Similar Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similar.map((m, i) => (
              <Link to={`/movie/${m.movie_id}`} key={i}>
                <div className="bg-gray-900 rounded-xl border border-gray-700 p-4 hover:border-yellow-500 transition-all">
                  <p className="text-white text-sm font-semibold">{m.title}</p>
                  <p className="text-yellow-400 text-xs mt-1 capitalize">{m.genre}</p>
                  <p className="text-gray-500 text-xs mt-1">Match: {Math.round(m.score * 100)}%</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}