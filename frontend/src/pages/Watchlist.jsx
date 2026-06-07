import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Watchlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchWatchlist = () => {
    api.get('/watchlist/').then(r => {
      setItems(r.data)
      setLoading(false)
    })
  }

  useEffect(() => { fetchWatchlist() }, [])

  const remove = async (movie_id) => {
    await api.delete(`/watchlist/remove/${movie_id}/`)
    fetchWatchlist()
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <h1 className="text-yellow-400 text-4xl font-bold mb-8 text-center">My Watchlist</h1>

      {items.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-400 mb-4">No movies in watchlist yet.</p>
          <Link to="/" className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-400">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {items.map(item => (
            <div key={item._id} className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden hover:border-yellow-500 transition-all">
              <Link to={`/movie/${item.movie_id}`}>
                <img
                  src={item.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-white text-sm font-semibold truncate">{item.title}</h3>
                  <p className="text-yellow-400 text-xs mt-1">{item.genre}</p>
                </div>
              </Link>
              <div className="px-3 pb-3">
                <button
                  onClick={() => remove(item.movie_id)}
                  className="w-full text-xs text-red-400 border border-red-400 rounded py-1 hover:bg-red-400 hover:text-black transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}