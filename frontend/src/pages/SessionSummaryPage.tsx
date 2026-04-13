import { useNavigate, useParams } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import { ItemsContext } from "../context/ItemsContext.tsx";
import { AuthContext } from "../context/AuthContext.tsx";
import PostGuestSession from "../components/PostGuestSession.tsx";

function SessionSummaryPage() {
  const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;
  const navigate = useNavigate();

  /** --- I think there is a better way to handle isLoggedIn by "Get Request with username" */
  /** --- TODO (currently hardcoded) --- */
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("AuthContext not Found!");
  const { setUsername, isLoggedIn, setIsLoggedIn } = authContext;

  const [showModal, setShowModal] = useState(false);

  const usernameInputRef = useRef<HTMLInputElement>(null);

  const { category } = useParams<{ category: string }>();
  if (!category) throw new Error("No Category Selected"); // safety, but won't happen at all

  const context = useContext(ItemsContext);
  if (!context) throw new Error("ItemsContext not Found!");

  const { itemsArray, setItemsArray } = context;

  const [isSaved, setIsSaved] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  console.log(Date.now());
  const sessionDate = new Date().toLocaleString();

  useEffect(() => {
    // wait for 3 seconds
    // then turn on modal if guest
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        setShowModal(true);
      }
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  async function handleLogin() {
    let name = usernameInputRef.current?.value ?? "";
    name = name.trim();
    if (name === "") {
      alert("The Field Should not be Empty!");
      return;
    }

    // -- TODO -- actual login POST with username
    try {
      const res = await fetch(`${LOGIN_URL}/login`, {
        method: "POST",
        credentials: "include", // so token is stored in cookie
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username: name }), // include body
      });

      if (res.ok) {
        const data = await res.json();
        setUsername(data.username ?? name); // use data username or just name
        setIsLoggedIn(true);
        setShowModal(false);

        // if user logs in
        PostGuestSession(name);
      } else {
        alert("Failed to log in");
      }
    } catch (error) {
      console.error(error);
      alert("Login request failed");
    }
  }

  function handleGuest() {
    setIsLoggedIn(false); // safety
    setShowModal(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-6 py-10">
      {/* Login Modal */}
      {!isLoggedIn && showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg text-center max-w-xl px-15 py-10">
            <h2 className="text-2xl font-bold mb-4">Hi there!</h2>
            <p className="text-gray-600 mx-auto max-w-[70%] mb-2">
              Log in to keep your session safe and come back to it anytime.
            </p>
            <p className="text-sm text-gray-400 mb-3">
              try to be as "unique" as possible
            </p>
            <input
              ref={usernameInputRef}
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
                onClick={handleGuest}
                className="bg-rose-300 hover:bg-rose-400 text-white font-semibold 
                        py-2 px-4 rounded-lg w-full transition cursor-pointer"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Session Summary
        </h1>
        <p className="text-gray-600">
          Category:{" "}
          <span className="font-medium">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>{" "}
          | Date: <span className="font-medium">{sessionDate}</span>
        </p>
      </div>

      {/* Selected Items */}
      <div className="bg-white shadow-md rounded-2xl w-full max-w-3xl p-6 mb-10 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          ✨ Your Selected Items
        </h2>

        {itemsArray.length > 0 ? (
          <div className="flex flex-col gap-4">
            {itemsArray.map(
              ({ name, brand, imageUrl, detailUrl, price }, idx) => (
                <div
                  key={idx}
                  className="flex flex-row items-center justify-between gap-5
                         bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200
                         shadow-sm hover:from-gray-100 hover:to-gray-200 hover:shadow-md
                         rounded-xl p-4 transition"
                >
                  <div className="flex flex-row items-center gap-5">
                    <img
                      src={imageUrl}
                      alt={name}
                      onClick={() => setPreviewImg(imageUrl)}
                      className="w-24 h-24 rounded-lg bg-white shadow-sm hover:shadow-md 
                             object-contain hover:scale-105 transition-transform duration-300 
                             cursor-zoom-in"
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {name}
                      </p>
                      <p className="text-base text-gray-600">{brand}</p>
                      <p className="text-sm text-gray-500 font-medium mt-1">
                        ${price}
                      </p>
                    </div>
                  </div>

                  {/* “View Item” button */}
                  <a
                    href={`https://shopbop.com${detailUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-300 text-white font-bold text-sm px-3 py-2 rounded-md 
                           hover:bg-orange-400 hover:shadow-md transition mr-2"
                  >
                    View Item →
                  </a>
                </div>
              ),
            )}
          </div>
        ) : (
          <p className="text-gray-500 mb-6">
            Looks like nothing caught your eye this round — want to give it
            another go?
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div
        className="flex flex-wrap justify-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-md border border-gray-200
                   w-full max-w-5xl"
      >
        {!isLoggedIn ? (
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 min-w-[150px] px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 
           hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg font-semibold transition cursor-pointer"
          >
            Sign in to view Preference History
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/past-rankings")}
              className="flex-1 min-w-[150px] text-white px-5 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 
           hover:from-emerald-600 hover:to-cyan-600 text-gray-800 rounded-lg font-semibold transition cursor-pointer"
            >
              View Preference History
            </button>
          </>
        )}

        <button
          onClick={() => {
            setItemsArray([]);
            navigate("/category-select");
          }}
          className="flex-1 min-w-[150px] px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800
                      rounded-lg font-semibold shadow-md transition cursor-pointer"
        >
          Start New Session
        </button>

        <button
          onClick={() => {
            setItemsArray([]);
            navigate("/");
          }}
          className="flex-1 min-w-[150px] px-5 py-3 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg font-semibold shadow-md transition cursor-pointer"
        >
          ← Return Home
        </button>
      </div>

      {/* Modal (Full Image View) */}
      {previewImg && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setPreviewImg(null)}
        >
          <img
            src={previewImg}
            className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-2xl"
            alt="Preview"
          />
        </div>
      )}
    </div>
  );
}

export default SessionSummaryPage;
