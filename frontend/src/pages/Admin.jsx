import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const TABS = ['Movies', 'Add Movie', 'Users', 'Watchlists']

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Movies')
  const [movies, setMovies] = useState([])
  const [users, setUsers] = useState([])
  const [watchlists, setWatchlists] = useState([])
  const [editMovie, setEditMovie] = useState(null)
  const [form, setForm] = useState({ title: '', genre: '', description: '', year: '', rating: '', director: '', poster: '', cast: '' })
  const [msg, setMsg] = useState('')

  // Redirect if not admin
  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'admin' && !user.is_staff) { navigate('/'); return }
    if (user.role !== 'admin') { navigate('/'); return }
  }, [user])

  useEffect(() => { fetchMovies() }, [])

  const fetchMovies = () => api.get('/movies/').then(r => setMovies(r.data))
  const fetchUsers = () => api.get('/users/all/').then(r => setUsers(r.data))
  const fetchWatchlists = () => api.get('/watchlist/all/').then(r => setWatchlists(r.data))

  const handleTab = (t) => {
    setTab(t)
    setMsg('')
    if (t === 'Users') fetchUsers()
    if (t === 'Watchlists') fetchWatchlists()
    if (t === 'Movies') fetchMovies()
    if (t === 'Add Movie') { setEditMovie(null); setForm({ title:'',genre:'',description:'',year:'',rating:'',director:'',poster:'',cast:'' }) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, year: parseInt(form.year), rating: parseFloat(form.rating), cast: form.cast.split(',').map(s => s.trim()) }
    try {
      if (editMovie) {
        await api.put(`/movies/${editMovie._id}/update/`, payload)
        setMsg('Movie updated!')
      } else {
        await api.post('/movies/add/', payload)
        setMsg('Movie added!')
      }
      fetchMovies()
      setTab('Movies')
    } catch (err) {
      setMsg('Error: ' + JSON.stringify(err.response?.data))
    }
  }

  const handleEdit = (movie) => {
    setEditMovie(movie)
    setForm({
      title: movie.title || '',
      genre: movie.genre || '',
      description: movie.description || '',
      year: movie.year || '',
      rating: movie.rating || '',
      director: movie.director || '',
      poster: movie.poster || '',
      cast: Array.isArray(movie.cast) ? movie.cast.join(', ') : ''
    })
    setTab('Add Movie')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this movie?')) return
    await api.delete(`/movies/${id}/delete/`)
    setMsg('Deleted.')
    fetchMovies()
  }

  const inputCls = "w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-yellow-500 outline-none text-sm"

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <h1 className="text-yellow-400 text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-3 justify-center mb-8 flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => handleTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all
              ${tab === t ? 'bg-yellow-500 text-black border-yellow-500' : 'border-gray-600 text-gray-300 hover:border-yellow-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {msg && <p className="text-center text-green-400 mb-4 text-sm">{msg}</p>}

      {/* ── MOVIES TAB ── */}
      {tab === 'Movies' && (
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-400 text-sm mb-4">{movies.length} movies in database</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="py-3 pr-4">Poster</th>
                  <th className="py-3 pr-4">Title</th>
                  <th className="py-3 pr-4">Genre</th>
                  <th className="py-3 pr-4">Year</th>
                  <th className="py-3 pr-4">Rating</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map(m => (
                  <tr key={m._id} className="border-b border-gray-800 hover:bg-gray-900">
                    <td className="py-3 pr-4">
                      <img src={m.poster || 'https://via.placeholder.com/50x75'} alt={m.title} className="w-10 h-14 object-cover rounded" />
                    </td>
                    <td className="py-3 pr-4 text-white font-medium">{m.title}</td>
                    <td className="py-3 pr-4 text-yellow-400">{m.genre}</td>
                    <td className="py-3 pr-4 text-gray-400">{m.year}</td>
                    <td className="py-3 pr-4 text-gray-400">⭐ {m.rating}</td>
                    <td className="py-3 flex gap-2 mt-2">
                      <button onClick={() => handleEdit(m)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(m._id)}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-500">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT MOVIE TAB ── */}
      {tab === 'Add Movie' && (
        <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-xl border border-gray-700">
          <h2 className="text-yellow-400 text-2xl font-bold mb-6">
            {editMovie ? `Edit: ${editMovie.title}` : 'Add New Movie'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className={inputCls} placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <input className={inputCls} placeholder="Genre (e.g. Action, Sci-Fi)" value={form.genre} onChange={e => setForm({...form, genre: e.target.value})} required />
            <textarea className={inputCls} placeholder="Description" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <input className={inputCls} placeholder="Year" type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} />
              <input className={inputCls} placeholder="Rating (0-10)" type="number" step="0.1" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} />
            </div>
            <input className={inputCls} placeholder="Director" value={form.director} onChange={e => setForm({...form, director: e.target.value})} />
            <input className={inputCls} placeholder="Poster URL" value={form.poster} onChange={e => setForm({...form, poster: e.target.value})} />
            <input className={inputCls} placeholder="Cast (comma separated)" value={form.cast} onChange={e => setForm({...form, cast: e.target.value})} />
            <button type="submit" className="w-full bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-400">
              {editMovie ? 'Update Movie' : 'Add Movie'}
            </button>
            {editMovie && (
              <button type="button" onClick={() => { setEditMovie(null); setTab('Movies') }}
                className="w-full border border-gray-600 text-gray-300 py-2 rounded-lg text-sm hover:border-gray-400">
                Cancel
              </button>
            )}
          </form>
        </div>
      )}

      {/* ── USERS TAB ── */}
      {tab === 'Users' && (
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-400 text-sm mb-4">{users.length} registered users</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="py-3 pr-4">ID</th>
                  <th className="py-3 pr-4">Username</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Role</th>
                  <th className="py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-900">
                    <td className="py-3 pr-4 text-gray-500 text-xs">{u.id}</td>
                    <td className="py-3 pr-4 text-white">{u.username}</td>
                    <td className="py-3 pr-4 text-gray-400">{u.email}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── WATCHLISTS TAB ── */}
      {tab === 'Watchlists' && (
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-400 text-sm mb-4">{watchlists.length} total watchlist entries</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="py-3 pr-4">User ID</th>
                  <th className="py-3 pr-4">Movie</th>
                  <th className="py-3">Genre</th>
                </tr>
              </thead>
              <tbody>
                {watchlists.map(w => (
                  <tr key={w._id} className="border-b border-gray-800 hover:bg-gray-900">
                    <td className="py-3 pr-4 text-gray-500 text-xs">{w.user_id}</td>
                    <td className="py-3 pr-4 text-white">{w.title}</td>
                    <td className="py-3 text-yellow-400">{w.genre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}