
// Main image types

import ThreeHorLinesSvg from "../assets/division-types/3-hor-lines.svg";
import BottomHillWithCandleSvg from "../assets/division-types/bottom-hill-with-candle.svg";
import BottomHillSvg from "../assets/division-types/bottom-hill.svg";
import EmptySvg from "../assets/division-types/empty.svg";
import OvalSvg from "../assets/division-types/oval.svg";
import TopTwoArrowsSvg from "../assets/division-types/top-two-arrows.svg";
import TriangleSvg from "../assets/division-types/triangle.svg";
import CrossSvg from "../assets/division-types/cross.svg";
import HorLineSvg from "../assets/division-types/hor-line.svg";
import VertLineSvg from "../assets/division-types/vert-line.svg";
import BotFilledTriangleSvg from "../assets/division-types/bot-filled-triangle.svg";
import MechanisedSvg from "../assets/division-types/mechanised.svg";
import FilledCircleSvg from "../assets/division-types/filled-circle.svg";
import MaintenanceSvg from "../assets/division-types/maintenance.svg";
import RetortsSvg from "../assets/division-types/retorts.svg";
import EwSvg from "../assets/division-types/ew.svg";
import BotHorLineSvg from "../assets/division-types/bot-hor-line.svg";
import ThreeWavesFacingBotSvg from "../assets/division-types/3-waves-facing-bot.svg";

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
    case "../assets/division-types/cross.svg": return CrossSvg;
    case "../assets/division-types/hor-line.svg": return HorLineSvg;
    case "../assets/division-types/vert-line.svg": return VertLineSvg;
    case "../assets/division-types/bot-filled-triangle.svg": return BotFilledTriangleSvg;
    case "../assets/division-types/mechanised.svg": return MechanisedSvg;
    case "../assets/division-types/filled-circle.svg": return FilledCircleSvg;
    case "../assets/division-types/maintenance.svg": return MaintenanceSvg;
    case "../assets/division-types/retorts.svg": return RetortsSvg;
    case "../assets/division-types/ew.svg": return EwSvg;
    case "../assets/division-types/bot-hor-line.svg": return BotHorLineSvg;
    case "../assets/division-types/3-waves-facing-bot.svg": return ThreeWavesFacingBotSvg;

    default: return null;
  }
}

export default svgFromPath;