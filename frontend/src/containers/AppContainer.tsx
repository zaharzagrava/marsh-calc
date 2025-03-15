import React, { useCallback, useMemo, useState } from "react";
import { useFormik } from "formik";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogActions,
  Stack,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { Grid } from "@mui/material";
import { DateTime } from "luxon";
import {
  defaultElem,
  defaultGroups,
  defaultRouteDataEx1,
  defaultRouteDataEx2,
  Group,
  Route,
  RoutesDto,
} from "../types/types";
import CanvasWithExport from "./CanvasWithExport";
import GroupsEditor from "./GroupsEditor";
import Routes from "./Routes";
import { calculateDepthOfConvoy, calculateExtraColumns } from "../utils/utils";
import html2canvas from "html2canvas";

// https://en.wikipedia.org/wiki/NATO_Joint_Military_Symbology#:~:text=Blue%20or%20black%20for%20friendly,biological%2C%20radiological%20or%20nuclear%20events
// https://en.wikipedia.org/wiki/File:Military_Symbol_-_Friendly_Unit_(Monochrome_Dark_1.5x1_Frame)-_Infantry_-_Mechanized_(NATO_APP-6).svg
// https://commons.wikimedia.org/wiki/Category:Unit_size_indicators_for_tactical_signs_and_map_symbols_of_NATO

// https://commons.wikimedia.org/wiki/Category:Military_map_symbols_for_units_and_formations/Infantry
// https://commons.wikimedia.org/wiki/Category:Military_map_symbols_for_units_and_formations/Friendly_unit_bichrome_1.6x1_frame
// https://commons.wikimedia.org/wiki/File:Military_Symbol_-_Friendly_Unit_(Bichrome_1.6x1_Frame)-_Infantry_-_Mechanized_(NATO_APP-6_Alternate).svg
// https://commons.wikimedia.org/wiki/Category:Military_map_symbols_for_units_and_formations

// Save content to JSON

// Fix export - if top image is not none, then its not properly exported
// Fix formula

// Type - default / KP

export const columnNames = {
  unitName: "Назва підрозділу",
  numOfVehicles: "Кількість транспортних засобів",
  distBetweenVehicles: "Відстань між транспортними засобами (км.)",
  distToNextConvoy: "Відстань між колонами (км.)",
  distBetweenConvoyHeadAndInitialPointOfDeparture:
    "Відстань колон від вихідного пункту (Двід, км)",
  speedOfExtraction: "Швидкість витягування (V - витяг) (км. / год.)",
  speed: "Швидкість руху (V - рух) (км. / год.)",

  depthOfConvoy: "Глибина колони (км.)",
  depthOfDestinationArea: "Глибина району призначення (км.)",
  distToDestinationArea: "Відстань від району призначення до вихідного пункту (км.)",
  timeToPassPointOfDeparture_convoyStart:
    "Час проходження вихідного пункту (Голова колонни) (год. хв.)",
  timeToPassPointOfDeparture_convoyEnd:
    "Час проходження вихідного пункту (Хвіст колонни)(год. хв.)",
  timeOfStartOfMovement: "Час початку руху Висування (год. хв.)",
  timeOfEndOfMovement:
    "Директивний час зосередження підрозділів у районі призначення Tзос. (год. хв.)",
  edit: "Редагувати підрозділ",
  topAdditionalDivision: "Бокові похідні застави",
};

const AppContainer = () => {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleExportTable = useCallback(() => {
    const table = document.querySelector("#preview-table");
    if (!table) return;

    html2canvas(table as HTMLElement, {
      backgroundColor: null,
      scale: 2,
    }).then((canvas: HTMLCanvasElement) => {
      const link = document.createElement("a");
      link.download = `preview-table.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  }, []);

  const formik = useFormik<RoutesDto>({
    initialValues: defaultRouteDataEx1,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const processedRoutes = useMemo(() => {
    return formik.values.routes.map((route) => {
      const depthOfFullConvoy = route.rows.reduce((acc, row) => {
        const depthOfConvoy = calculateDepthOfConvoy(
          row.numOfVehicles,
          row.distBetweenVehicles
        );

        return Number((acc + depthOfConvoy + row.distToNextConvoy).toFixed(5));
      }, 0);

      return {
        ...route,
        rows: calculateExtraColumns(route.rows, {
          ...route.routeData,
          depthOfFullConvoy,
        }),
        depthOfFullConvoy,
      };
    });
  }, [formik.values.routes]);

  const handleSaveToJson = useCallback(() => {
    const dataStr = JSON.stringify(
      formik.values,
      (key, value) => {
        // Special handling for DateTime objects
        if (value instanceof DateTime) {
          return value.toISO();
        }
        return value;
      },
      2
    );

    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "formData.json";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [formik.values]);

  const handleLoadFromJson = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string, (key, value) => {
            // Convert ISO strings back to DateTime objects for specific fields
            if (
              typeof value === "string" &&
              value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)
            ) {
              return DateTime.fromISO(value);
            }
            return value;
          });
          formik.setValues(data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          alert("Error loading file. Please ensure it is a valid JSON file.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [formik]);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Grid container direction="column" spacing={2} sx={{ p: 3 }}>
        <Grid item>
          <TextField
            label="Назва похідного порядку"
            value={formik.values.routeName}
            onChange={(e) => {
              formik.setFieldValue("routeName", e.target.value);
            }}
          />
          <TextField
            label="Назва таблиці маршу"
            value={formik.values.tableName}
            onChange={(e) => {
              formik.setFieldValue("tableName", e.target.value);
            }}
          />
        </Grid>
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
          <Stack direction="row" width="25%">
            <Stack spacing={2} sx={{ flex: 1 }}>
              <Typography variant="h5">
                Назва похідної застави (лівий фланг)
              </Typography>
              <TextField
                label="Назва похідної застави (лівий фланг)"
                value={formik.values.routes[0].topAdditionalDivisionName}
                onChange={(e) => {
                  formik.setFieldValue(
                    `routes[0].topAdditionalDivisionName`,
                    e.target.value
                  );
                }}
              />
            </Stack>
            <Stack spacing={2} sx={{ flex: 1 }}>
              <Typography variant="h5">
                Назва похідної застави (правий фланг)
              </Typography>
              <TextField
                label="Назва похідної застави (правий фланг)"
                value={formik.values.routes[0].bottomAdditionalDivisionName}
                onChange={(e) => {
                  formik.setFieldValue(
                    `routes[0].bottomAdditionalDivisionName`,
                    e.target.value
                  );
                }}
              />
            </Stack>
          </Stack>
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
            sx={{ alignSelf: "flex-start", mr: 2 }}
          >
            {formik.values.routes.length > 1
              ? "Прибрати другий маршрут"
              : "Додати другий маршрут"}
          </Button>
        </Grid>
        <Grid item>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleSaveToJson}>
              Зберегти дані маршу у файл
            </Button>
            <Button variant="contained" onClick={handleLoadFromJson}>
              Завантажити дані маршу із файлу
            </Button>
            <Button variant="contained" onClick={() => setPreviewOpen(true)}>
              Попередній перегляд та експорт таблиці маршу в PNG зображення
            </Button>
          </Stack>
        </Grid>
        <Grid item>
          <CanvasWithExport
            routes={processedRoutes}
            routeName={formik.values.routeName}
          />
        </Grid>

        <PreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          processedRoutes={processedRoutes}
          onExport={handleExportTable}
          tableName={formik.values.tableName}
        />
        <Grid
          item
          sx={{ width: "100%", mt: 4, borderTop: "1px solid #ccc", py: 2 }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} playstone@ukr.net All rights reserved.
          </Typography>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  processedRoutes: Route[];
  onExport: () => void;
  tableName: string;
}

const PreviewModal = ({
  open,
  onClose,
  processedRoutes,
  onExport,
  tableName,
}: PreviewModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      sx={{ "& .MuiDialog-paper": { width: "100vw", margin: 2 } }}
    >
      <DialogTitle>Попередній перегляд таблиці</DialogTitle>
      <DialogContent>
        <Box id="preview-table">
          <Typography variant="h5" align="center">
            {tableName}
          </Typography>
          {processedRoutes
            .map((route, routeIndex) => {
              return (
                <PreviewRoute
                  key={routeIndex}
                  route={route}
                  routeIndex={routeIndex}
                />
              );
            })
            .flat()}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрити</Button>
        <Button onClick={onExport} variant="contained">
          Експортувати
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PreviewRoute = ({
  route,
  routeIndex,
}: {
  route: Route;
  routeIndex: number;
}) => {
  const processedColumnsNames = useMemo(() => {
    const processedColumnsNames: string[] = Object.entries(columnNames).reduce(
      (acc, [key, columnName]) => {
        if (key === "timeOfEndOfMovement") {
          for (let i = 0; i < (route.routeData.stops || []).length; i++) {
            acc.push(`РР ${i + 1} (Голова колонни) (год. хв.)`);
            acc.push(`РР ${i + 1} (Хвіст колонни) (год. хв.)`);
          }

          acc.push(columnName);

          return acc;
        }

        if (key === "topAdditionalDivision" || key === "edit") {
          return acc;
        }

        acc.push(columnName);
        return acc;
      },
      [] as string[]
    );

    return processedColumnsNames;
  }, [route.routeData.stops]);

  const getRowValue = useCallback((key: string, value: any) => {
    if (
      [
        "timeToPassPointOfDeparture_convoyStart",
        "timeToPassPointOfDeparture_convoyEnd",
        "timeOfStartOfMovement",
        "timeOfEndOfMovement",
      ].includes(key) ||
      key === "stopsData"
    ) {
      return (value as DateTime).toFormat("HH год. mm хв. dd.MM.yyyy");
    }
    return value;
  }, []);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ border: "2px solid black" }}>№</TableCell>
            {Object.entries(processedColumnsNames).map(([key, columnName]) => (
              <TableCell
                key={key}
                sx={{
                  border: "2px solid black",
                }}
              >
                {columnName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={Object.keys(processedColumnsNames).length + 1}
              sx={{
                padding: "8px",
                border: "2px solid black",
                textAlign: "center",
                fontSize: "18px",
              }}
            >
              Маршрут {routeIndex + 1}
            </TableCell>
          </TableRow>
          {route.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell
                sx={{
                  border: "2px solid black",
                  textAlign: "center",
                }}
              >
                {rowIndex + 1}.
              </TableCell>
              {Object.entries(row)
                .filter(
                  ([key]) =>
                    ![
                      "leftBottomAmplificator",
                      "rightBottomAmplificator",
                      "centerBottomAmplificator",
                      "leftTopAmplificator",
                      "rightTopAmplificator",
                      "centerTopAmplificator",
                      "leftAmplificator",
                      "rightAmplificator",
                      "centerAmplificator",
                      "topImageType",
                      "mainImageTypes",
                      "isUplifted",

                      "topAdditionalDivision",
                      "bottomAdditionalDivision",
                      "stopsData",

                      "timeOfEndOfMovement",
                    ].includes(key)
                )
                .map(([key, value], colIndex) => (
                  <TableCell
                    key={`${rowIndex}-${colIndex}`}
                    sx={{
                      padding: "5px",
                      border: "2px solid black",
                      textAlign: "center",
                    }}
                  >
                    {(() => {
                      if (
                        [
                          "timeToPassPointOfDeparture_convoyStart",
                          "timeToPassPointOfDeparture_convoyEnd",
                          "timeOfStartOfMovement",
                          "timeOfEndOfMovement",
                        ].includes(key)
                      ) {
                        return (value as DateTime).toFormat(
                          "HH год. mm хв. dd.MM.yyyy"
                        );
                      }
                      return value;
                    })()}
                  </TableCell>
                ))}
                {row.stopsData.map((stopData, colIndex) => (
                  <TableCell
                    key={`${rowIndex}-${colIndex}`}
                    sx={{
                      padding: "5px",
                      border: "2px solid black",
                      textAlign: "center",
                    }}
                  >
                      {getRowValue("stopsData", stopData)}
                  </TableCell>
                ))}
                <TableCell
                  key={`${rowIndex}-timeOfEndOfMovement`}
                  sx={{
                    padding: "5px",
                    border: "2px solid black",
                    textAlign: "center",
                  }}
                >
                    {getRowValue("timeOfEndOfMovement", row.timeOfEndOfMovement)}
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppContainer;
