
// Main image types

import ThreeHorLinesSvg from "../assets/division-types/3-hor-lines.svg";
import BottomHillWithCandleSvg from "../assets/division-types/bottom-hill-with-candle.svg";
import BottomHillSvg from "../assets/division-types/bottom-hill.svg";
import EmptySvg from "../assets/division-types/empty.svg";
import OvalSvg from "../assets/division-types/oval.svg";
import TopTwoArrowsSvg from "../assets/division-types/top-two-arrows.svg";
import TriangleSvg from "../assets/division-types/triangle.svg";

// Top image types

import circle1Svg from "../assets/top-image-types/circle-1.svg";
import circle2Svg from "../assets/top-image-types/circle-2.svg";
import circle3Svg from "../assets/top-image-types/circle-3.svg";
import circle4Svg from "../assets/top-image-types/circle-4.svg";

import circleCrossedSvg from "../assets/top-image-types/circle-crossed.svg";
import filledRectSvg from "../assets/top-image-types/filled-rect.svg";

import line1Svg from "../assets/top-image-types/line-1.svg";
import line1UnderHatSvg from "../assets/top-image-types/line-1-under-hat.svg";
import line2Svg from "../assets/top-image-types/line-2.svg";
import line2UnderHatSvg from "../assets/top-image-types/line-2-under-hat.svg";
import line3Svg from "../assets/top-image-types/line-3.svg";
import line3UnderHatSvg from "../assets/top-image-types/line-3-under-hat.svg";

import x1Svg from "../assets/top-image-types/x-1.svg";
import x1UnderHatSvg from "../assets/top-image-types/x-1-under-hat.svg";

import x2Svg from "../assets/top-image-types/x-2.svg";
import x2UnderHatSvg from "../assets/top-image-types/x-2-under-hat.svg";

import x3Svg from "../assets/top-image-types/x-3.svg";

import x4Svg from "../assets/top-image-types/x-4.svg";
import x5Svg from "../assets/top-image-types/x-5.svg";
import x6Svg from "../assets/top-image-types/x-6.svg";

const svgFromPath = (path: string | undefined) => {
  if (!path) return null;

  switch (path) {
    // Top image types

    case "../assets/top-image-types/circle-1.svg": return circle1Svg;
    case "../assets/top-image-types/circle-2.svg": return circle2Svg;
    case "../assets/top-image-types/circle-3.svg": return circle3Svg;
    case "../assets/top-image-types/circle-4.svg": return circle4Svg;

    case "../assets/top-image-types/circle-crossed.svg": return circleCrossedSvg;
    case "../assets/top-image-types/filled-rect.svg": return filledRectSvg;

    case "../assets/top-image-types/line-1.svg": return line1Svg;
    case "../assets/top-image-types/line-1-under-hat.svg": return line1UnderHatSvg;
    case "../assets/top-image-types/line-2.svg": return line2Svg;
    case "../assets/top-image-types/line-2-under-hat.svg": return line2UnderHatSvg;
    case "../assets/top-image-types/line-3.svg": return line3Svg;
    case "../assets/top-image-types/line-3-under-hat.svg": return line3UnderHatSvg;

    case "../assets/top-image-types/x-1.svg": return x1Svg;
    case "../assets/top-image-types/x-1-under-hat.svg": return x1UnderHatSvg;
    case "../assets/top-image-types/x-2.svg": return x2Svg;
    case "../assets/top-image-types/x-2-under-hat.svg": return x2UnderHatSvg;
    case "../assets/top-image-types/x-3.svg": return x3Svg;
    case "../assets/top-image-types/x-4.svg": return x4Svg;
    case "../assets/top-image-types/x-5.svg": return x5Svg;
    case "../assets/top-image-types/x-6.svg": return x6Svg;

    // Main image types

    case "../assets/division-types/3-hor-lines.svg": return ThreeHorLinesSvg;
    case "../assets/division-types/bottom-hill-with-candle.svg": return BottomHillWithCandleSvg;
    case "../assets/division-types/bottom-hill.svg": return BottomHillSvg;
    case "../assets/division-types/empty.svg": return EmptySvg;
    case "../assets/division-types/oval.svg": return OvalSvg;
    case "../assets/division-types/top-two-arrows.svg": return TopTwoArrowsSvg;
    case "../assets/division-types/triangle.svg": return TriangleSvg;

    default: return null;
  }
}

export default svgFromPath;