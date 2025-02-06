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
  Cross = "cross",
  HorLine = "hor-line",
  VertLine = "vert-line",
  BotFilledTriangle = "bot-filled-triangle",
  Mechanised = "mechanised",
  FilledCircle = "filled-circle",
  Maintenance = "maintenance",
  Retorts = "retorts",
  Ew = "ew",
}

export const defaultElemGraphInfo: DivisionGraphInfo = {
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
  isUplifted: false,
};

export const defaultElem: RowData = {
  ...defaultElemGraphInfo,

  unitName: "",
  numOfVehicles: 10,
  distBetweenVehicles: 0.05,
  distToNextConvoy: 0,
  distBetweenConvoyHeadAndInitialPointOfDeparture: 7,
  speedOfExtraction: 15,
  speed: 25,

  depthOfConvoy: 0,
  timeToPassPointOfDeparture_convoyStart: DateTime.now(),
  timeToPassPointOfDeparture_convoyEnd: DateTime.now(),
  timeOfStartOfMovement: DateTime.now(),
  timeOfEndOfMovement: DateTime.now(),
};

export const topImageTypes = [
  { type: TopImageType.Circle1, uaName: "Відділення", svgPath: "../assets/top-image-types/circle-1.svg" },
  { type: TopImageType.Circle2, uaName: "Секція", svgPath: "../assets/top-image-types/circle-2.svg" },
  { type: TopImageType.Circle3, uaName: "Взвод", svgPath: "../assets/top-image-types/circle-3.svg" },
  { type: TopImageType.Circle4, uaName: "-", svgPath: "../assets/top-image-types/circle-4.svg" },
  { type: TopImageType.CircleCrossed, uaName: "Розрахунок/екіпаж", svgPath: "../assets/top-image-types/circle-crossed.svg" },
  { type: TopImageType.FilledRect, uaName: "FilledRect", svgPath: "../assets/top-image-types/filled-rect.svg" },
  { type: TopImageType.Line1, uaName: "Рота/батарея", svgPath: "../assets/top-image-types/line-1.svg" },
  { type: TopImageType.Line1UnderHat, uaName: "Рота/батарея", svgPath: "../assets/top-image-types/line-1-under-hat.svg" },
  { type: TopImageType.Line2, uaName: "Батальйон/дивізіон", svgPath: "../assets/top-image-types/line-2.svg" },
  { type: TopImageType.Line2UnderHat, uaName: "Батальйон/дивізіон", svgPath: "../assets/top-image-types/line-2-under-hat.svg" },
  { type: TopImageType.Line3, uaName: "Полк", svgPath: "../assets/top-image-types/line-3.svg" },
  { type: TopImageType.Line3UnderHat, uaName: "Полк", svgPath: "../assets/top-image-types/line-3-under-hat.svg" },

  { type: TopImageType.X1, uaName: "Бригада", svgPath: "../assets/top-image-types/x-1.svg" },
  { type: TopImageType.X1UnderHat, uaName: "Бригада", svgPath: "../assets/top-image-types/x-1-under-hat.svg" },
  { type: TopImageType.X2, uaName: "Дивізія", svgPath: "../assets/top-image-types/x-2.svg" },
  { type: TopImageType.X2UnderHat, uaName: "Дивізія", svgPath: "../assets/top-image-types/x-2-under-hat.svg" },
  { type: TopImageType.X3, uaName: "Корпус, ОТУ, МК, КМП", svgPath: "../assets/top-image-types/x-3.svg" },
  { type: TopImageType.X4, uaName: "ОК, ОУВ, ПвК, Армія", svgPath: "../assets/top-image-types/x-4.svg" },
  { type: TopImageType.X5, uaName: "Види та роди ЗС України, група армій", svgPath: "../assets/top-image-types/x-5.svg" },
  { type: TopImageType.X6, uaName: "Збройні Сили України", svgPath: "../assets/top-image-types/x-6.svg" },
];

export const mainImageTypes = [
  { type: MainImageType.ThreeHorLines, uaName: "Три горизонтальні лінії", svgPath: "../assets/division-types/3-hor-lines.svg" },
  { type: MainImageType.BottomHillWithCandle, uaName: "Гора з свічкою", svgPath: "../assets/division-types/bottom-hill-with-candle.svg" },
  { type: MainImageType.BottomHill, uaName: "Нижня Гора", svgPath: "../assets/division-types/bottom-hill.svg" },
  { type: MainImageType.Empty, uaName: "Пусто", svgPath: "../assets/division-types/empty.svg" },
  { type: MainImageType.Oval, uaName: "Овал", svgPath: "../assets/division-types/oval.svg" },
  { type: MainImageType.TopTwoArrows, uaName: "Дві стрілки зверху", svgPath: "../assets/division-types/top-two-arrows.svg" },
  { type: MainImageType.Triangle, uaName: "Трикутник", svgPath: "../assets/division-types/triangle.svg" },
  { type: MainImageType.Cross, uaName: "Дві діагональні лінії", svgPath: "../assets/division-types/cross.svg" },
  { type: MainImageType.HorLine, uaName: "Горизонтальна лінія", svgPath: "../assets/division-types/hor-line.svg" },
  { type: MainImageType.VertLine, uaName: "Вертикальна лінія", svgPath: "../assets/division-types/vert-line.svg" },
  { type: MainImageType.BotFilledTriangle, uaName: "Трикутник знизу", svgPath: "../assets/division-types/bot-filled-triangle.svg" },
  { type: MainImageType.Mechanised, uaName: "Механізований", svgPath: "../assets/division-types/mechanised.svg" },
  { type: MainImageType.FilledCircle, uaName: "Зафарбований круг", svgPath: "../assets/division-types/filled-circle.svg" },
  { type: MainImageType.Maintenance, uaName: "Обслуговування", svgPath: "../assets/division-types/maintenance.svg" },
  { type: MainImageType.Retorts, uaName: "Реторти", svgPath: "../assets/division-types/retorts.svg" },
  { type: MainImageType.Ew, uaName: "EW", svgPath: "../assets/division-types/ew.svg" },
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

  isUplifted?: boolean;
}

export interface RowData extends DivisionGraphInfo {
  unitName: string;
  numOfVehicles: number;
  distBetweenVehicles: number;
  distToNextConvoy: number;
  distBetweenConvoyHeadAndInitialPointOfDeparture: number;
  speedOfExtraction: number;
  speed: number;

  additionalDivision?: DivisionGraphInfo;

  // Calculated data
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
  additionalDivisionName?: string;
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

export const defaultGroups = [
  { name: "Похідна охорона" },
  { name: "Підрозділи ТхЗ, ТлЗ" },
];

export interface RoutesDto {
  routes: Route[];
  groups: Group[];
  routeName: string;
  tableName: string;
}

export const defaultRouteDataEx1: RoutesDto = {
  routes: [
    {
      rows: [
        { ...defaultElem,
          numOfVehicles: 25,
          distToNextConvoy: 0,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 7,
        },
        { ...defaultElem,
          numOfVehicles: 61,
          distToNextConvoy: 5,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 7.5,
        },
        { ...defaultElem,
          numOfVehicles: 39,
          distToNextConvoy: 2,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 8,
        },
        { ...defaultElem,
          numOfVehicles: 122,
          distToNextConvoy: 2,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 8.5,
        },
        { ...defaultElem,
          numOfVehicles: 37,
          distToNextConvoy: 2,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 8,
        },
        { ...defaultElem,
          numOfVehicles: 37,
          distToNextConvoy: 2,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 7,
        },
        { ...defaultElem,
          numOfVehicles: 25,
          distToNextConvoy: 2,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 7.5,
        },
        { ...defaultElem,
          numOfVehicles: 45,
          distToNextConvoy: 1,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 8,
        },
        { ...defaultElem,
          numOfVehicles: 7,
          distToNextConvoy: 1,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 8.5,
        },
        { ...defaultElem,
          numOfVehicles: 32,
          distToNextConvoy: 2,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 8,
        },
      ],
      routeData: {
        directiveTimeOfEndOfMovement: DateTime.now().set({
          day: 24,
          month: 10,
          year: 2024,
          hour: 6,
          minute: 0,
          second: 0,
          millisecond: 0,
        }),
        depthOfDestinationArea: 17,
        totalTimeOfStops: 2,
        lengthOfRoute: 250,
        depthOfFullConvoy: 0,
      },
      groupsInfo: [
        {
          name: defaultGroups[0].name,
          rows: [0, 1, 2],
        },
        {
          name: defaultGroups[1].name,
          rows: [3, 4, 5, 6, 7, 8, 9],
        },
      ],
      additionalDivisionName: "",
    },
  ],
  groups: defaultGroups,
  routeName: "ПОБУДОВА ПОХІДНОГО ПОРЯДКУ",
  tableName: "НАЗВА ТАБЛИЦІ",
};

export const defaultRouteDataEx2: RoutesDto = {
  routes: [
    {
      rows: [
        { ...defaultElem,
          numOfVehicles: 110,
          distToNextConvoy: 0,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 7.8,
        },
        { ...defaultElem,
          numOfVehicles: 13,
          distToNextConvoy: 15,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 7.9,
        },
        { ...defaultElem,
          numOfVehicles: 95,
          distToNextConvoy: 2,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 8.3,
        },
        { ...defaultElem,
          numOfVehicles: 68,
          distToNextConvoy: 2,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 8,
        },
        { ...defaultElem,
          numOfVehicles: 36,
          distToNextConvoy: 1,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 7,
        },
        { ...defaultElem,
          numOfVehicles: 42,
          distToNextConvoy: 1,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 7.5,
        },
        { ...defaultElem,
          numOfVehicles: 26,
          distToNextConvoy: 1,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 8,
        },
        { ...defaultElem,
          numOfVehicles: 24,
          distToNextConvoy: 1,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 8.5,
        },
        { ...defaultElem,
          numOfVehicles: 115,
          distToNextConvoy: 1,
          distBetweenConvoyHeadAndInitialPointOfDeparture: 8,
        },
      ],
      routeData: {
        directiveTimeOfEndOfMovement: DateTime.now().set({
          day: 24,
          month: 10,
          year: 2024,
          hour: 5,
          minute: 45,
          second: 0,
          millisecond: 0,
        }),
        depthOfDestinationArea: 17,
        totalTimeOfStops: 2,
        lengthOfRoute: 250,
        depthOfFullConvoy: 0,
      },
      groupsInfo: [
        {
          name: defaultGroups[0].name,
          rows: [0, 1, 2],
        },
        {
          name: defaultGroups[1].name,
          rows: [3, 4, 5, 6, 7, 8],
        },
      ],
      additionalDivisionName: "",
    },
  ],
  groups: defaultGroups,
  routeName: "ПОБУДОВА ПОХІДНОГО ПОРЯДКУ",
  tableName: "НАЗВА ТАБЛИЦІ",
};
