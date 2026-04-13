function LearnMorePage() {
  const steps = [
    {
      title: "Start a Find Your Fit Session",
      text: "Choose a category—dresses, tops, shoes, or another style segment. Each session includes a small set of quick, pairwise comparisons.",
      img: "",
    },
    {
      title: "Compare Two Products",
      text: "Look at two items side-by-side. Select the one you prefer. Each choice helps shape your style profile.",
    },
    {
      title: "Complete the Session",
      text: "After 8 comparisons, you get a summary of your picks and a visual look at where they stand compared to the broader community.",
    },
    {
      title: "Explore What's Trending",
      text: "See the highest-rated items across all StyleSync users. Discover trending styles, new brands, and community favorites.",
    },
    {
      title: "Review Your Preference History",
      text: "Logged-in users can view previous sessions, see changes in their preferences over time, and revisit items they liked.",
    },
    {
      title: "Get Recommendations",
      text: "Receive curated suggestions of similar items, generated from your ranking choices.",
    },
  ];

  return (
    // everything besides header
    <div className="flex flex-col min-h-screen gap-6">
      {/* 
            Learn More About StyleSync
            Fashion discovery made simple container
        */}
      <div className="bg-gradient-to-b from-[#fb61f1] to-white w-full flex flex-col justify-center items-center h-[30vh]">
        <h1 className="font-bold text-3xl text-[#b00097]">
          Learn More About StyleSync
        </h1>
        <h2 className="italic text-xl text-[#b00097]">
          Fashion discovery made simple.
        </h2>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4">
        <section className="flex flex-col justify-center items-center">
          <div className="flex flex-row justify-center items-center gap-12 py-5">
            <img
              src="/images/Style_Sync_Logo.png"
              className="w-1/3 h-60 object-contain"
            />
            <p className="w-1/2 text-2xl">
              <span className="text-[#b00097] font-bold">
                Style<span className="text-[#ff3300]">Sync</span>
              </span>{" "}
              is a fashion discovery platform that helps users make faster, more
              confident style decisions through quick, pairwise rankings.
              Instead of scrolling endlessly through product catalogs, users
              compare two items at a time, leading to more intuitive choices and
              a clearer sense of personal style. All items are sourced from{" "}
              <span className="italic">Shopbop</span>, ensuring high-quality,
              curated products.
            </p>
          </div>
        </section>

        {/* 
                Mission, Our values, Our approach container
            */}
        <section className="flex flex-row p-3">
          <div className="flex flex-col justify-center items-center w-1/3 mx-1">
            <img
              src="/images/Mission.png"
              className="w-40 h-40 object-contain mx-auto"
            />
            <p className="font-bold text-[#b00097]">MISSION</p>
            <p className="font-serif">
              Help people discover their style faster through simple, intuitive
              product comparisons that cut through choice overload.
            </p>
          </div>
          <div className="flex flex-col justify-center items-center w-1/3 mx-1">
            <img
              src="/images/Value.png"
              className="w-40 h-40 object-contain mx-auto"
            />
            <p className="font-bold text-[#b00097]">OUR VALUES</p>
            <p className="font-serif">
              Clarity, curiosity, and community insight. Every ranking helps
              reveal what users love and strengthens the overall experience.
            </p>
          </div>
          <div className="flex flex-col justify-center items-center w-1/3 mx-1">
            <img
              src="/images/Approach.png"
              className="w-40 h-40 object-contain mx-auto"
            />
            <p className="font-bold text-[#b00097]">OUR APPROACH</p>
            <p className="font-serif">
              Interactive, data-driven, and user-first. We aim to make fashion
              discovery engaging and lightweight, using quick comparisons to
              surface what truly fits your taste.
            </p>
          </div>
        </section>

        {/* 
                How it works container
            */}
        <section className="flex flex-col justify-center items-center w-full gap-4 p-6">
          <p className="text-3xl pb-2 text-[#b00097]">HOW IT WORKS</p>
          <div className="flex flex-row justify-center items-center">
            <ol className="w-1/2 ml-3">
              {steps.map((step, idx) => (
                <li className="flex flex-row items-center" key={idx}>
                  <img className="p-2" src={`/images/${idx + 1}.png`} />
                  <div className="text-lg">
                    <p className="font-bold text-xl">{step.title}</p>
                    {step.text}
                  </div>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-4 w-1/2 p-4">
              <img
                src="/images/FindYourFit.png"
                className="border-2 border-gray-300 shadow-sm rounded-lg object-contain mx-auto"
              />
              <img
                src="/images/Trending.png"
                className="border-2 border-gray-300 shadow-sm rounded-lg object-contain mx-auto"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LearnMorePage;
