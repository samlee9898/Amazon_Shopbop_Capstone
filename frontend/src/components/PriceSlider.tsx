import Slider from "rc-slider";
import "rc-slider/assets/index.css";

type PriceSliderProps = {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
};

export default function PriceSlider({
  priceRange,
  setPriceRange,
}: PriceSliderProps) {
  return (
    <div className="w-full max-w-xl my-2 flex flex-col items-center text-center">
      {/* Centered Label */}
      <p className="text-gray-700 font-medium mb-1 text-xs">Price Range</p>

      {/* Centered Value Display */}
      <p className="text-gray-600 text-sm mb-3 font-bold">
        ${priceRange[0]} <span className="font-semibold">-</span> $
        {priceRange[1]}
      </p>

      <div className="w-full px-2">
        <Slider
          range
          min={0}
          max={10000}
          allowCross={false}
          value={priceRange}
          onChange={(values) => setPriceRange(values as [number, number])}
          className="my-slider"
        />
      </div>
    </div>
  );
}
