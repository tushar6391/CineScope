import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 border-b border-yellow-500 px-6 py-4 flex items-center justify-between">
      <Link
        to="/"
        className="text-yellow-400 text-2xl font-bold tracking-widest"
      >
        🎬 CineScope
      </Link>
      <div className="flex gap-6 items-center text-sm">
        <Link to="/" className="text-gray-300 hover:text-yellow-400">
          Movies
        </Link>
        {user && (
          <>
            <Link
              to="/watchlist"
              className="text-gray-300 hover:text-yellow-400"
            >
              Watchlist
            </Link>
            <Link
              to="/recommendations"
              className="text-gray-300 hover:text-yellow-400"
            >
              For You
            </Link>
          </>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-yellow-500 text-black px-4 py-1 rounded font-semibold hover:bg-yellow-400"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-yellow-500 text-black px-4 py-1 rounded font-semibold hover:bg-yellow-400"
          >
            Login
          </Link>
        )}
        {user?.role === "admin" && (
          <Link to="/admin" className="text-gray-300 hover:text-yellow-400">
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
