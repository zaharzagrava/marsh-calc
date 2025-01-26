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
} from "@mui/material";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { Grid } from "@mui/material";
import { DateTime } from "luxon";
import { defaultElem, defaultGroups, defaultRouteDataEx1, Group, Route } from "../types/types";
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
  timeToPassPointOfDeparture_convoyStart:
    "Час проходження вихідного пункту (Голова колонни) (год. хв.)",
  timeToPassPointOfDeparture_convoyEnd:
    "Час проходження вихідного пункту (Хвіст колонни)(год. хв.)",
  timeOfStartOfMovement: "Час початку руху Висування (год. хв.)",
  timeOfEndOfMovement:
    "Директивний час зосередження підрозділів у районі призначення Tзос. (год. хв.)",
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

  const formik = useFormik<{
    routes: Route[];
    groups: Group[];
  }>({
    initialValues: defaultRouteDataEx1,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const processedRoutes = useMemo(() => {
    return formik.values.routes.map((route) => {
      const depthOfFullConvoy = route.rows.reduce(
        (acc, row) => {
          const depthOfConvoy = calculateDepthOfConvoy(
            row.numOfVehicles,
            row.distBetweenVehicles,
          );

          return Number((acc + depthOfConvoy + row.distToNextConvoy).toFixed(5));
        },
        0
      );

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

  console.log('@processedRoutes');
  console.log(processedRoutes);

  const handleSaveToJson = useCallback(() => {
    const dataStr = JSON.stringify(formik.values, (key, value) => {
      // Special handling for DateTime objects
      if (value instanceof DateTime) {
        return value.toISO();
      }
      return value;
    }, 2);
    
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'formData.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [formik.values]);

  const handleLoadFromJson = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string, (key, value) => {
            // Convert ISO strings back to DateTime objects for specific fields
            if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)) {
              return DateTime.fromISO(value);
            }
            return value;
          });
          formik.setValues(data);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Error loading file. Please ensure it is a valid JSON file.');
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
            sx={{ alignSelf: "flex-start", mr: 2 }}
          >
            {formik.values.routes.length > 1
              ? "Прибрати другий маршрут"
              : "Додати другий маршрут"}
          </Button>
          <Button variant="contained" onClick={() => setPreviewOpen(true)}>
            Попередній перегляд та експорт
          </Button>
        </Grid>
        <Grid item>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleSaveToJson}>
              Зберегти у JSON
            </Button>
            <Button variant="contained" onClick={handleLoadFromJson}>
              Завантажити з JSON
            </Button>
          </Stack>
        </Grid>
        <Grid item>
          <CanvasWithExport routes={processedRoutes} />
        </Grid>

        <PreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          processedRoutes={processedRoutes}
          onExport={handleExportTable}
        />
      </Grid>
    </LocalizationProvider>
  );
};

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  processedRoutes: Route[];
  onExport: () => void;
}

const PreviewModal = ({
  open,
  onClose,
  processedRoutes,
  onExport,
}: PreviewModalProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth={false}
    fullWidth
    sx={{ "& .MuiDialog-paper": { width: "100vw", margin: 2 } }}
  >
    <DialogTitle>Попередній перегляд таблиці</DialogTitle>
    <DialogContent>
      <TableContainer id="preview-table">
        <Table>
          <TableHead>
            <TableRow>
              {Object.entries(columnNames).map(([key, columnName]) => (
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
            {processedRoutes
              .map((route, routeIndex) => {
                return (
                  <>
                    <TableRow>
                      <TableCell
                        colSpan={Object.keys(columnNames).length}
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
                                "additionalDivision",
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
                      </TableRow>
                    ))}
                  </>
                );
              })
              .flat()}
          </TableBody>
        </Table>
      </TableContainer>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Закрити</Button>
      <Button onClick={onExport} variant="contained">
        Експортувати
      </Button>
    </DialogActions>
  </Dialog>
);

export default AppContainer;
