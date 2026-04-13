import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { ItemsContext, type Item } from "../context/ItemsContext.tsx";
import { AuthContext } from "../context/AuthContext.tsx";

function PairRankingPage() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_VOTE_URL;
  const VITE_S_API = import.meta.env.VITE_S_API;
  const { category } = useParams<{ category: string }>();
  if (!category) throw new Error("No Category Selected"); // safety, but won't happen at all

  //make a request based on category (get 16 random items for this category)! to replace "items"
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${VITE_S_API}/?category=${category}`, {
          headers: { Accept: "application/json" },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(`Failed to fetch items for category: ${category}`);
        }

        setItems(data);

        console.log("Successful GET for RandomItems");
      } catch (err) {
        console.error("Error fetching items:", err);
        console.error("Returning to previous page...");

        navigate("/category-select");
      }
    };

    fetchItems();
  }, []); // initial fetch

  const context = useContext(ItemsContext);
  if (!context) throw new Error("ItemsContext not Found!");
  const { itemsArray, setItemsArray } = context;

  const [trialIndex, setTrialIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const currentPair = [items[trialIndex * 2], items[trialIndex * 2 + 1]];

  type ResultLog = [category: string, winnerId: string, loserId: string][];

  const [resultArr, setResultArr] = useState<ResultLog>([]);

  /** Save user selectedItem + Increment trial index + POST votes at end of session */
  const saveSelection = async (selectedItem: Item, idx: number) => {
    console.log(`User selected: ${selectedItem.sk.substring(4)}`);

    const newItemsArray = [...itemsArray, selectedItem];
    setItemsArray(newItemsArray); // for session summary

    const winnerId = currentPair[idx].sk.substring(4);
    const loserId = currentPair[(idx + 1) % 2].sk.substring(4);

    const newResultArr: ResultLog = [
      ...resultArr,
      [category, winnerId, loserId],
    ];
    setResultArr(newResultArr);

    if (trialIndex < 7) {
      setTrialIndex(trialIndex + 1);
    } else {
      setShowCompletion(true);

      try {
        const res = await fetch(`${API_URL}/vote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            votes: newResultArr,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to save session to server");
        }

        console.log("Successful POST to /vote API");
      } catch (err) {
        console.error("Error submitting session:", err);
      } finally {
        if (!isLoggedIn) saveSessionLocally(newResultArr);
        else saveSessionDB(newResultArr);

        setTimeout(() => {
          navigate(`/session-summary/${category.toLowerCase()}`);
        }, 1500);
      }
    }
  };

  async function handleSkip() {
    if (trialIndex < 7) {
      setTrialIndex(trialIndex + 1);
    } else {
      setShowCompletion(true);

      try {
        const res = await fetch(`${API_URL}/vote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            votes: resultArr,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to save session to server");
        }

        console.log("Successful POST to /vote API");
      } catch (err) {
        console.error("Error submitting session:", err);
      } finally {
        if (!isLoggedIn) saveSessionLocally(resultArr);
        else saveSessionDB(resultArr);

        setTimeout(() => {
          navigate(`/session-summary/${category?.toLowerCase()}`);
        }, 1500);
      }
    }
  }

  function handleUndo() {
    setResultArr((prev) => prev.slice(0, -1));
    setItemsArray((prev) => prev.slice(0, -1));
    setTrialIndex((prev) => Math.max(prev - 1, 0));
  }

  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("AuthContext not Found!");
  const { username, isLoggedIn } = authContext;

  // store sessions locally for guest users
  function saveSessionLocally(itemsArr: ResultLog) {
    const stored = sessionStorage.getItem("guest");
    const storedSessions = stored ? JSON.parse(stored) : [];

    const newSession = {
      userId: "guest", // after login, flush this with actual username in login page
      votes: itemsArr,
    };

    storedSessions.push(newSession);

    sessionStorage.setItem("guest", JSON.stringify(storedSessions));
  }

  async function saveSessionDB(itemsArr: ResultLog) {
    const newSession = {
      userId: username,
      votes: itemsArr,
    };

    // POST this newSession to Database
    try {
      const res = await fetch(`${API_URL}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSession),
      });

      if (!res.ok) {
        throw new Error("Failed to save session to server");
      }

      console.log("Successful user session data POST");
    } catch (err) {
      console.error("Error submitting session:", err);
    }
  }

  const handleClearItems = () => {
    setItemsArray([]);
  };

  return (
    <div
      className="flex flex-col bg-gray-50 relative"
      style={{ height: "calc(100vh - 4.5rem)" }}
    >
      {/* Back Button */}
      <div className="max-w-6xl w-full mx-auto px-6 pt-2 lg:pt-4 flex items-center">
        <button
          onClick={() => {
            handleClearItems();
            navigate("/category-select");
          }}
          className="flex items-center text-gray-600 hover:text-orange-500 transition font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center text-center px-4 pb-5 mt-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
          Which item do you prefer?
        </h1>
        <p className="text-gray-600 max-w-xl mb-2 md:mb-4 lg:mb-9">
          {" "}
          Choose the item that appeals to you more. ({trialIndex + 1}/8)
        </p>

        {items.length >= 2 ? (
          <div className="w-full flex gap-10 items-center justify-center max-w-[90rem]">
            {/* Undo */}
            <button
              onClick={handleUndo}
              className={`shrink-0 flex items-center justify-center
                        rounded-full w-20 h-20 shadow-lg
                        transition-all duration-300 active:scale-95 
                        ${
                          trialIndex === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-orange-300 text-gray-700 cursor-pointer hover:scale-103 hover:text-white"
                        }`}
            >
              <span className="text-xl font-bold">Undo</span>
            </button>

            {/* Pair Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 mx-6 items-start">
              {currentPair.map((item, idx) => (
                <div
                  key={item?.sk ?? idx}
                  onClick={() => saveSelection(item, idx)}
                  className="group rounded-2xl p-6 bg-white shadow-md hover:shadow-xl h-[70vh]
                             transition hover:scale-[1.02] cursor-pointer
                             flex flex-col items-center justify-between"
                >
                  <h2 className="text-2xl font-semibold mb-4 group-hover:text-orange-500 transition-colors">
                    {item?.name ?? "Loading..."}
                  </h2>

                  {item?.imageUrl && (
                    <div className="bg-gray-100 rounded-lg overflow-hidden w-full flex justify-center items-center h-[50vh]">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}

                  <div className="flex flex-col items-center mt-4">
                    <p className="text-gray-500 font-medium">{item.brand}</p>
                    <p className="text-gray-500 mb-3">${item.price}</p>
                    <button className="px-6 py-1 lg:py-2 bg-gray-100 group-hover:bg-orange-400 group-hover:text-white group-hover:shadow-md text-gray-800 font-semibold rounded-lg transition-all duration-300 cursor-pointer">
                      Choose this item
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="shrink-0 flex items-center justify-center
                        rounded-full w-20 h-20 shadow-lg hover:scale-103
                        transition-all duration-300 active:scale-95 cursor-pointer bg-gray-200 hover:bg-orange-300 text-gray-700 hover:text-white"
            >
              <span className="text-2xl font-bold">Skip</span>
            </button>
          </div>
        ) : (
          <p className="text-gray-500 mt-10">Loading items...</p>
        )}
      </main>

      {/* Completion Message */}
      {showCompletion && (
        <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center text-center z-50">
          <div className="animate-fadeIn bg-white rounded-2xl p-10 shadow-2xl max-w-md w-[90%]">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              You’ve completed this category!
            </h2>
            <p className="text-gray text-lg-600 mb-4">
              Thank you for ranking your preferences —{" "}
              <span className="text-gray-500 text-md">
                redirecting you to your session summary...
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PairRankingPage;
