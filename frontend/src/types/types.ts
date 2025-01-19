import { DateTime } from 'luxon';


export enum DivisionType {
  Armour = "armour",
  Armour1 = "armour-1",
  ArmourAirborne = "armour-airborne",
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
};

export const divisionTypes = [
  { type: DivisionType.Armour, uaName: "Бронетехніка", svgPath: "../assets/division-types/armour.svg" },
  { type: DivisionType.Armour1, uaName: "Бронетехніка", svgPath: "../assets/division-types/armour-1.svg" },
  { type: DivisionType.ArmourAirborne, uaName: "Бронетехніка", svgPath: "../assets/division-types/armour-airborne.svg" },
];

export enum TopImageType {
  None = "none",
  Company = "company",
  Battalion = "battalion",
  Brigade = "brigade"
}

export enum MainImageType {
  Infantry = "infantry",
  Mechanized = "mechanized",
  Armored = "armored",
  Artillery = "artillery"
}

export const topImageTypes = [
  { type: TopImageType.None, uaName: "None", svgPath: "../assets/division-types/armour.svg" },
  { type: TopImageType.Company, uaName: "Company", svgPath: "../assets/division-types/armour.svg" },
  { type: TopImageType.Battalion, uaName: "Battalion", svgPath: "../assets/division-types/armour.svg" },
  { type: TopImageType.Brigade, uaName: "Brigade", svgPath: "../assets/division-types/armour.svg" },
];

export const mainImageTypes = [
  { type: MainImageType.Infantry, uaName: "Infantry", svgPath: "../assets/division-types/armour.svg" },
  { type: MainImageType.Mechanized, uaName: "Mechanized", svgPath: "../assets/division-types/armour.svg" },
  { type: MainImageType.Armored, uaName: "Armored", svgPath: "../assets/division-types/armour.svg" },
  { type: MainImageType.Artillery, uaName: "Artillery", svgPath: "../assets/division-types/armour.svg" },
];

export interface RowData {
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

  leftBottomAmplificator?: string;
  rightBottomAmplificator?: string;
  centerBottomAmplificator?: string;

  insideCenterTopAmplificator?: string;

  topImageType?: TopImageType;
  mainImageTypes?: MainImageType[];
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
