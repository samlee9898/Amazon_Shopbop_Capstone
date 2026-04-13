import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ItemsContext } from "../context/ItemsContext";
import { AuthContext } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function Header({
  setTriggerLoginModal,
}: {
  setTriggerLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();

  const { setItemsArray } = useContext(ItemsContext)!;

  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("AuthContext not Found!");
  const { username, setUsername, isLoggedIn, setIsLoggedIn } = authContext;

  let displayName = "Guest";
  if (username) {
    displayName = username;
  }

  const [menuOpen, setMenuOpen] = useState(false);

  const handleClearItems = () => {
    setItemsArray([]);
  };

  const [openCategory, setOpenCategory] = useState<String | null>(null);

  const loginUrl = import.meta.env.VITE_LOGIN_URL;

  async function handleLogout() {
    try {
      // backend to clear cookie, invalidate token
      const res = await fetch(`${loginUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setIsLoggedIn(false);
        setUsername("");
        alert("Logged out successfully!");
        navigate("/");
      } else {
        console.error("Logout failed:", res.status);
        alert("server responded, but failed to log out properly.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Network error during logout.");
    }
  }

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo + Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="text-2xl font-bold cursor-pointer flex gap-0 group transition"
          >
            <span className="text-gray-800 group-hover:text-[#b00097] transition-colors duration-300">
              Style
            </span>
            <span className="text-gray-800 group-hover:text-[#ff3300] transition-colors duration-300">
              Sync
            </span>
          </div>

          {/* Navigations */}
          <nav className="max-[900px]:hidden flex gap-6 text-gray-700 font-medium">
            {/* A container for a dropdown of home */}
            <div
              className="relative flex"
              onMouseEnter={() => setOpenCategory("home")}
              onMouseLeave={() => setOpenCategory(null)}
            >
              <NavLink
                onClick={handleClearItems}
                to="/"
                className={({ isActive }) =>
                  `hover:text-orange-500 transition ${isActive ? "text-orange-500" : ""}`
                }
              >
                Home
              </NavLink>
              <div
                className={`
                          absolute left-1/2 -translate-x-1/2 mt-6 bg-white shadow-lg p-4 rounded-lg
                          ${
                            openCategory === "home"
                              ? "animate-fadeIn pointer-events-auto"
                              : "animate-fadeOut pointer-events-none"
                          }
                        `}
              >
                <NavLink
                  onClick={handleClearItems}
                  to="/learn-more"
                  className={({ isActive }) =>
                    `hover:text-orange-500 transition ${isActive ? "text-orange-500" : ""}`
                  }
                >
                  About
                </NavLink>
              </div>
            </div>

            <NavLink
              onClick={handleClearItems}
              to="/category-select"
              className={({ isActive }) =>
                `hover:text-orange-500 transition ${isActive ? "text-orange-500" : ""}`
              }
            >
              Find Your Fit
            </NavLink>

            {isLoggedIn ? (
              <NavLink
                to="/past-rankings"
                className={({ isActive }) =>
                  `hover:text-orange-500 transition ${isActive ? "text-orange-500" : ""}`
                }
                onClick={handleClearItems}
              >
                Preference History
              </NavLink>
            ) : (
              <span
                onClick={() =>
                  alert(
                    "You have to be logged in to access Preference History!",
                  )
                }
                className="cursor-pointer hover:text-orange-500 transition"
              >
                Preference History
              </span>
            )}

            <div
              className="relative flex"
              onMouseEnter={() => setOpenCategory("trending")}
              onMouseLeave={() => setOpenCategory(null)}
            >
              <NavLink
                onClick={handleClearItems}
                to="/global"
                className={({ isActive }) =>
                  `hover:text-orange-500 transition ${isActive ? "text-orange-500" : ""}`
                }
              >
                Trending
              </NavLink>
              <div
                className={`
                          absolute left-1/2 -translate-x-1/2 mt-6 bg-white shadow-lg p-4 rounded-lg
                          ${
                            openCategory === "trending"
                              ? "animate-fadeIn pointer-events-auto"
                              : "animate-fadeOut pointer-events-none"
                          }
                        `}
              >
                <div className="flex flex-col justify-center items-center">
                  <NavLink
                    onClick={handleClearItems}
                    to="/global"
                    className="hover:text-orange-500 transition mb-1"
                  >
                    Dresses
                  </NavLink>
                  <NavLink
                    onClick={handleClearItems}
                    to="/global"
                    className="hover:text-orange-500 transition mb-1"
                  >
                    Jackets
                  </NavLink>
                  <NavLink
                    onClick={handleClearItems}
                    to="/global"
                    className="hover:text-orange-500 transition mb-1"
                  >
                    Shoes
                  </NavLink>
                  <NavLink
                    onClick={handleClearItems}
                    to="/global"
                    className="hover:text-orange-500 transition mb-1"
                  >
                    Bags
                  </NavLink>
                  <NavLink
                    onClick={handleClearItems}
                    to="/global"
                    className="hover:text-orange-500 transition mb-1"
                  >
                    Shorts
                  </NavLink>
                  <NavLink
                    onClick={handleClearItems}
                    to="/global"
                    className="hover:text-orange-500 transition"
                  >
                    Jeans
                  </NavLink>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div className="max-[900px]:hidden flex items-center gap-6">
          {/* Display Username */}
          <span className="text-gray-700 font-medium text-sm">
            Welcome, <span className="text-orange-400">{displayName}</span>!
          </span>

          {!isLoggedIn && (
            <button
              onClick={() => setTriggerLoginModal(true)}
              className="bg-gradient-to-r from-orange-300 to-rose-300 text-white 
                            hover:from-orange-400 hover:to-rose-400
                            px-4 py-2 rounded-lg shadow-md hover:scale-105 transition cursor-pointer"
            >
              Login
            </button>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-orange-300 to-rose-300 text-white 
                            hover:from-orange-400 hover:to-rose-400
                            px-4 py-2 rounded-lg shadow-md hover:scale-105 transition cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>

        {/** Hamburger Icon */}
        <button
          className="hidden max-[900px]:block text-gray-700 hover:text-orange-500 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/** When screen size is small */}
      <div
        className={`hidden max-[900px]:flex bg-white/95 backdrop-blur-sm shadow-sm flex-col items-center overflow-hidden
                        transition-all duration-300 ease-in-out border-t-[0.5px] border-gray-300
                        ${menuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 py-0"}`}
      >
        <NavLink
          onClick={() => {
            handleClearItems();
            setMenuOpen(false);
          }}
          to="/"
          className="w-full text-center py-2 font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
        >
          Home
        </NavLink>

        <NavLink
          onClick={() => {
            handleClearItems();
            setMenuOpen(false);
          }}
          to="/category-select"
          className="w-full text-center py-2 font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
        >
          Find Your Fit
        </NavLink>

        <NavLink
          onClick={() => {
            handleClearItems();
            setMenuOpen(false);
          }}
          to="/global"
          className="w-full text-center py-2 font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
        >
          Trending
        </NavLink>

        <button
          onClick={() => {
            setMenuOpen(false);
            alert("Past rankings not yet implemented!");
          }}
          className="w-full text-center py-2 font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
        >
          Preference History
        </button>
      </div>
    </header>
  );
}

export default Header;
