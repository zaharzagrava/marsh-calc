import { DateTime } from 'luxon';


export enum DivisionType {
  Armour = "armour",
  Armour1 = "armour-1",
  ArmourAirborne = "armour-airborne",
}

export const divisionTypes = [
  { type: DivisionType.Armour, uaName: "Бронетехніка", svgPath: "../assets/division-types/armour.svg" },
  { type: DivisionType.Armour1, uaName: "Бронетехніка", svgPath: "../assets/division-types/armour-1.svg" },
  { type: DivisionType.ArmourAirborne, uaName: "Бронетехніка", svgPath: "../assets/division-types/armour-airborne.svg" },
];

export enum TopImageType {
  None = "none",

  Circle1 = "circle-1",
  Circle2 = "circle-2",
  Circle3 = "circle-3",
  Circle4 = "circle-4",
  CircleCrossed = "circle-crossed",
  FilledRect = "filled-rect",

  Line1 = "line-1",
  Line1UnderHat = "line-1-under-hat",
  Line2 = "line-2",
  Line2UnderHat = "line-2-under-hat",
  Line3 = "line-3",
  Line3UnderHat = "line-3-under-hat",

  X1 = "x-1",
  X1UnderHat = "x-1-under-hat",
  X2 = "x-2",
  X2UnderHat = "x-2-under-hat",
  X3 = "x-3",
  X4 = "x-4",
  X5 = "x-5",
  X6 = "x-6",
}

export enum MainImageType {
  ThreeHorLines = "3-hor-lines",
  BottomHillWithCandle = "bottom-hill-with-candle",
  BottomHill = "bottom-hill",
  Empty = "empty",
  Oval = "oval",
  TopTwoArrows = "top-two-arrows",
  Triangle = "triangle",
}

export const defaultElem: RowData = {
  unitName: "",
  numOfVehicles: 10,
  numOfConvoys: 1,
  distBetweenVehicles: 4000,
  distToNextConvoy: 100,
  distBetweenConvoyHeadAndInitialPointOfDeparture: 7,
  speedOfExtraction: 15,
  speed: 25,

  depthOfConvoy: 0,
  timeToPassPointOfDeparture_convoyStart: DateTime.now(),
  timeToPassPointOfDeparture_convoyEnd: DateTime.now(),
  timeOfStartOfMovement: DateTime.now(),
  timeOfEndOfMovement: DateTime.now(),

  leftBottomAmplificator: "1",
  rightBottomAmplificator: "2",
  centerBottomAmplificator: "3",

  leftTopAmplificator: "4",
  rightTopAmplificator: "5",
  centerTopAmplificator: "6",

  leftAmplificator: "7",
  rightAmplificator: "8",
  centerAmplificator: "9",

  topImageType: TopImageType.None,
  mainImageTypes: [MainImageType.Empty],
};

export const topImageTypes = [
  { type: TopImageType.None, uaName: "None", svgPath: "../assets/division-types/armour.svg" },
  { type: TopImageType.Circle1, uaName: "Circle1", svgPath: "../assets/top-image-types/circle-1.svg" },
  { type: TopImageType.Circle2, uaName: "Circle2", svgPath: "../assets/top-image-types/circle-2.svg" },
  { type: TopImageType.Circle3, uaName: "Circle3", svgPath: "../assets/top-image-types/circle-3.svg" },
  { type: TopImageType.Circle4, uaName: "Circle4", svgPath: "../assets/top-image-types/circle-4.svg" },
  { type: TopImageType.CircleCrossed, uaName: "CircleCrossed", svgPath: "../assets/top-image-types/circle-crossed.svg" },
  { type: TopImageType.FilledRect, uaName: "FilledRect", svgPath: "../assets/top-image-types/filled-rect.svg" },
  { type: TopImageType.Line1, uaName: "Line1", svgPath: "../assets/top-image-types/line-1.svg" },
  { type: TopImageType.Line1UnderHat, uaName: "Line1UnderHat", svgPath: "../assets/top-image-types/line-1-under-hat.svg" },
  { type: TopImageType.Line2, uaName: "Line2", svgPath: "../assets/top-image-types/line-2.svg" },
  { type: TopImageType.Line2UnderHat, uaName: "Line2UnderHat", svgPath: "../assets/top-image-types/line-2-under-hat.svg" },
  { type: TopImageType.Line3, uaName: "Line3", svgPath: "../assets/top-image-types/line-3.svg" },
  { type: TopImageType.Line3UnderHat, uaName: "Line3UnderHat", svgPath: "../assets/top-image-types/line-3-under-hat.svg" },

  { type: TopImageType.X1, uaName: "X1", svgPath: "../assets/top-image-types/x-1.svg" },
  { type: TopImageType.X1UnderHat, uaName: "X1UnderHat", svgPath: "../assets/top-image-types/x-1-under-hat.svg" },
  { type: TopImageType.X2, uaName: "X2", svgPath: "../assets/top-image-types/x-2.svg" },
  { type: TopImageType.X2UnderHat, uaName: "X2UnderHat", svgPath: "../assets/top-image-types/x-2-under-hat.svg" },
  { type: TopImageType.X3, uaName: "X3", svgPath: "../assets/top-image-types/x-3.svg" },
  { type: TopImageType.X4, uaName: "X4", svgPath: "../assets/top-image-types/x-4.svg" },
  { type: TopImageType.X5, uaName: "X5", svgPath: "../assets/top-image-types/x-5.svg" },
  { type: TopImageType.X6, uaName: "X6", svgPath: "../assets/top-image-types/x-6.svg" },
];

export const mainImageTypes = [
  { type: MainImageType.ThreeHorLines, uaName: "ThreeHorLines", svgPath: "../assets/division-types/3-hor-lines.svg" },
  { type: MainImageType.BottomHillWithCandle, uaName: "BottomHillWithCandle", svgPath: "../assets/division-types/bottom-hill-with-candle.svg" },
  { type: MainImageType.BottomHill, uaName: "BottomHill", svgPath: "../assets/division-types/bottom-hill.svg" },
  { type: MainImageType.Empty, uaName: "Empty", svgPath: "../assets/division-types/empty.svg" },
  { type: MainImageType.Oval, uaName: "Oval", svgPath: "../assets/division-types/oval.svg" },
  { type: MainImageType.TopTwoArrows, uaName: "TopTwoArrows", svgPath: "../assets/division-types/top-two-arrows.svg" },
  { type: MainImageType.Triangle, uaName: "Triangle", svgPath: "../assets/division-types/triangle.svg" },
];

export interface DivisionGraphInfo {
  leftBottomAmplificator?: string;
  rightBottomAmplificator?: string;
  centerBottomAmplificator?: string;

  leftTopAmplificator?: string;
  rightTopAmplificator?: string;
  centerTopAmplificator?: string;

  leftAmplificator?: string;
  rightAmplificator?: string;
  centerAmplificator?: string;

  topImageType?: TopImageType;
  mainImageTypes: MainImageType[];
}

export interface RowData extends DivisionGraphInfo {
  unitName: string;
  numOfVehicles: number;
  numOfConvoys: number;
  distBetweenVehicles: number;
  distToNextConvoy: number;
  distBetweenConvoyHeadAndInitialPointOfDeparture: number;
  speedOfExtraction: number;
  speed: number;

  depthOfConvoy: number;
  timeToPassPointOfDeparture_convoyStart: DateTime;
  timeToPassPointOfDeparture_convoyEnd: DateTime;

  timeOfStartOfMovement: DateTime;
  timeOfEndOfMovement: DateTime;
}

export interface RouteData {
  directiveTimeOfEndOfMovement: DateTime;
  depthOfDestinationArea: number;
  totalTimeOfStops: number;
  lengthOfRoute: number;
  depthOfFullConvoy: number;
}

export interface Route {
  rows: RowData[];
  routeData: RouteData;
  groupsInfo: GroupInfo[];
  additionalDivisions: DivisionGraphInfo[];
}

export interface GroupInfo {
  name: string;
  rows: number[];
}

export interface Group {
  name: string;
}

export interface Coordinates {
  x: number;
  y: number;
}
