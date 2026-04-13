import { useEffect, useState, useRef } from "react";
import PriceSlider from "../components/PriceSlider";
// import { recommendedItems } from "../data/session";

type rankedItem = {
  imageUrl: string;
  name: string;
  brand: string;
  price: string | number;
  detailUrl: string;
  elo: number;
  productId: string;
};

type Item = {
  imageUrl: string;
  name: string;
  brand: string;
  price: string | number;
  detailUrl: string;
  productId: string;
};

function GlobalLeaderboardPage() {
  const API_URL = import.meta.env.VITE_VOTE_URL;
  const T1_URL = import.meta.env.VITE_T1_URL;
  const T2_URL = import.meta.env.VITE_T2_URL;
  const [items, setItems] = useState<rankedItem[]>([]); // filtered items for UI
  const [selectedItem, setSelectedItem] = useState<Item | rankedItem | null>(
    null,
  );

  // keep track of the currently selected category so that we can refresh (get the data again)
  const [selectedCategory, setSelectedCategory] = useState<string>("dresses");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const TOP_N_ITEMS = 15;

  const categories: string[] = [
    "dresses",
    "jackets",
    "shoes",
    "bags",
    "shorts",
    "jeans",
  ];
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const fetchIdRef = useRef(0);
  const fetchLeaderboard = async () => {
    const currentFetchId = ++fetchIdRef.current;

    try {
      // set error false
      setIsLoading(true);
      setItems([]);

      // response should give the top n items from selectedCategory

      const response = await fetch(
        `${API_URL}/leaderboard?category=${selectedCategory.toUpperCase()}&limit=150`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        },
      );

      console.log("Successful GET from /leaderboard API");

      const data = await response.json();
      console.log(data);

      const topProductSin = data.items.map(
        (obj: { productId: string }) => obj.productId,
      );
      const elo = data.items.map((obj: { elo: number }) => obj.elo);

      const newItems: rankedItem[] = [];
      // for loop ten times?
      // fetch based on topProductSin
      let i = 0;
      while (i < topProductSin.length && newItems.length < TOP_N_ITEMS) {
        // top N items only
        const res = await fetch(`${T1_URL}/${topProductSin[i]}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 404 || res.status === 502) {
          i++;
          continue;
        }

        const d = await res.json();

        // filter based on price
        const priceVal = getNumericPrice(d.price);
        if (priceVal >= priceRange[0] && priceVal <= priceRange[1]) {
          d["elo"] = elo[i];
          d["productId"] = topProductSin[i];
          newItems.push(d);

          i++;
        } else {
          i++;
          continue;
        }
      }

      if (currentFetchId !== fetchIdRef.current) return;
      console.log("Successful GET from /productInfo API");

      setItems(newItems);
      setIsLoading(false);
    } catch (error) {
      // set error true and handle it;
    }
  };

  //initial fetch (most likely for dresses) + refresh logic
  useEffect(() => {
    // Reset price when category changes
    if (priceRange[0] != 0 || priceRange[1] != 10000) {
      setPriceRange([0, 10000]);
    }

    // Immediately fetch leaderboard
    fetchLeaderboard();

    // Interval auto-refresh
    const interval = setInterval(fetchLeaderboard, 600000);
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const getNumericPrice = (price: string | number) => {
    if (typeof price === "number") return price;
    const cleaned = price.replace(/[^0-9.]/g, "");
    return Number(cleaned) || 0;
  };

  // Refetch only when category changes or the user stops moving the slider
  // Debounced range to avoid infinite refetching
  useEffect(() => {
    const timer = setTimeout(() => fetchLeaderboard(), 400);
    return () => clearTimeout(timer);
  }, [priceRange]);

  const [recommendedItems, setRecommendedItems] = useState<Item[] | []>([]);
  async function getSimilarItems(selectedItemId: string) {
    setRecommendedItems([]);

    // fetch productIds of similar items
    const res = await fetch(
      `${T2_URL}/similarItems?category=dresses&productSin=${selectedItemId}`,
      {
        method: "GET",
      },
    );

    if (!res.ok) {
      console.error("similarItems API failed:", res.status);
      return;
    }

    const d = await res.json();
    const newSimilarItems: Item[] = [];

    // populate info of similar items
    for (let i = 0; i < d.recommendationIds.length; i++) {
      const res2 = await fetch(
        `${T1_URL}/productInfo/${d.recommendationIds[i]}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const d2 = await res2.json();
      d2["productId"] = d.recommendationIds[i];

      newSimilarItems.push(d2);
    }

    // update similar items
    setRecommendedItems(newSimilarItems);
  }
  //--- TODO: fetch recommendedItems when selected item changes (when modal opens) ---
  useEffect(() => {
    // if selectedItem is not null
    if (selectedItem != null) {
      // fetch recommended Items based on product Id
      // selectedItem.productId
      // set Recommended Items
      getSimilarItems(selectedItem.productId);
    }
  }, [selectedItem]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-6 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🌍 What's trending?
        </h1>
        <p className="text-gray-600">
          Top-ranked fashion items from the community — updated hourly.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-row gap-2 mb-6 p-2 bg-white rounded-full shadow-sm">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition ${
              selectedCategory === category
                ? "bg-orange-400 text-white font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <PriceSlider priceRange={priceRange} setPriceRange={setPriceRange} />

      {/* Main Content */}
      <div>
        {/* Leaderboard Display */}
        {isLoading ? (
          <div className="text-gray-400 italic text-center py-10">
            Loading leaderboard...
          </div>
        ) : items.length === 0 ? (
          <div className="text-gray-400 italic text-center py-10">
            No items were found <span className="not-italic">😔</span>
          </div>
        ) : (
          <>
            {/* Top 3 Items */}
            <div className="flex justify-center items-end w-full max-w-7xl mx-auto py-12">
              <div className="flex justify-between items-end w-[85%] gap-8">
                {/* Left (#2) */}
                <div className="w-[32%] h-[60%] min-w-[200px] flex justify-center">
                  {items[1] ? (
                    <div
                      onClick={() => setSelectedItem(items[1])}
                      className="relative flex flex-col items-center cursor-pointer hover:scale-105 transition-transform w-full h-full"
                    >
                      <div className="bg-gray-100 rounded-3xl shadow-lg flex flex-col items-center justify-end w-full h-full p-6 relative overflow-hidden">
                        <div className="absolute top-3 right-3 bg-gray-300 text-gray-800 font-bold text-lg px-3 py-1 rounded-xl shadow-sm">
                          #2
                        </div>
                        <img
                          src={items[1].imageUrl}
                          className="w-[85%] h-[75%] object-contain mb-3"
                        />
                        <p className="font-semibold text-center">
                          {items[1].name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {items[1].brand}
                        </p>
                        <p className="text-gray-600 text-xs mt-2">
                          Price: <b>{items[1].price}</b>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>

                {/* Center (#1) */}
                <div className="w-[38%] h-[75%] min-w-[220px] flex justify-center">
                  {items[0] ? (
                    <div
                      onClick={() => setSelectedItem(items[0])}
                      className="relative flex flex-col items-center cursor-pointer hover:scale-110 transition-transform w-full h-full"
                    >
                      <div className="bg-gradient-to-b from-yellow-100 to-yellow-400 rounded-3xl shadow-2xl flex flex-col items-center justify-end w-full h-full p-8 relative overflow-hidden">
                        <div className="absolute top-3 right-3 bg-yellow-500 text-white font-extrabold text-xl px-4 py-1 rounded-xl shadow-md">
                          #1
                        </div>
                        <img
                          src={items[0].imageUrl}
                          className="w-[90%] h-[80%] object-contain mb-3"
                        />
                        <p className="font-bold text-center">{items[0].name}</p>
                        <p className="text-gray-700">{items[0].brand}</p>
                        <p className="text-gray-600 text-xs mt-2">
                          Price: <b>{items[0].price}</b>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>

                {/* Right (#3) */}
                <div className="w-[32%] h-[55%] min-w-[200px] flex justify-center">
                  {items[2] ? (
                    <div
                      onClick={() => setSelectedItem(items[2])}
                      className="relative flex flex-col items-center cursor-pointer hover:scale-105 transition-transform w-full h-full"
                    >
                      <div className="bg-orange-100 rounded-3xl shadow-lg flex flex-col items-center justify-end w-full h-full p-6 relative overflow-hidden">
                        <div className="absolute top-3 right-3 bg-orange-300 text-white font-bold text-lg px-3 py-1 rounded-xl shadow-sm">
                          #3
                        </div>
                        <img
                          src={items[2].imageUrl}
                          className="w-[85%] h-[70%] object-contain mb-3"
                        />
                        <p className="font-semibold text-center">
                          {items[2].name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {items[2].brand}
                        </p>
                        <p className="text-gray-600 text-xs mt-2">
                          Price: <b>{items[2].price}</b>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
              </div>
            </div>

            {/* Rest of the Ranks in Grid Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
              {items.slice(3, items.length).map((item, idx) => (
                <div
                  key={idx + 3}
                  onClick={() => setSelectedItem(item)}
                  className="group relative cursor-pointer bg-white/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl p-5 transition-transform hover:-translate-y-1"
                >
                  <span className="absolute -top-3 -right-3 bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    #{idx + 4}
                  </span>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-28 h-36 object-contain mx-auto mb-3"
                  />
                  <p className="font-semibold text-gray-900 text-center group-hover:text-orange-500 transition-colors">
                    {item.name}
                  </p>
                  <p className="text-gray-500 text-sm text-center">
                    {item.brand}
                  </p>
                  <p className="text-gray-600 text-xs text-center mt-2">
                    Price: <span className="font-bold">{item.price}</span>
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal for item details */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-10 w-full max-w-[700px] max-h-[85vh] shadow-2xl flex gap-10"
          >
            {/* ========== (Selected Item) ========== */}
            <div className="flex-1 flex flex-col items-center text-center overflow-auto">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Selected Item
              </h4>

              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.name}
                className="max-w-full max-h-[475px] object-contain mx-auto rounded-lg mb-4"
              />

              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {selectedItem.name}
              </h3>

              <p className="text-gray-500 mb-1">{selectedItem.brand}</p>
              <p className="text-gray-600 text-sm mb-4">{selectedItem.price}</p>

              <div className="flex justify-center gap-4 mt-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 bg-orange-300 hover:bg-orange-400 text-white rounded-md shadow-md font-medium cursor-pointer"
                >
                  Close
                </button>

                <a
                  href={selectedItem.detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-orange-300 hover:bg-orange-400 text-white rounded-md shadow-md font-medium"
                >
                  Go To Item
                </a>
              </div>
              <div className="mb-2"></div>
            </div>

            {/* ========== (Similar Items) ========== */}
            <div className="w-[250px] flex flex-col gap-6 overflow-auto pr-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-1">
                Similar Items
              </h4>

              {recommendedItems.length > 0 ? (
                <>
                  {recommendedItems.map((rec, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedItem(rec)}
                      className="cursor-pointer bg-gray-50 rounded-xl shadow p-4 hover:shadow-md transition"
                    >
                      <img
                        src={rec.imageUrl}
                        alt={rec.name}
                        className="w-full h-32 object-contain rounded-md mb-2"
                      />
                      <p className="font-medium text-gray-700 truncate">
                        {rec.name}
                      </p>
                      <p className="text-gray-500 text-sm">{rec.brand}</p>
                      <p className="text-gray-600 text-xs mt-1">{rec.price}</p>
                    </div>
                  ))}
                  <div></div>
                </>
              ) : (
                <>
                  <div className="text-gray-400 italic text-center py-10">
                    Loading Similar Items...
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GlobalLeaderboardPage;
