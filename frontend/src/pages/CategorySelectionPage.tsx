import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function CategorySelectionPage() {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Dresses",
      img: "https://m.media-amazon.com/images/G/01/Shopbop/p/prod/products/jorti/jorti30517252cf/jorti30517252cf_1758729735865_2-0._QL90_UX564_.jpg",
      description: "Find your perfect dress style",
      imgRatio: "object-[50%_20%]",
    },
    {
      name: "Jackets",
      img: "https://m.media-amazon.com/images/G/01/Shopbop/p/prod/products/twppp/twppp3015366246/twppp3015366246_1760028557619_2-0._QL90_UX564_.jpg",
      description: "Discover your ideal outerwear",
      imgRatio: "object-[50%_40%]",
    },
    {
      name: "Shoes",
      img: "https://m.media-amazon.com/images/G/01/Shopbop/p/prod/products/jhall/jhall300591c925/jhall300591c925_1749501262341_2-0._QL90_UX282_.jpg",
      description: "Step into your style",
      imgRatio: "object-[50%_50%]",
    },
    {
      name: "Bags",
      img: "https://m.media-amazon.com/images/G/01/Shopbop/p/prod/products/courr/courr300541071b/courr300541071b_1758825191583_2-0._QL90_UX564_.jpg",
      description: "Carry your style forward",
      imgRatio: "object-[50%_60%]",
    },
    {
      name: "Shorts",
      img: "https://m.media-amazon.com/images/G/01/Shopbop/p/prod/products/alice/alice47086266dd/alice47086266dd_1757965109407_2-0._QL90_UX564_.jpg",
      description: "Relaxed and ready",
      imgRatio: "object-[50%_10%]",
    },
    {
      name: "Jeans",
      img: "https://m.media-amazon.com/images/G/01/Shopbop/p/prod/products/refor/refor41725250c0/refor41725250c0_1738602877491_2-0._QL90_UX564_.jpg",
      description: "Classic and timeless",
      imgRatio: "object-[50%_10%]",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Back Button */}
      <div className="max-w-6xl w-full mx-auto px-6 pt-4 flex items-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-orange-500 transition font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center text-center px-4 mt-4">
        <h1 className="text-3xl font-bold mb-2">Find Your Fit</h1>
        <p className="text-gray-600 max-w-xl mb-10">
          We'll find you a perfect fit. Select a category you want to find your
          fit for!
        </p>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/pair-rank/${cat.name.toLowerCase()}`)}
              className="group flex flex-col rounded-2xl shadow-md border border-gray-200 overflow-hidden 
                         transition-all duration-300 ease-out 
                         hover:scale-[1.04] hover:shadow-xl cursor-pointer bg-white"
            >
              {/* Image */}
              <div className="h-40 overflow-hidden">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className={`w-full h-full object-cover ${cat.imgRatio} transition-transform duration-500 ease-out group-hover:scale-105`}
                />
              </div>

              {/* Text + Button */}
              <div className="flex flex-col flex-1 p-4 justify-between text-left">
                <h3 className="text-lg font-semibold mb-1.5 ml-2 group-hover:text-orange-500 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-600 ml-2 mb-3">
                  {cat.description}
                </p>

                {/* Button that lights up when card is hovered */}
                <div
                  className="mt-auto px-4 py-2 rounded-lg font-medium text-center transition-all duration-300
                             bg-gray-100 text-gray-700 
                             group-hover:bg-orange-400 group-hover:text-white group-hover:shadow-md"
                >
                  Select
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default CategorySelectionPage;
