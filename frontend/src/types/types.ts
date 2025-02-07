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
  BotHorLine = "bot-hor-line",
  ThreeWavesFacingBot = "3-waves-facing-bot",
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
  stopsData: [],
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
  { type: MainImageType.BotHorLine, uaName: "Горизонтальна лінія знизу", svgPath: "../assets/division-types/bot-hor-line.svg" },
  { type: MainImageType.ThreeWavesFacingBot, uaName: "Три хвилі знизу", svgPath: "../assets/division-types/3-waves-facing-bot.svg" },
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

  topAdditionalDivision?: DivisionGraphInfo;
  bottomAdditionalDivision?: DivisionGraphInfo;

  // Calculated data
  depthOfConvoy: number;
  timeToPassPointOfDeparture_convoyStart: DateTime;
  timeToPassPointOfDeparture_convoyEnd: DateTime;

  timeOfStartOfMovement: DateTime;
  timeOfEndOfMovement: DateTime;

  stopsData: DateTime[];
}

export interface RouteData {
  directiveTimeOfEndOfMovement: DateTime;
  depthOfDestinationArea: number;
  stops: { duration: number; name: string; distance: number }[];
  lengthOfRoute: number;
  depthOfFullConvoy: number;
}

export interface Route {
  rows: RowData[];
  routeData: RouteData;
  groupsInfo: GroupInfo[];
  topAdditionalDivisionName?: string;
  bottomAdditionalDivisionName?: string;
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
  "routes": [
    {
      "rows": [
        {
          "leftBottomAmplificator": "1",
          "rightBottomAmplificator": "2",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "ГПЗ",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "line-1",
          "mainImageTypes": [
            "empty",
            "cross",
            "oval"
          ],
          "isUplifted": false,
          "unitName": "1мр ГПЗ",
          "numOfVehicles": 25,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 2,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 7,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 1.2,
        },
        {
          "leftBottomAmplificator": "2",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "ОКП",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "x-1",
          "mainImageTypes": [
            "empty",
            "cross",
            "oval"
          ],
          "isUplifted": true,
          "unitName": "ОКП",
          "numOfVehicles": 61,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 5,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 7.5,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 2.7,
        },
        {
          "leftBottomAmplificator": "2",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "line-2",
          "mainImageTypes": [
            "empty",
            "cross",
            "oval"
          ],
          "isUplifted": false,
          "unitName": "2мб",
          "numOfVehicles": 39,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 2,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 8,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 1.9,
        },
        {
          "leftBottomAmplificator": "1",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "line-2",
          "mainImageTypes": [
            "empty",
            "oval",
            "filled-circle"
          ],
          "isUplifted": false,
          "unitName": "1адн",
          "numOfVehicles": 122,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 2,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 8.5,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 6.05,
        },
        {
          "leftBottomAmplificator": "зрадн",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "line-2",
          "mainImageTypes": [
            "empty",
            "bottom-hill-with-candle"
          ],
          "isUplifted": false,
          "unitName": "зрадн",
          "numOfVehicles": 37,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 2,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 8,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 1.8,
        },
        {
          "leftBottomAmplificator": "птадн",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "line-2",
          "mainImageTypes": [
            "empty",
            "triangle"
          ],
          "isUplifted": false,
          "unitName": "птадн",
          "numOfVehicles": 37,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 2,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 7,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 1.8,
        },
        {
          "leftBottomAmplificator": "2",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "line-2",
          "mainImageTypes": [
            "empty",
            "filled-circle",
            "oval"
          ],
          "isUplifted": false,
          "unitName": "2адн",
          "numOfVehicles": 25,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 2,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 7.5,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 1.2,
        },
        {
          "leftBottomAmplificator": "",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "ГІЗ",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "line-2",
          "mainImageTypes": [
            "empty",
            "mechanised"
          ],
          "isUplifted": false,
          "unitName": "ГІЗ",
          "numOfVehicles": 45,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 1,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 8,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 2.2,
        },
        {
          "leftBottomAmplificator": "",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "ТКП",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "x-1",
          "mainImageTypes": [
            "empty",
            "cross"
          ],
          "isUplifted": true,
          "unitName": "ТКП",
          "numOfVehicles": 7,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 1,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 8.5,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 0.3,
        },
        {
          "leftBottomAmplificator": "ррвб",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "line-2",
          "mainImageTypes": [
            "empty",
            "maintenance"
          ],
          "isUplifted": false,
          "unitName": "рвб",
          "numOfVehicles": 32,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 2,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 8,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 1.55,
        }
      ],
      "routeData": {
        "directiveTimeOfEndOfMovement":DateTime.now().set({
          day: 24,
          month: 9,
          year: 2025,
          hour: 7,
          minute: 0,
          second: 0,
          millisecond: 0,
        }),
        "depthOfDestinationArea": 17,
        "stops": [
          {
            "duration": 1,
            "name": "Пункт регулювання 1",
            "distance": 50
          },
          {
            "duration": 1,
            "distance": 100
          }
        ],
        "lengthOfRoute": 160,
        "depthOfFullConvoy": 0
      },
      "groupsInfo": [
        {
          "name": "Похідна охорона",
          "rows": [
            0
          ]
        },
        {
          "name": "Колона головних сил",
          "rows": [
            1,
            2,
            3,
            4,
            5,
            6,
            7
          ]
        },
        {
          "name": "Підрозділи ТхЗ, ТлЗ, МедЗ",
          "rows": [
            8,
            9
          ]
        }
      ],
      "topAdditionalDivisionName": "",
      "bottomAdditionalDivisionName": ""
    },
    {
      "rows": [
        {
          "leftBottomAmplificator": "2",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "line-2",
          "mainImageTypes": [
            "empty",
            "cross",
            "oval"
          ],
          "isUplifted": true,
          "unitName": "1мб аванг",
          "numOfVehicles": 110,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 2,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 7.8,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 5.45,
        },
        {
          "leftBottomAmplificator": "2",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "ЗКП",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "x-1",
          "mainImageTypes": [
            "empty",
            "cross",
            "oval"
          ],
          "isUplifted": true,
          "unitName": "ЗКП",
          "numOfVehicles": 13,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 15,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 7.9,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 0.6,
        },
        {
          "leftBottomAmplificator": "3",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "line-2",
          "mainImageTypes": [
            "empty",
            "cross",
            "oval"
          ],
          "isUplifted": false,
          "unitName": "3мб",
          "numOfVehicles": 95,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 2,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 8.3,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 4.7,
        },
        {
          "leftBottomAmplificator": "тб",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "line-2",
          "mainImageTypes": [
            "empty",
            "oval"
          ],
          "isUplifted": false,
          "unitName": "тб",
          "numOfVehicles": 68,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 2,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 8,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 3.35,
        },
        {
          "leftBottomAmplificator": "заб",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": TopImageType,
          "mainImageTypes": [
            "empty",
            "bottom-hill-with-candle"
          ],
          "isUplifted": false,
          "unitName": "заб",
          "numOfVehicles": 36,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 1,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 7,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 1.75,
        },
        {
          "leftBottomAmplificator": "реадн",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "line-2",
          "mainImageTypes": [
            "empty",
            "filled-circle",
            "top-two-arrows"
          ],
          "isUplifted": false,
          "unitName": "реадн",
          "numOfVehicles": 42,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 1,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 7.5,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 2.05,
        },
        {
          "leftBottomAmplificator": "рреб",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "line-1",
          "mainImageTypes": [
            "empty",
            "ew"
          ],
          "isUplifted": false,
          "unitName": "рреб",
          "numOfVehicles": 26,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 1,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 8,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 1.25,
        },
        {
          "leftBottomAmplificator": "ррхбз",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "line-1",
          "mainImageTypes": [
            "empty",
            "retorts"
          ],
          "isUplifted": false,
          "unitName": "ррхбз",
          "numOfVehicles": 24,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 1,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 8.5,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 1.15,
        },
        {
          "leftBottomAmplificator": "бмз",
          "rightBottomAmplificator": "",
          "centerBottomAmplificator": "",
          "leftTopAmplificator": "",
          "rightTopAmplificator": "",
          "centerTopAmplificator": "",
          "leftAmplificator": "",
          "rightAmplificator": "",
          "centerAmplificator": "",
          "topImageType": "line-2",
          "mainImageTypes": [
            "empty"
          ],
          "isUplifted": false,
          "unitName": "бмз",
          "numOfVehicles": 115,
          "distBetweenVehicles": 0.05,
          "distToNextConvoy": 1,
          "distBetweenConvoyHeadAndInitialPointOfDeparture": 8,
          "speedOfExtraction": 15,
          "speed": 25,
          "depthOfConvoy": 5.7,
        }
      ],
      "routeData": {
        "directiveTimeOfEndOfMovement": DateTime.now().set({
          day: 24,
          month: 9,
          year: 2025,
          hour: 7,
          minute: 0,
          second: 0,
          millisecond: 0,
        }),
        "depthOfDestinationArea": 17,
        "stops": [
          {
            "duration": 1,
            "name": "Пункт регулювання 1",
            "distance": 50
          },
          {
            "duration": 1,
            "distance": 100
          }
        ],
        "lengthOfRoute": 172,
        "depthOfFullConvoy": 0
      },
      "groupsInfo": [
        {
          "name": "Похідна охорона",
          "rows": [
            0
          ]
        },
        {
          "name": "Колона головних сил",
          "rows": [
            1,
            2,
            3,
            4,
            5,
            6,
            7
          ]
        },
        {
          "name": "Підрозділи ТхЗ, ТлЗ, МедЗ",
          "rows": [
            8
          ]
        }
      ],
      "topAdditionalDivisionName": "",
      "bottomAdditionalDivisionName": ""
    }
  ],
  "groups": [
    {
      "name": "Похідна охорона"
    },
    {
      "name": "Колона головних сил"
    },
    {
      "name": "Підрозділи ТхЗ, ТлЗ, МедЗ"
    }
  ],
  "routeName": "Похідний порядок 2 омбр",
  "tableName": "Таблиця маршу 2 омбр"
} as any;

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
        stops: [{ duration: 2, name: "Пункт регулювання 1", distance: 10 }],
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
      topAdditionalDivisionName: "",
      bottomAdditionalDivisionName: "",
    },
  ],
  groups: defaultGroups,
  routeName: "ПОБУДОВА ПОХІДНОГО ПОРЯДКУ",
  tableName: "НАЗВА ТАБЛИЦІ",
};
