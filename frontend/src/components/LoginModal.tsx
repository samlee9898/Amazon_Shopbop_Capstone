import { useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PostGuestSession from "./PostGuestSession";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const { setIsLoggedIn, setUsername } = useContext(AuthContext)!;
  const usernameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const loginUrl = import.meta.env.VITE_LOGIN_URL;

  async function handleLogin() {
    const name = usernameRef.current?.value.trim();
    if (!name) {
      alert("Username required");
      return;
    }

    try {
      const res = await fetch(`${loginUrl}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name }),
      });

      console.log(res);
      if (res.ok) {
        const data = await res.json();
        setUsername(data.username ?? name);
        setIsLoggedIn(true);
        onClose();
        navigate("/");

        // if login succesful, also post guest data
        PostGuestSession(name);
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg text-center max-w-xl px-15 py-10">
        <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
        <p className="text-gray-600 mx-auto max-w-[70%] mb-2">
          Log in to keep your session safe and come back to it anytime.
        </p>
        <p className="text-sm text-gray-400 mb-3">
          try to be as "unique" as possible
        </p>
        <input
          ref={usernameRef}
          type="text"
          placeholder="Enter your username"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4 
                        focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <div className="flex flex-row gap-4">
          <button
            onClick={handleLogin}
            className="bg-rose-300 hover:bg-rose-400 text-white font-semibold 
                        py-2 px-4 rounded-lg w-full transition cursor-pointer"
          >
            Log In
          </button>
          <button
            onClick={onClose}
            className="bg-rose-300 hover:bg-rose-400 text-white font-semibold 
                        py-2 px-4 rounded-lg w-full transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
