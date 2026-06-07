import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handle = async (e) => {
    e.preventDefault()
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 w-full max-w-md">
        <h2 className="text-yellow-400 text-3xl font-bold mb-6 text-center">Sign In</h2>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handle} className="space-y-4">
          <input
            type="email" placeholder="Email"
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-500 outline-none"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})}
          />
          <input
            type="password" placeholder="Password"
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-500 outline-none"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})}
          />
          <button className="w-full bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-400">
            Login
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4 text-sm">
          No account? <Link to="/register" className="text-yellow-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}