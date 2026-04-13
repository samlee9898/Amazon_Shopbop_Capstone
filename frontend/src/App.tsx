import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CategorySelectionPage from "./pages/CategorySelectionPage";
import PairRankingPage from "./pages/PairRankingPage";
import GlobalLeaderboardPage from "./pages/GlobalLeaderboard";
import SessionSummaryPage from "./pages/SessionSummaryPage";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import { ItemsContext, type Item } from "./context/ItemsContext";
import { AuthContext } from "./context/AuthContext";
import LoginModal from "./components/LoginModal";
import PastRankingsPage from "./pages/PastRankingsPage";
import LearnMorePage from "./pages/LearnMorePage";

function App() {
  const [itemsArray, setItemsArray] = useState<Item[]>([]);
  const [username, setUsername] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [triggerLoginModal, setTriggerLoginModal] = useState(false);

  const loginUrl = import.meta.env.VITE_LOGIN_URL;

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch(`${loginUrl}/isLoggedIn`, {
          method: "GET",
          credentials: "include", // sends cookies with the request
          headers: { Accept: "application/json" },
        });

        const data = await res.json();
        if (res.status === 200) {
          if (data.authenticated) {
            setIsLoggedIn(true);
            setUsername(data.user.username);
          } else {
            console.log(
              "successful auth status fetch, but you are not logged in",
            );
            setIsLoggedIn(false);
          }
        } else if (res.status === 401) {
          // session expired
          setIsLoggedIn(false);
          setUsername("");

          // only redirect if currently on protected pages
          const protectedPages = ["/past-rankings"];

          if (protectedPages.includes(window.location.pathname)) {
            alert("Login Session Expired!");
            window.location.href = "/";
          }
        }
      } catch (err) {
        console.error("Failed to fetch auth status:", err);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();

    // recheck every
    const interval = setInterval(checkAuthStatus, 120 * 1000); // 2 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{ username, setUsername, isLoggedIn, setIsLoggedIn }}
    >
      <ItemsContext.Provider value={{ itemsArray, setItemsArray }}>
        <BrowserRouter>
          <Header setTriggerLoginModal={setTriggerLoginModal} />

          <div className="pt-18">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/category-select"
                element={<CategorySelectionPage />}
              />
              <Route
                path="/pair-rank/:category"
                element={<PairRankingPage />}
              />
              <Route
                path="/session-summary/:category"
                element={<SessionSummaryPage />}
              />
              <Route path="/global" element={<GlobalLeaderboardPage />} />
              <Route path="/past-rankings" element={<PastRankingsPage />} />
              <Route path="/learn-more" element={<LearnMorePage />} />
            </Routes>
          </div>

          {triggerLoginModal && (
            <LoginModal onClose={() => setTriggerLoginModal(false)} />
          )}
        </BrowserRouter>
      </ItemsContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
