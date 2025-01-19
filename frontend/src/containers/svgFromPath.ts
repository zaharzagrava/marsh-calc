
import armourSvg from "../assets/division-types/armour.svg";
import armour1Svg from "../assets/division-types/armour-1.svg";
import armourAirborneSvg from "../assets/division-types/armour-airborne.svg";

const svgFromPath = (path: string | undefined) => {
  if (!path) return null;

  switch (path) {
    case "../assets/division-types/armour.svg": return armourSvg;
    case "../assets/division-types/armour-1.svg": return armour1Svg;
    case "../assets/division-types/armour-airborne.svg": return armourAirborneSvg;
    default: return null;
  }
}

export default svgFromPath;