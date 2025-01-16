import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { styled } from "@mui/system";
import { AppState } from "../store/reducer";
import { Stack } from "@mui/material";
import TemplateFrame from "../components/TemplateFrame";
import { DateTime } from "luxon";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

interface RowData {
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

export const columnNames = {
  unitName: "Назва підрозділу",
  numOfVehicles: "Кількість транспортних засобів",
  numOfConvoys: "Кількість колон підрозділу",
  distBetweenVehicles: "Відстань між транспортними засобами (м.)",
  distToNextConvoy: "Відстань між колонами (м.)",
  distBetweenConvoyHeadAndInitialPointOfDeparture:
    "Відстань колон від вихідного пункту (Двід, км)",
  speedOfExtraction: "Швидкість витягування (V - витяг) (км. / год.)",
  speed: "Швидкість руху (V - рух) (км. / год.)",

  depthOfConvoy: "Глибина колони (км.)",
  timeToPassPointOfDeparture_convoyStart:
    "Час проходження вихідного пункту (Голова колонни) (год. хв.)",
  timeToPassPointOfDeparture_convoyEnd:
    "Час проходження кінцевого пункту (Хвіст колонни)(год. хв.)",
  timeOfStartOfMovement: "Час початку руху Висування (год. хв.)",
  timeOfEndOfMovement:
    "Директивний час зосередження підрозділів у районі призначення Tзос. (год. хв.)",
};

// Calculate extra columns for each row
interface RouteData {
  directiveTimeOfEndOfMovement: DateTime;
  depthOfDestinationArea: number;
  totalTimeOfStops: number;
  lengthOfRoute: number;
  depthOfFullConvoy: number;
}

const calculateDepthOfConvoy = (
  numOfVehicles: number,
  distBetweenVehicles: number,
  distToNextConvoy: number
): number => {
  return (numOfVehicles * distBetweenVehicles + distToNextConvoy) / 1000;
};

const calculateExtraColumns = (row: RowData, routeData: RouteData): RowData => {
  const depthOfConvoy = calculateDepthOfConvoy(
    row.numOfVehicles,
    row.distBetweenVehicles,
    row.distToNextConvoy
  );

  console.log("@row");
  console.log(row, routeData);

  let timeToExtractIntoDestination = 0;
  if (routeData.depthOfFullConvoy > routeData.depthOfDestinationArea) {
    console.log(
      "@routeData.depthOfFullConvoy > routeData.depthOfDestinationArea"
    );
    console.log(
      routeData.depthOfFullConvoy,
      routeData.depthOfDestinationArea,
      row.speedOfExtraction
    );
    timeToExtractIntoDestination =
      (routeData.depthOfFullConvoy - routeData.depthOfDestinationArea) /
      row.speedOfExtraction;
  }

  console.log("@timeToExtractIntoDestination");
  console.log(timeToExtractIntoDestination);

  const totalTimeToPassRoute =
    routeData.lengthOfRoute / row.speed + routeData.totalTimeOfStops;
  const totalTimeToPass = totalTimeToPassRoute + timeToExtractIntoDestination;

  console.log("@totalTimeToPass");
  console.log(totalTimeToPass);

  const timeToPassPointOfDeparture_convoyStart =
    routeData.directiveTimeOfEndOfMovement.minus({ hours: totalTimeToPass });
  const timeOfStartOfMovement = timeToPassPointOfDeparture_convoyStart.minus({
    hours:
      row.distBetweenConvoyHeadAndInitialPointOfDeparture /
      row.speedOfExtraction,
  });
  const timeToPassPointOfDeparture_convoyEnd =
    timeToPassPointOfDeparture_convoyStart.plus({
      hours: depthOfConvoy / row.speedOfExtraction,
    }); // TODO: check if this is correct

  console.log("@timeToPassPointOfDeparture_convoyEnd");
  console.log(
    timeToPassPointOfDeparture_convoyStart.toISO(),
    timeToPassPointOfDeparture_convoyEnd.toISO(),
    timeOfStartOfMovement.toISO()
  );

  const timeOfEndOfMovement = timeToPassPointOfDeparture_convoyEnd.plus({
    hours: totalTimeToPassRoute,
  });

  return {
    ...row,
    timeToPassPointOfDeparture_convoyStart,
    timeToPassPointOfDeparture_convoyEnd,
    timeOfStartOfMovement,
    timeOfEndOfMovement,
  };
};

const AppContainer = () => {
  const dispatch = useDispatch();
  const getMyself = useSelector((state: AppState) => state.actions.getMyself);

  useEffect(() => {}, [dispatch, getMyself.success]);

  const formik = useFormik<{
    rows: RowData[];
    routeData: RouteData;
    groups: Group[];
  }>({
    initialValues: {
      rows: [
        {
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
        },
        {
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
        },
        {
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
      groups: [
        {
          name: "Похідна охорона",
          rows: [0, 1],
        },
        {
          name: "Підрозділи ТхЗ, ТлЗ та МедЗ",
          rows: [2],
        },
      ],
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const depthOfFullConvoy = useMemo(
    () =>
      formik.values.rows.reduce(
        (acc, row) =>
          acc +
          calculateDepthOfConvoy(
            row.numOfVehicles,
            row.distBetweenVehicles,
            row.distToNextConvoy
          ),
        0
      ),
    [formik.values.rows]
  );

  const processedRows = useMemo(
    () =>
      formik.values.rows.map((row) =>
        calculateExtraColumns(row, {
          ...formik.values.routeData,
          depthOfFullConvoy,
        })
      ),
    [formik.values.rows, formik.values.routeData, depthOfFullConvoy]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <TemplateFrame>
        <Stack
          direction="column"
          component="main"
          sx={[
            {
              height: { xs: "auto", md: "100%" },
            },
            (theme) => ({
              backgroundImage:
                "radial-gradient(ellipse at 70% 51%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
              backgroundSize: "cover",
              ...theme.applyStyles("dark", {
                backgroundImage:
                  "radial-gradient(at 70% 51%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
              }),
            }),
          ]}
        >
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {Object.entries(columnNames).map(([key, columnName]) => (
                    <TableCell key={key}>{columnName}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {processedRows.map((row, rowIndex) => {
                  return (
                    <TableRow key={rowIndex}>
                      {Object.keys(row).map((key, colIndex) => {
                        return (
                          <TableCell key={`${rowIndex}-${colIndex}`}>
                            <TextField
                              fullWidth
                              value={(() => {
                                if (
                                  [
                                    "timeToPassPointOfDeparture_convoyStart",
                                    "timeToPassPointOfDeparture_convoyEnd",
                                    "timeOfStartOfMovement",
                                    "timeOfEndOfMovement",
                                  ].includes(key)
                                ) {
                                  return (
                                    row[key as keyof RowData] as DateTime
                                  ).toFormat("HH год. mm хв. dd.MM.yyyy");
                                }

                                return row[key as keyof RowData];
                              })()}
                              onChange={(e) => {
                                const newRows = [...formik.values.rows];
                                newRows[rowIndex] = {
                                  ...newRows[rowIndex],
                                  [key]:
                                    key !== "unitName"
                                      ? Number(e.target.value)
                                      : e.target.value,
                                };
                                formik.setFieldValue("rows", newRows);
                              }}
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <DateTimePicker
              label="Директивний час зосередження"
              value={formik.values.routeData.directiveTimeOfEndOfMovement}
              onChange={(newValue) => {
                formik.setFieldValue("directiveTimeOfEndOfMovement", newValue);
              }}
            />
            <TextField
              label="Загальний час зупинки (год.)"
              value={formik.values.routeData.totalTimeOfStops}
              onChange={(e) => {
                formik.setFieldValue(
                  "totalTimeOfStops",
                  Number(e.target.value)
                );
              }}
            />
            <TextField
              label="Довжина маршруту (км.)"
              value={formik.values.routeData.lengthOfRoute}
              onChange={(e) => {
                formik.setFieldValue("lengthOfRoute", Number(e.target.value));
              }}
            />
            <TextField
              label="Глибина району призначення (км.)"
              value={formik.values.routeData.depthOfDestinationArea}
              onChange={(e) => {
                formik.setFieldValue(
                  "depthOfDestinationArea",
                  Number(e.target.value)
                );
              }}
            />
          </Stack>
        <CanvasWithExport rows={processedRows} routeData={formik.values.routeData} groups={formik.values.groups} />
        </Stack>
      </TemplateFrame>
    </LocalizationProvider>
  );
};

interface Group {
  name: string;
  rows: number[];
}

interface Coordinates {
  x: number;
  y: number;
}

const CanvasWithExport = ({
  rows,
  routeData,
  groups,
}: {
  rows: RowData[];
  routeData: RouteData;
  groups: Group[];
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [scale, setScale] = useState<number>(1);

  const exportToPNG = useCallback(() => {
    const svgElement = svgRef.current;

    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    console.log("@svgData");
    console.log(rows, routeData);

    const img = new Image();

    // Set canvas size to match the SVG size
    const { width, height } = svgElement.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const pngData = canvas.toDataURL('image/png');

      // Create a download link
      const link = document.createElement('a');
      link.download = 'canvas-export.png';
      link.href = pngData;
      link.click();
    };

    // Convert SVG data to Base64 URI
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  }, [rows, routeData,]);

  return (
    <div>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width="1600"
        height="900"
        style={{ border: '1px solid black' }}
      >
        {(() => {
          const elements = [];
          let prevGroupWidth = 0;
          for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
            const divisionWidth = 120;
            const divisionHeight = 75;
            const groupMarginX = 25;
            const groupMarginY = 100;

            const group = groups[groupIndex];
            const groupDivisions = group.rows.map((row) => rows[row]);
            const groupOffset: Coordinates = { x: 50 + (prevGroupWidth === 0 ? 0 : prevGroupWidth + groupMarginX), y: 50 };

            const groupWidth = (groupDivisions.length * divisionWidth) + (Math.max(groupDivisions.length + 1, 2) * groupMarginX);

            const rects = [];
            const offset = { x: groupOffset.x, y: groupOffset.y + groupMarginY };
            for (let rowIndex = 0; rowIndex < groupDivisions.length; rowIndex++) {
              const divisionX = offset.x + groupMarginX + (rowIndex * divisionWidth);
              const divisionY = offset.y;

              rects.push(
                <g key={rowIndex}>
                  <rect
                    key={rowIndex}
                    x={divisionX}
                    y={divisionY}
                    width={divisionWidth}
                    height={divisionHeight}
                    fill="none"
                    stroke="blue"
                    strokeWidth="3"
                  />
                  <line
                    x1={divisionX + divisionWidth / 2}
                    y1={divisionY + divisionHeight}
                    x2={divisionX + divisionWidth / 2}
                    y2={divisionY + divisionHeight + 30}
                    stroke="blue"
                    strokeWidth="3"
                  />
                  <polygon
                    points={`${divisionX + divisionWidth / 2 - 10},${divisionY + divisionHeight + 20} ${divisionX + divisionWidth / 2},${divisionY + divisionHeight + 30} ${divisionX + divisionWidth / 2 + 10},${divisionY + divisionHeight + 20}`}
                    fill="blue"
                  />
                </g>
              );

              offset.x = divisionX;
              offset.y = divisionY;
            }

            elements.push(
              <g key={groupIndex}>
                <rect
                  x={groupOffset.x}
                  y={groupOffset.y}
                  width={groupWidth}
                  height={divisionHeight + (groupMarginY * 2)}
                  fill="none"
                  stroke="black"
                  strokeWidth="3"
                  strokeDasharray="18,7"
                />
                {rects}
              </g>
            );

            prevGroupWidth = groupWidth;
          }

          return elements;
        })()}
      </svg>
      <button onClick={exportToPNG} style={{ marginTop: '10px' }}>
        Export to PNG
      </button>
    </div>
  );
};

export default AppContainer;
