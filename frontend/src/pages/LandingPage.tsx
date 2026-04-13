import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {/* Background Image */}
      <img
        src="/images/Wardrobe.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Wardrobe"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
        {/* Main Heading With a Logo*/}
        <img
          src="images/Style_Sync_Logo.png"
          className="w-1/2"
          alt="StyleSync_Logo"
        />
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
          <span className="whitespace-nowrap">Break decision fatigue</span>
          <br />
          Shop the trends
        </h1>

        {/* Subtext */}
        <p className="mt-4 text-lg sm:text-xl font-medium text-white/90 max-w-2xl">
          Discover your personal style through quick, side-by-side choices while
          staying inspired by what's trending in the community.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            onClick={() => navigate("/category-select")}
            className="font-semibold text-2xl bg-white text-gray-900 px-8 py-4 rounded-lg 
                       hover:bg-gray-100 transition cursor-pointer hover:shadow-lg transform hover:scale-105"
          >
            Find Your Fit →
          </button>

          <button
            onClick={() => navigate("/learn-more")}
            className="font-semibold text-2xl border-2 border-white text-white px-8 py-4 rounded-lg 
                       hover:bg-white hover:text-gray-900 transition cursor-pointer hover:shadow-lg transform hover:scale-105"
          >
            About Us
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
