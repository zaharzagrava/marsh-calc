import React, { useMemo } from "react";
import { useFormik } from "formik";
import {
  Button,
} from "@mui/material";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { Grid } from "@mui/material";
import { DateTime } from "luxon";
import { defaultElem, Group, Route } from "../types/types";
import CanvasWithExport from "./CanvasWithExport";
import GroupsEditor from "./GroupsEditor";
import Routes from "./Routes";
import { calculateDepthOfConvoy, calculateExtraColumns } from "../utils/utils";

// https://en.wikipedia.org/wiki/NATO_Joint_Military_Symbology#:~:text=Blue%20or%20black%20for%20friendly,biological%2C%20radiological%20or%20nuclear%20events
// https://en.wikipedia.org/wiki/File:Military_Symbol_-_Friendly_Unit_(Monochrome_Dark_1.5x1_Frame)-_Infantry_-_Mechanized_(NATO_APP-6).svg
// https://commons.wikimedia.org/wiki/Category:Unit_size_indicators_for_tactical_signs_and_map_symbols_of_NATO

// https://commons.wikimedia.org/wiki/Category:Military_map_symbols_for_units_and_formations/Infantry
// https://commons.wikimedia.org/wiki/Category:Military_map_symbols_for_units_and_formations/Friendly_unit_bichrome_1.6x1_frame
// https://commons.wikimedia.org/wiki/File:Military_Symbol_-_Friendly_Unit_(Bichrome_1.6x1_Frame)-_Infantry_-_Mechanized_(NATO_APP-6_Alternate).svg
// https://commons.wikimedia.org/wiki/Category:Military_map_symbols_for_units_and_formations

// Save content to JSON
// Fix export - if top image is not none, then its not properly exported
// Decinmals input
// Fix formula

// Type - default / KP

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
    "Час проходження вихідного пункту (Хвіст колонни)(год. хв.)",
  timeOfStartOfMovement: "Час початку руху Висування (год. хв.)",
  timeOfEndOfMovement:
    "Директивний час зосередження підрозділів у районі призначення Tзос. (год. хв.)",
};

const AppContainer = () => {
  const defaultGroups = useMemo(() => {
    return [
      { name: "Похідна охорона" },
      { name: "Підрозділи ТхЗ, ТлЗ" },
    ];
  }, []);

  const formik = useFormik<{
    routes: Route[];
    groups: Group[];
  }>({
    initialValues: {
      routes: [
        {
          rows: [{ ...defaultElem }, { ...defaultElem }, { ...defaultElem }],
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
              rows: [0, 1],
            },
            {
              name: defaultGroups[1].name,
              rows: [2],
            },
          ],
          additionalDivisionName: "",
        },
      ],
      groups: defaultGroups,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const processedRoutes = useMemo(() => {
    return formik.values.routes.map((route) => {
      return {
        ...route,
        rows: route.rows.map((row) =>
          calculateExtraColumns(row, route.routeData)
        ),
        depthOfFullConvoy: route.rows.reduce(
          (acc, row) =>
            acc +
            calculateDepthOfConvoy(
              row.numOfVehicles,
              row.distBetweenVehicles,
              row.distToNextConvoy
            ),
          0
        ),
      };
    });
  }, [formik.values.routes]);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Grid container direction="column" spacing={2} sx={{ p: 3 }}>
        <Grid item>
          <GroupsEditor
            groups={formik.values.groups}
            routes={formik.values.routes}
            onGroupsChange={(newGroups, newRoutes) => {
              formik.setFieldValue("groups", newGroups);
              formik.setFieldValue("routes", newRoutes);
            }}
          />
        </Grid>
        <Grid item>
          {processedRoutes.map((route, routeIndex) => (
            <Routes
              key={routeIndex}
              route={route}
              routeIndex={routeIndex}
              setFieldValue={formik.setFieldValue}
            />
          ))}
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => {
              if (formik.values.routes.length > 1) {
                formik.setFieldValue(
                  "routes",
                  formik.values.routes.slice(0, -1)
                );
              } else {
                const firstRoute = formik.values.routes[0];

                formik.setFieldValue("routes", [
                  ...formik.values.routes,
                  { ...firstRoute },
                ]);
              }
            }}
            sx={{ alignSelf: "flex-start" }}
          >
            {formik.values.routes.length > 1
              ? "Прибрати другий маршрут"
              : "Додати другий маршрут"}
          </Button>
        </Grid>
        <Grid item>
          <CanvasWithExport routes={processedRoutes} />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default AppContainer;
