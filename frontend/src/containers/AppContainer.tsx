import React, { useCallback, useEffect } from "react";
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
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
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
  distBetweenConvoys: number;
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
  distBetweenConvoys: "Відстань між колонами (м.)",
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
}

const calculateExtraColumns = (row: RowData, routeData: RouteData): RowData => {
  const depthOfConvoy = (row.numOfVehicles * row.distBetweenVehicles +
    (row.numOfConvoys - 1) * row.distBetweenConvoys) /
  1000;

  console.log('@row');
  console.log(row, routeData);

  let timeToExtractIntoDestination = 0;
  if(depthOfConvoy > routeData.depthOfDestinationArea) {
    console.log('@depthOfConvoy > routeData.depthOfDestinationArea');
    console.log(depthOfConvoy, routeData.depthOfDestinationArea, row.speedOfExtraction);
    timeToExtractIntoDestination = (depthOfConvoy - routeData.depthOfDestinationArea) / row.speedOfExtraction;
  }

  console.log('@timeToExtractIntoDestination');
  console.log(timeToExtractIntoDestination);

  const totalTimeToPassRoute = (routeData.lengthOfRoute / row.speed) + (routeData.totalTimeOfStops)
  const totalTimeToPass = totalTimeToPassRoute + timeToExtractIntoDestination;

  console.log('@totalTimeToPass');
  console.log(totalTimeToPass);

  const timeToPassPointOfDeparture_convoyStart = routeData.directiveTimeOfEndOfMovement.minus({ hours: totalTimeToPass });
  const timeOfStartOfMovement = timeToPassPointOfDeparture_convoyStart.minus({ hours: row.distBetweenConvoyHeadAndInitialPointOfDeparture / row.speedOfExtraction });
  const timeToPassPointOfDeparture_convoyEnd = timeToPassPointOfDeparture_convoyStart.plus({ hours: depthOfConvoy / row.speedOfExtraction }); // TODO: check if this is correct

  console.log('@timeToPassPointOfDeparture_convoyEnd');
  console.log(
    timeToPassPointOfDeparture_convoyStart.toISO(),
    timeToPassPointOfDeparture_convoyEnd.toISO(),
    timeOfStartOfMovement.toISO(),
  );

  const timeOfEndOfMovement = timeToPassPointOfDeparture_convoyEnd.plus({ hours: totalTimeToPassRoute });

  return {
    ...row,
    depthOfConvoy,
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
  }>({
    initialValues: {
      rows: [
        {
          unitName: "",
          numOfVehicles: 10,
          numOfConvoys: 1,
          distBetweenVehicles: 4000,
          distBetweenConvoys: 100,
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
      } 
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

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
                {formik.values.rows.map((rawRow, rowIndex) => {
                  const row = calculateExtraColumns(
                    rawRow,
                    formik.values.routeData
                  );

                  return (
                    <TableRow key={rowIndex}>
                      {Object.keys(row).map((key, colIndex) => {
                        return (
                          <TableCell key={`${rowIndex}-${colIndex}`}>
                            <TextField
                              fullWidth
                              value={(() => {
                                if([
                                  'timeToPassPointOfDeparture_convoyStart',
                                  'timeToPassPointOfDeparture_convoyEnd',
                                  'timeOfStartOfMovement',
                                  'timeOfEndOfMovement',
                                ].includes(key)) {
                                  return (row[key as keyof RowData] as DateTime).toFormat('HH год. mm хв. dd.MM.yyyy');
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
                formik.setFieldValue("totalTimeOfStops", Number(e.target.value));
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
                formik.setFieldValue("depthOfDestinationArea", Number(e.target.value));
              }}
            />
          </Stack>
        </Stack>
      </TemplateFrame>
    </LocalizationProvider>
  );
};

export default AppContainer;
