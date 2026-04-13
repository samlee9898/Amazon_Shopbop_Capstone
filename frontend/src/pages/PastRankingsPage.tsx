import { useEffect, useState, useContext } from "react";
import { dummyItems } from "../data/session"; // ---TODO--- temporary fallback until backend is ready
import { AuthContext } from "../context/AuthContext";

export default function PastRankingsPage() {
  // scroll all the way to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("AuthContext not Found!");
  const { username } = authContext;

  const ITEMS_PER_PAGE = 16;

  // ---TODO--- Backend data
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Pagination
  const [page, setPage] = useState(1);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Filters (wire these to UI)
  const [filters, setFilters] = useState({
    category: "All",
    sort: "recent",
    votedAt: "any",
    priceMin: "",
    priceMax: "",
    colors: [],
    sizes: [],
    brands: [],
  });

  // Fetch from backend when page or filters change
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      console.log(filters);
      const params = new URLSearchParams({
        username: username,
        page: page,
        limit: ITEMS_PER_PAGE,
        category: filters.category,
        sort: filters.sort,
        votedAt: filters.votedAt,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        colors: filters.colors.join(","),
        sizes: filters.sizes.join(","),
        brands: filters.brands.join(","),
      });

      console.log(`api will look like: /api/items?${params.toString()}`);

      const USE_REAL_BACKEND = false;
      if (USE_REAL_BACKEND) {
        // Build query params
        // api will look like: /api/items?page=1&limit=16&category=Shorts&sort=recent&votedAt=any&priceMin=&priceMax=&colors=&sizes=&brands=

        const res = await fetch(`/api/items?${params.toString()}`); // ---TODO--- Replace with real backend URL
        const data = await res.json();

        setItems(data.items);
        setTotalPages(data.totalPages);
        // and also statistics
      } else {
        // ---TODO--- Temporary fallback: local pagination using dummyItems
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;

        setItems(dummyItems.slice(start, end));
        setTotalPages(Math.ceil(dummyItems.length / ITEMS_PER_PAGE));
      }

      setLoading(false);
    }

    fetchData();
  }, [page, filters]);

  // Summary statistics (still hardcoded)
  const summaryStats = [
    { label: "Total Items Voted", value: 34 },
    {
      label: "Highest Price",
      value: `$${Math.max(...dummyItems.map((i) => i.price))}`,
    },
    {
      label: "Lowest Price",
      value: `$${Math.min(...dummyItems.map((i) => i.price))}`,
    },
    { label: "Average Price", value: "$343" },
    { label: "Your Favorite Color", value: "Rose" },
    { label: "Your Favorite Brand", value: "Zara" },
  ];

  // Filter options
  const filtersList = [
    { id: 1, label: "Colors", options: ["Red", "Blue", "Green", "Black"] },
    { id: 2, label: "Sizes", options: ["XS", "S", "M", "L", "XL"] },
    { id: 3, label: "Brands", options: ["Zara", "H&M", "Uniqlo", "Gucci"] },
  ];

  return (
    <div className="min-h-screen flex flex-col p-4 mx-4 md:mx-10 lg:mx-20 xl:mx-40">
      {/* Top Row */}
      <div className="grid grid-cols-[1fr_3fr] justify-between items-center gap-20 mb-4 mt-3">
        <h1 className="text-3xl font-bold font-body text-center">
          <span className="text-orange-400">{username}</span>'s Preference
          History
        </h1>

        {/* Statistics */}
        <div className="flex flex-wrap gap-2 p-4 rounded-xl justify-end">
          {summaryStats.map((stat) => (
            <div
              key={stat.label}
              className="px-3 py-2 bg-white rounded-full shadow text-sm font-medium flex items-center"
            >
              <span className="text-gray-700 mr-1">{stat.label}:</span>
              <span className="text-black font-semibold">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-[1fr_4fr] gap-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 space-y-6 h-fit">
          <h2 className="text-xl font-semibold mb-2">Filters</h2>

          {/* Category Filter */}
          <div>
            <h3 className="font-semibold mb-1">Category</h3>
            <ul className="space-y-1 pl-2">
              {[
                "Dresses",
                "Jackets",
                "Shoes",
                "Bags",
                "Shorts",
                "Jeans",
                "All",
              ].map((cat) => (
                <li
                  key={cat}
                  className={`cursor-pointer hover:underline`}
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, category: cat }));
                    setPage(1);
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="font-semibold mb-1">Sort By</h3>
            <select
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, sort: e.target.value }));
                setPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 w-full"
            >
              <option value="recent">Most Recently Voted</option>
              <option value="oldest">Least Recently Voted</option>
            </select>
          </div>

          {/* Voted At */}
          <div>
            <h3 className="font-semibold mb-1">Voted At</h3>
            <select
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, votedAt: e.target.value }));
                setPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 w-full"
            >
              <option value="any">Any time</option>
              <option value="today">Today</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-semibold mb-1">Price ($)</h3>
            <div className="flex flex-col gap-2 pl-2">
              <div>
                <span className="mr-2">From:</span>
                <input
                  type="number"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceMin: e.target.value,
                    }))
                  }
                  className="border border-gray-300 px-2 py-1 w-[120px] rounded-md"
                />
              </div>

              <div>
                <span className="mr-2">To:</span>
                <input
                  type="number"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceMax: e.target.value,
                    }))
                  }
                  className="border border-gray-300 px-2 py-1 w-[120px] rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Extra Filters */}
          {filtersList.map((filter) => (
            <div key={filter.id}>
              <h3 className="font-semibold mb-1">{filter.label}</h3>
              <ul className="space-y-1 pl-2">
                {filter.options.map((opt) => (
                  <li
                    key={opt}
                    className="cursor-pointer hover:underline"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        [filter.label.toLowerCase()]: prev[
                          filter.label.toLowerCase()
                        ]?.includes(opt)
                          ? prev[filter.label.toLowerCase()].filter(
                              (x) => x !== opt,
                            )
                          : [...(prev[filter.label.toLowerCase()] || []), opt],
                      }));
                      setPage(1);
                    }}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="flex flex-col rounded-xl p-4 overflow-y-auto">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : (
            <>
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                {items.map((item) => (
                  <a
                    key={item.sk}
                    href={item.detailUrl}
                    className="flex flex-col items-center hover:opacity-90"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="rounded-lg mb-2"
                    />
                    <h4 className="font-semibold text-center">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.brand}</p>
                    <p className="text-sm font-medium">${item.price}</p>
                  </a>
                ))}
              </div>

              {/* Pagination */}
              <div className="w-full flex justify-center mt-10 gap-2 items-center">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300 disabled:opacity-50"
                >
                  ←
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (num) => (
                      <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`px-3 py-1 rounded-md text-sm 
                        ${
                          page === num
                            ? "bg-gray-800 text-white"
                            : "bg-white hover:bg-gray-100"
                        }
                      `}
                      >
                        {num}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300 disabled:opacity-50"
                >
                  →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
