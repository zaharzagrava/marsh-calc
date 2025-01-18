import React, {
  useCallback,
  useMemo,
  useRef,
} from "react";
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
  Button,
  Card,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Stack, Grid } from "@mui/material";
import { DateTime } from "luxon";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

// https://en.wikipedia.org/wiki/NATO_Joint_Military_Symbology#:~:text=Blue%20or%20black%20for%20friendly,biological%2C%20radiological%20or%20nuclear%20events
// https://en.wikipedia.org/wiki/File:Military_Symbol_-_Friendly_Unit_(Monochrome_Dark_1.5x1_Frame)-_Infantry_-_Mechanized_(NATO_APP-6).svg
// https://commons.wikimedia.org/wiki/Category:Unit_size_indicators_for_tactical_signs_and_map_symbols_of_NATO

// https://commons.wikimedia.org/wiki/Category:Military_map_symbols_for_units_and_formations/Infantry
// https://commons.wikimedia.org/wiki/Category:Military_map_symbols_for_units_and_formations/Friendly_unit_bichrome_1.6x1_frame
// https://commons.wikimedia.org/wiki/File:Military_Symbol_-_Friendly_Unit_(Bichrome_1.6x1_Frame)-_Infantry_-_Mechanized_(NATO_APP-6_Alternate).svg
// https://commons.wikimedia.org/wiki/Category:Military_map_symbols_for_units_and_formations

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

  let timeToExtractIntoDestination = 0;
  if (routeData.depthOfFullConvoy > routeData.depthOfDestinationArea) {
    timeToExtractIntoDestination =
      (routeData.depthOfFullConvoy - routeData.depthOfDestinationArea) /
      row.speedOfExtraction;
  }

  const totalTimeToPassRoute =
    routeData.lengthOfRoute / row.speed + routeData.totalTimeOfStops;
  const totalTimeToPass = totalTimeToPassRoute + timeToExtractIntoDestination;

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

  const timeOfEndOfMovement = timeToPassPointOfDeparture_convoyEnd.plus({
    hours: totalTimeToPassRoute,
  });

  return {
    ...row,
    depthOfConvoy,
    timeToPassPointOfDeparture_convoyStart,
    timeToPassPointOfDeparture_convoyEnd,
    timeOfStartOfMovement,
    timeOfEndOfMovement,
  };
};

interface Route {
  rows: RowData[];
  routeData: RouteData;
  groupsInfo: GroupInfo[];
}

interface GroupInfo {
  name: string;
  rows: number[];
}

interface Group {
  name: string;
}

interface Coordinates {
  x: number;
  y: number;
}

interface GroupsEditorProps {
  groups: Group[];
  routes: Route[];
  onGroupsChange: (newGroups: Group[], newRoutes: Route[]) => void;
}

const GroupsEditor = ({
  groups,
  routes,
  onGroupsChange
}: GroupsEditorProps) => {
  const handleGroupNameChange = useCallback((groupIndex: number, newName: string) => {
    const newGroups = groups.map((group, idx) => 
      idx === groupIndex ? { ...group, name: newName } : group
    );

    const newRoutes = routes.map((route) => {
      return {
        ...route,
        groupsInfo: route.groupsInfo.map((group, idx) => 
          idx === groupIndex ? { ...group, name: newName } : group
        ),
      };
    });

    onGroupsChange(newGroups, newRoutes);
  }, [groups, routes, onGroupsChange]);

  const handleAddGroup = useCallback(() => {
    const newGroupName = `Група ${groups.length + 1}`;

    // Update groups
    const newGroups: Group[] = [
      ...groups,
      { name: newGroupName },
    ];

    // Update groupsInfo in routes
    const newRoutes = routes.map((route) => {
      const lastRowIndex = route.rows.length;

      return {
      ...route,
      rows: [...route.rows, { ...route.rows[0] }],
      groupsInfo: [...route.groupsInfo, {
        name: newGroupName,
        rows: [lastRowIndex],
      }]
    };
    });

    onGroupsChange(newGroups, newRoutes);
  }, [groups, routes, onGroupsChange]);

  const handleDeleteGroup = useCallback((groupIndex: number) => {
    const newGroups = groups.filter((_, i) => i !== groupIndex);

    const newRoutes = routes.map((route) => {
      const removedIndexes = route.groupsInfo[groupIndex].rows;

      const newRoute = {
        ...route,
        rows: route.rows.filter(
          (_, i) => !removedIndexes.includes(i)
        ),
      }

      const newGroupsInfo = [];
      const lastRemovedIndex = removedIndexes[removedIndexes.length - 1];
      for (let i = 0; i < route.groupsInfo.length; i++) {
        if (i === groupIndex) continue;

        newGroupsInfo.push({
          name: route.groupsInfo[i].name,
          rows: route.groupsInfo[i].rows.map(
            (rowIndex) => {
              if (rowIndex > lastRemovedIndex) {
                return rowIndex - removedIndexes.length;
              }

              return rowIndex;
            }
          )
        });
      }

      newRoute.groupsInfo = newGroupsInfo;

      return newRoute;
    });

    onGroupsChange(newGroups, newRoutes);
  }, [groups, routes, onGroupsChange]);

  return (
    <Card sx={{ p: 1 }}>
      <Typography variant="subtitle1">Групи підрозділів</Typography>

      {groups.map((group, groupIndex) => (
        <Box
          key={groupIndex}
          sx={{ display: "flex", alignItems: "center", mb: 1 }}
        >
          <TextField
            label={`Назва групи ${groupIndex + 1}`}
            value={group.name}
            onChange={(e) => handleGroupNameChange(groupIndex, e.target.value)}
            sx={{
              width: 300,
              "& .MuiInputBase-input": {
                padding: "5px",
              },
              marginRight: 2,
            }}
          />
          <IconButton onClick={() => handleDeleteGroup(groupIndex)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Button
        variant="outlined"
        onClick={handleAddGroup}
        sx={{ mt: 2 }}
      >
        Додати групу
      </Button>
    </Card>
  );
};

GroupsEditor.displayName = 'GroupsEditor';

interface RouteRowProps {
  row: RowData;
  rowIndex: number;
  route: Route;
  routeIndex: number;
  onRowChange: (newRows: RowData[]) => void;
  onDeleteRow: (rowIndex: number) => void;
}

const RouteRow = ({ 
  row, 
  rowIndex, 
  route, 
  onRowChange,
  onDeleteRow 
}: RouteRowProps) => {
  const handleValueChange = useCallback((key: keyof RowData, value: string) => {
    const newRows = [...route.rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      [key]: key !== "unitName" ? Number(value) : value,
    };

    onRowChange(newRows);
  }, [rowIndex, route.rows, onRowChange]);

  const isDeleteDisabled = useCallback(() => {
    const group = route.groupsInfo.find((group) =>
      group.rows.includes(rowIndex)
    );
    return (group?.rows.length ?? 0) === 1;
  }, [route.groupsInfo, rowIndex]);

  return (
    <TableRow key={rowIndex}>
      {Object.keys(row).map((key, colIndex) => (
        <TableCell
          key={`${rowIndex}-${colIndex}`}
          sx={{ margin: 0, padding: 0 }}
        >
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
                return (row[key as keyof RowData] as DateTime).toFormat(
                  "HH год. mm хв. dd.MM.yyyy"
                );
              }
              return row[key as keyof RowData];
            })()}
            sx={{
              "& .MuiInputBase-input": {
                padding: "3px",
              },
            }}
            onChange={(e) => handleValueChange(key as keyof RowData, e.target.value)}
          />
        </TableCell>
      ))}
      <TableCell sx={{ margin: 0, padding: 0 }}>
        <IconButton
          disabled={isDeleteDisabled()}
          onClick={() => onDeleteRow(rowIndex)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const defaultElem = {
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

const AppContainer = () => {
  const defaultGroups = useMemo(() => {
    return [
      { name: "Похідна охорона" },
      { name: "Підрозділи ТхЗ, ТлЗ та МедЗ" },
    ];
  }, []);

  const formik = useFormik<{
    routes: Route[];
    groups: Group[];
  }>({
    initialValues: {
      routes: [{ 
        rows: [
          { ...defaultElem },
          { ...defaultElem },
          { ...defaultElem },
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
            rows: [0, 1],
          },
          {
            name: defaultGroups[1].name,
            rows: [2],
          },
        ],
      }],
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

  // console.log('@formik.values');
  // console.log(JSON.stringify(formik.values, null, 2));

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Grid container direction="column" spacing={2} sx={{ p: 3 }}>
        <Grid item>
          <GroupsEditor 
            groups={formik.values.groups}
            routes={formik.values.routes}
            onGroupsChange={(newGroups, newRoutes) => {
              formik.setFieldValue('groups', newGroups);
              formik.setFieldValue('routes', newRoutes);
            }}
          />
        </Grid>
        <Grid item>
          {processedRoutes.map((route, routeIndex) => {
            return (
              <Card sx={{ p: 1 }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {Object.entries(columnNames).map(
                          ([key, columnName]) => (
                            <TableCell key={key}>{columnName}</TableCell>
                          )
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {route.rows.map((row, rowIndex) => (
                        <RouteRow
                          key={rowIndex}
                          row={row}
                          rowIndex={rowIndex}
                          route={route}
                          routeIndex={routeIndex}
                          onRowChange={(newRows) => {
                            formik.setFieldValue(
                              `routes[${routeIndex}].rows`,
                              newRows
                            );
                          }}
                          onDeleteRow={(rowIndex) => {
                            const newRows = route.rows.filter(
                              (_, i) => i !== rowIndex
                            );
                            formik.setFieldValue(
                              `routes[${routeIndex}].rows`,
                              newRows
                            );

                            // Update groups to remove this row index and shift other indices
                            const newGroupsInfo: GroupInfo[] = [];
                            let startDecrement = false;
                            for (let i = 0; i < route.groupsInfo.length; i++) {
                              const currentGroup = route.groupsInfo[i];
                              const newGroupInfo: GroupInfo = {
                                name: currentGroup.name,
                                rows: []
                              };

                              for (let ri = 0; ri < currentGroup.rows.length; ri++) {
                                if (currentGroup.rows[ri] === rowIndex) {
                                  startDecrement = true;
                                  continue;
                                }

                                if (startDecrement) {
                                  newGroupInfo.rows.push(currentGroup.rows[ri] - 1);
                                } else {
                                  newGroupInfo.rows.push(currentGroup.rows[ri]);
                                }
                              }

                              newGroupsInfo.push(newGroupInfo);
                            }

                            formik.setFieldValue(`routes[${routeIndex}].groupsInfo`, newGroupsInfo);
                          }}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  variant="contained"
                  onClick={() => {
                    // Add new row with default values
                    const newRow = {
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

                    // Add row to route
                    const newRows = [...route.rows, newRow];
                    formik.setFieldValue(
                      `routes[${routeIndex}].rows`,
                      newRows
                    );

                    // Add new row index to last group
                    formik.values.routes.forEach((route) => {
                      const newGroups = [...route.groupsInfo];
                      const lastGroup = newGroups[newGroups.length - 1];
                      lastGroup.rows = [...lastGroup.rows, newRows.length - 1];
                      formik.setFieldValue(`routes[${routeIndex}].groupsInfo`, newGroups);
                    })
                  }}
                  sx={{ mt: 2 }}
                >
                  Add Row
                </Button>
                
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <DateTimePicker
                    label="Директивний час зосередження"
                    value={route.routeData.directiveTimeOfEndOfMovement}
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: "5px",
                      },
                    }}
                    onChange={(newValue) => {
                      formik.setFieldValue(
                        "directiveTimeOfEndOfMovement",
                        newValue
                      );
                    }}
                  />
                  <TextField
                    label="Загальний час зупинки (год.)"
                    value={route.routeData.totalTimeOfStops}
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: "5px",
                      },
                    }}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "totalTimeOfStops",
                        Number(e.target.value)
                      );
                    }}
                  />
                  <TextField
                    label="Довжина маршруту (км.)"
                    value={route.routeData.lengthOfRoute}
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: "5px",
                      },
                    }}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "lengthOfRoute",
                        Number(e.target.value)
                      );
                    }}
                  />
                  <TextField
                    label="Глибина району призначення (км.)"
                    value={route.routeData.depthOfDestinationArea}
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: "5px",
                      },
                    }}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "depthOfDestinationArea",
                        Number(e.target.value)
                      );
                    }}
                  />
                </Stack>
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    {route.groupsInfo.map((groupInfo, groupIndex) => (
                      <GroupsOrderEditor
                        key={groupIndex}
                        groupInfo={groupInfo}
                        groupIndex={groupIndex}
                        rows={route.rows}
                        groupsInfo={route.groupsInfo}
                        onGroupChange={(newGroups) => {
                          console.log(`routes[${routeIndex}].groupsInfo`);
                          formik.setFieldValue(`routes[${routeIndex}].groupsInfo`, newGroups);
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Card>
            );
          })}
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
        <CanvasWithExport routes={processedRoutes} />
      </Grid>
    </LocalizationProvider>
  );
};


interface GroupEditorProps {
  groupInfo: GroupInfo;
  groupIndex: number;
  rows: RowData[];
  groupsInfo: GroupInfo[];
  onGroupChange: (newGroups: GroupInfo[]) => void;
}

const GroupsOrderEditor = ({
  groupInfo,
  groupIndex,
  rows,
  groupsInfo,
  onGroupChange,
}: GroupEditorProps) => {

  const onArrowBackClick = useCallback(() => {
    const currentEnd = Math.max(...groupInfo.rows);
    const newEnd = currentEnd - 1;

    if (newEnd < 0 || groupInfo.rows.length === 1) {
      return;
    }

    const newGroups = [...groupsInfo];
    // Remove the new index from other groups
    newGroups[groupIndex].rows = groupInfo.rows.filter(
      (r) => r !== currentEnd
    );

    const nextGroup = newGroups[groupIndex + 1];

    if (nextGroup) {
      nextGroup.rows = [currentEnd, ...nextGroup.rows];
    }

    onGroupChange(newGroups);
  }, [groupInfo, groupsInfo, onGroupChange, groupIndex]);

  const onArrowForwardClick = useCallback(() => {
    const currentEnd = Math.max(...groupInfo.rows); 
    const newEnd = currentEnd + 1;

    const nextGroup = groupsInfo[groupIndex + 1];

    if (
      newEnd > rows.length - 1 ||
      (nextGroup && nextGroup.rows.length === 1)
    ) {
      return;
    }

    const newGroups = [...groupsInfo];
    // Remove the new index from other groups
    newGroups.forEach((g, i) => {
      if (i !== groupIndex) {
        g.rows = g.rows.filter((r) => r !== currentEnd + 1);
      }
    });
    // Add new index to current group
    newGroups[groupIndex].rows = [...groupInfo.rows, currentEnd + 1];
    onGroupChange(newGroups);
  }, [groupInfo, groupsInfo, onGroupChange, groupIndex, rows.length]);

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography>
        {groupInfo.name}: {Math.min(...groupInfo.rows) + 1} -{" "}
        {Math.max(...groupInfo.rows) + 1}
      </Typography>
      {groupIndex !== groupsInfo.length - 1 && (
        <>
          <IconButton
            onClick={onArrowBackClick}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            onClick={onArrowForwardClick}
          >
            <ArrowForwardIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );
};

const CanvasWithExport = ({
  routes,
}: {
  routes: Route[];
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const exportToPNG = useCallback(() => {
    const svgElement = svgRef.current;

    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const img = new Image();

    // Set canvas size to match the SVG size
    const { width, height } = svgElement.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const pngData = canvas.toDataURL("image/png");

      // Create a download link
      const link = document.createElement("a");
      link.download = "canvas-export.png";
      link.href = pngData;
      link.click();
    };

    // Convert SVG data to Base64 URI, handling non-Latin1 characters
    const encodedData = encodeURIComponent(svgData);
    img.src = `data:image/svg+xml;charset=utf-8,${encodedData}`;
  }, []);


  return (
    <Grid item>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="700px"
        style={{ border: "1px solid black" }}
      >
        {(() => {
          const elements = [];

          const divisionWidth = 120;
          const divisionHeight = 75;
          const rectBottomOffset = 30;
          const rectBottomOffset2 = 60;

          const groupMarginX = 25;
          const groupMarginY = 100;

          let prevGroupWidth = 0;
          const groupOffset: Coordinates = {
            x: 50 + groupMarginX,
            y: 50,
          };

          // groupsInfo in all routes are the same, and also synced with groups in formik
          for (let groupIndex = 0; groupIndex < routes[0].groupsInfo.length; groupIndex++) {
            groupOffset.x += prevGroupWidth + groupMarginX;

            const groupWidths = [];
            const allRoutesDivisions = [];
            for (let index = 0; index < routes.length; index++) {
              const groupDivisions = routes[index].groupsInfo[groupIndex].rows.map(
                (row) => routes[index].rows[row]
              );
              allRoutesDivisions.push(groupDivisions);

              const groupWidth =
                groupDivisions.length * divisionWidth +
                Math.max(groupDivisions.length + 1, 2) * groupMarginX;
              groupWidths.push(groupWidth);
            }

            const groupWidth = Math.max(...groupWidths);
            const groupHeight =
              divisionHeight +
              rectBottomOffset2 +
              groupMarginY * 2 +
              (routes.length > 1
                ? divisionHeight + rectBottomOffset2 + groupMarginY
                : 0);

            const rects = [];
            for (let index = 0; index < allRoutesDivisions.length; index++) {
              const groupDivisions = allRoutesDivisions[index];
              const groupWidth = groupWidths[index];

              const offset = {
                x: groupOffset.x,
                y:
                  groupOffset.y +
                  groupMarginY +
                  index * (divisionHeight + rectBottomOffset2 + groupMarginY),
              };

              for (
                let rowIndex = 0;
                rowIndex < groupDivisions.length;
                rowIndex++
              ) {
                const divisionX =
                  offset.x + groupMarginX + (rowIndex > 0 ? divisionWidth : 0);
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
                    {/* Blue vertical line */}
                    <line
                      x1={divisionX + divisionWidth / 2}
                      y1={divisionY + divisionHeight}
                      x2={divisionX + divisionWidth / 2}
                      y2={divisionY + divisionHeight + rectBottomOffset}
                      stroke="blue"
                      strokeWidth="3"
                    />
                    {/* Blue horizontal line */}
                    <line
                      x1={divisionX}
                      y1={divisionY + divisionHeight + rectBottomOffset}
                      x2={divisionX + divisionWidth - 10}
                      y2={divisionY + divisionHeight + rectBottomOffset}
                      stroke="blue"
                      strokeWidth="3"
                    />
                    <polygon
                      points={`${divisionX},${divisionY + divisionHeight + rectBottomOffset} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset - 5} ${divisionX + divisionWidth},${divisionY + divisionHeight + rectBottomOffset} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset + 5} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset}`}
                      fill="blue"
                    />
                    <text
                      x={divisionX + divisionWidth / 2}
                      y={divisionY + divisionHeight + rectBottomOffset + 20}
                      fill="black"
                      fontSize="18"
                      textAnchor="middle"
                    >
                      {groupDivisions[rowIndex].numOfVehicles}
                    </text>
                    {/* Black vertical line */}
                    <line
                      x1={divisionX}
                      y1={divisionY + divisionHeight + rectBottomOffset}
                      x2={divisionX}
                      y2={divisionY + divisionHeight + rectBottomOffset2 + 15}
                      stroke="black"
                      strokeWidth="1"
                    />
                    <line
                      x1={divisionX + divisionWidth}
                      y1={divisionY + divisionHeight + rectBottomOffset}
                      x2={divisionX + divisionWidth}
                      y2={divisionY + divisionHeight + rectBottomOffset2 + 15}
                      stroke="black"
                      strokeWidth="1"
                    />
                    {/* Two black arrows */}
                    <polygon
                      points={`${divisionX},${divisionY + divisionHeight + rectBottomOffset2} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset2} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset2 - 5} ${divisionX + divisionWidth},${divisionY + divisionHeight + rectBottomOffset2} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset2 + 5} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset2}`}
                      fill="black"
                    />
                    <polygon
                      points={`${divisionX},${divisionY + divisionHeight + rectBottomOffset2} ${divisionX + 20},${divisionY + divisionHeight + rectBottomOffset2} ${divisionX + 20},${divisionY + divisionHeight + rectBottomOffset2 - 5} ${divisionX},${divisionY + divisionHeight + rectBottomOffset2} ${divisionX + 20},${divisionY + divisionHeight + rectBottomOffset2 + 5} ${divisionX + 20},${divisionY + divisionHeight + rectBottomOffset2}`}
                      fill="black"
                    />
                    {/* Black horizontal line */}
                    <line
                      x1={divisionX}
                      y1={divisionY + divisionHeight + rectBottomOffset2}
                      x2={divisionX + divisionWidth - 10}
                      y2={divisionY + divisionHeight + rectBottomOffset2}
                      stroke="black"
                      strokeWidth="2"
                    />
                    <text
                      x={divisionX + divisionWidth / 2}
                      y={divisionY + divisionHeight + rectBottomOffset2 + 20}
                      fill="black"
                      fontSize="18"
                      textAnchor="middle"
                    >
                      {groupDivisions[rowIndex].depthOfConvoy}
                    </text>
                  </g>
                );

                offset.x = divisionX;
                offset.y = divisionY;
              }
            }

            elements.push(
              <g key={groupIndex}>
                {/* Group name text */}
                <text
                  x={groupOffset.x - 5}
                  y={groupOffset.y - 15}
                  fill="black"
                  fontSize="18"
                  textAnchor="start"
                >
                  {routes[0].groupsInfo[groupIndex].name}
                </text>
                {/* Black dashed rectangle */}
                <rect
                  x={groupOffset.x}
                  y={groupOffset.y}
                  width={groupWidth}
                  height={groupHeight}
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
      <Button
        variant="contained"
        onClick={exportToPNG}
        style={{ marginTop: "10px" }}
      >
        Export to PNG
      </Button>
    </Grid>
  );
};

export default AppContainer;
