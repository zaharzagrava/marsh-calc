import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Box,
  TextField,
  Autocomplete,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Checkbox,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import {
  Route,
  RowData,
  GroupInfo,
  defaultElem,
  TopImageType,
  topImageTypes,
  mainImageTypes,
  DivisionGraphInfo,
  defaultElemGraphInfo,
} from "../types/types";
import { DateTime } from "luxon";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import GroupsOrderEditor from "./GroupsOrderEditor";
import DeleteIcon from "@mui/icons-material/Delete";
import { columnNames } from "./AppContainer";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import EditIcon from "@mui/icons-material/Edit";
import svgFromPath from "./svgFromPath";
import AddIcon from "@mui/icons-material/Add";

interface RoutesProps {
  route: Route;
  routeIndex: number;
  setFieldValue: (field: string, value: any) => void;
}

const Routes = ({ route, routeIndex, setFieldValue }: RoutesProps) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<{
    index: number;
    isTopAdditionalDivision: boolean;
    isBottomAdditionalDivision: boolean;
  } | null>(null);

  const handleAddRow = useCallback(() => {
    const newRow = { ...defaultElem };

    const newRows = [...route.rows, newRow];
    setFieldValue(`routes[${routeIndex}].rows`, newRows);

    // Add new row index to last group
    const newGroups = [...route.groupsInfo];
    const lastGroup = newGroups[newGroups.length - 1];
    lastGroup.rows = [...lastGroup.rows, newRows.length - 1];
    setFieldValue(`routes[${routeIndex}].groupsInfo`, newGroups);
  }, [route, routeIndex, setFieldValue]);

  const handleModalOpen = useCallback(
    ({
      rowIndex,
      isTopAdditionalDivision,
      isBottomAdditionalDivision,
    }: {
      rowIndex: number;
      isTopAdditionalDivision: boolean;
      isBottomAdditionalDivision: boolean;
    }) => {
      setSelectedRowIndex({
        index: rowIndex,
        isTopAdditionalDivision,
        isBottomAdditionalDivision,
      });
    },
    [setSelectedRowIndex]
  );

  const handleModalClose = useCallback(() => {
    setSelectedRowIndex(null);
  }, [setSelectedRowIndex]);

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

        if (routeIndex !== 0 && key === "topAdditionalDivision") {
          return acc;
        }

        acc.push(columnName);
        return acc;
      },
      [] as string[]
    );

    return processedColumnsNames;
  }, [routeIndex, route.routeData.stops]);

  return (
    <Card sx={{ p: 1 }}>
      <Typography variant="h5">Таблиця маршруту</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {processedColumnsNames.map((columnName) => {
                return (
                  <TableCell key={`${columnName}-key`}>{columnName}</TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {route.rows.map((row, rowIndex) => (
              <RouteRow
                key={rowIndex}
                row={row}
                rowIndex={rowIndex}
                routeIndex={routeIndex}
                route={route}
                onRowChange={(newRows) => {
                  setFieldValue(`routes[${routeIndex}].rows`, newRows);
                }}
                onDeleteRow={(rowIndex) => {
                  const newRows = route.rows.filter((_, i) => i !== rowIndex);
                  setFieldValue(`routes[${routeIndex}].rows`, newRows);

                  // Update groups to remove this row index and shift other indices
                  const newGroupsInfo: GroupInfo[] = [];
                  for (const currentGroup of route.groupsInfo) {
                    const newGroupInfo: GroupInfo = {
                      name: currentGroup.name,
                      rows: currentGroup.rows
                        .filter((ri) => ri !== rowIndex)
                        .map((ri) => (ri > rowIndex ? ri - 1 : ri)),
                    };
                    newGroupsInfo.push(newGroupInfo);
                  }

                  setFieldValue(
                    `routes[${routeIndex}].groupsInfo`,
                    newGroupsInfo
                  );
                }}
                onModalOpen={handleModalOpen}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={handleAddRow}>
        Додати рядок
      </Button>

      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="h5">Загальні дані маршруту</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DateTimePicker
              label="Директивний час зосередження"
              value={route.routeData.directiveTimeOfEndOfMovement}
              sx={{ "& .MuiInputBase-input": { padding: "5px" } }}
              onChange={(newValue: DateTime<boolean> | null) => {
                setFieldValue(
                  `routes[${routeIndex}].routeData.directiveTimeOfEndOfMovement`,
                  newValue
                );
              }}
            />
          </LocalizationProvider>
          <TextField
            label="Довжина маршруту (км.)"
            value={route.routeData.lengthOfRoute}
            type="number"
            sx={{ "& .MuiInputBase-input": { padding: "5px" } }}
            onChange={(e) => {
              setFieldValue(
                `routes[${routeIndex}].routeData.lengthOfRoute`,
                Number(e.target.value)
              );
            }}
          />
          <TextField
            label="Глибина району призначення (км.)"
            value={route.routeData.depthOfDestinationArea}
            type="number"
            sx={{ "& .MuiInputBase-input": { padding: "5px" } }}
            onChange={(e) => {
              setFieldValue(
                `routes[${routeIndex}].routeData.depthOfDestinationArea`,
                Number(e.target.value)
              );
            }}
          />
        </Stack>
        <Box>
          <Typography>Привали та пункти регулювання</Typography>
          {route.routeData.stops?.map((stop, stopIndex) => (
            <Box key={stopIndex} sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                label="Тривалість привалу (год.)"
                value={stop.duration}
                type="number"
                sx={{ "& .MuiInputBase-input": { padding: "5px" } }}
                onChange={(e) => {
                  setFieldValue(
                    `routes[${routeIndex}].routeData.stops[${stopIndex}].duration`,
                    Number(e.target.value)
                  );
                }}
              />
              <TextField
                label="Відстань до РР (км.)"
                value={stop.distance}
                type="number"
                sx={{ "& .MuiInputBase-input": { padding: "5px" } }}
                onChange={(e) => {
                  setFieldValue(
                    `routes[${routeIndex}].routeData.stops[${stopIndex}].distance`,
                    Number(e.target.value)
                  );
                }}
              />
              <IconButton
                onClick={() => {
                  const newStops = [...route.routeData.stops];
                  newStops.splice(stopIndex, 1);
                  setFieldValue(
                    `routes[${routeIndex}].routeData.stops`,
                    newStops
                  );
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              const prevStop =
                route.routeData.stops?.[route.routeData.stops.length - 1];
              const newStop = {
                duration: 0,
                distance: prevStop?.distance + 1 || 10,
              };
              const newStops = [...(route.routeData.stops || []), newStop];
              setFieldValue(`routes[${routeIndex}].routeData.stops`, newStops);
            }}
          >
            Додати привал
          </Button>
        </Box>
      </Box>

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
                setFieldValue(`routes[${routeIndex}].groupsInfo`, newGroups);
              }}
            />
          ))}
        </Stack>
      </Box>

      {selectedRowIndex !== null && (
        <AmplificatorModal
          index={selectedRowIndex.index}
          isTopAdditionalDivision={selectedRowIndex.isTopAdditionalDivision}
          isBottomAdditionalDivision={
            selectedRowIndex.isBottomAdditionalDivision
          }
          handleModalClose={handleModalClose}
          row={(() => {
            if (selectedRowIndex.isTopAdditionalDivision) {
              return route.rows[selectedRowIndex.index]
                .topAdditionalDivision as DivisionGraphInfo;
            }

            if (selectedRowIndex.isBottomAdditionalDivision) {
              return route.rows[selectedRowIndex.index]
                .bottomAdditionalDivision as DivisionGraphInfo;
            }

            return route.rows[selectedRowIndex.index] as DivisionGraphInfo;
          })()}
          routeIndex={routeIndex}
          setFieldValue={setFieldValue}
        />
      )}
    </Card>
  );
};

interface AmplificatorModalProps {
  index: number | null;
  isTopAdditionalDivision: boolean;
  isBottomAdditionalDivision: boolean;
  row: DivisionGraphInfo;
  handleModalClose: () => void;
  routeIndex: number;
  setFieldValue: (field: string, value: any) => void;
}

const AmplificatorModal = ({
  index,
  row,
  isTopAdditionalDivision,
  isBottomAdditionalDivision,
  handleModalClose,
  routeIndex,
  setFieldValue,
}: AmplificatorModalProps) => {
  const editPath = useMemo(() => {
    if (isTopAdditionalDivision) {
      return `routes[${routeIndex}].rows[${index}].topAdditionalDivision`;
    }

    if (isBottomAdditionalDivision) {
      return `routes[${routeIndex}].rows[${index}].bottomAdditionalDivision`;
    }

    return `routes[${routeIndex}].rows[${index}]`;
  }, [isTopAdditionalDivision, isBottomAdditionalDivision, index, routeIndex]);

  const editValue = useCallback(
    (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const fullKey = `${editPath}.${key}`;
      setFieldValue(fullKey, e.target.value);
    },
    [editPath, setFieldValue]
  );

  return (
    <Dialog
      open={index !== null}
      onClose={handleModalClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Редагувати деталі підрозділу</DialogTitle>
      <DialogContent>
        <Autocomplete
          value={topImageTypes.find((t) => t.type === row.topImageType) || null}
          options={topImageTypes}
          getOptionLabel={(option) => option.uaName}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ display: "flex", alignItems: "center" }}
              {...props}
            >
              <img
                src={svgFromPath(option.svgPath) || ""}
                alt={option.uaName}
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
              {option.uaName}
            </Box>
          )}
          onChange={(_, newValue) => {
            setFieldValue(
              `${editPath}.topImageType`,
              newValue?.type || TopImageType.None
            );
          }}
          renderInput={(params) => (
            <TextField {...params} label="Ампліфікатор військового організму" />
          )}
        />

        <Stack spacing={2} sx={{ mt: 1 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Лівий верхній ампліфікатор"
              value={row.leftTopAmplificator || ""}
              onChange={editValue.bind(null, "leftTopAmplificator")}
            />
            <TextField
              fullWidth
              label="Центральний верхній ампліфікатор"
              value={row.centerTopAmplificator || ""}
              onChange={editValue.bind(null, "centerTopAmplificator")}
            />
            <TextField
              fullWidth
              label="Правий верхній ампліфікатор"
              value={row.rightTopAmplificator || ""}
              onChange={editValue.bind(null, "rightTopAmplificator")}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Лівий ампліфікатор"
              value={row.leftAmplificator || ""}
              onChange={editValue.bind(null, "leftAmplificator")}
            />
            <TextField
              fullWidth
              label="Центральний ампліфікатор"
              value={row.centerAmplificator || ""}
              onChange={editValue.bind(null, "centerAmplificator")}
            />
            <TextField
              fullWidth
              label="Правий ампліфікатор"
              value={row.rightAmplificator || ""}
              onChange={editValue.bind(null, "rightAmplificator")}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Лівий нижній ампліфікатор"
              value={row.leftBottomAmplificator || ""}
              onChange={editValue.bind(null, "leftBottomAmplificator")}
            />
            <TextField
              fullWidth
              label="Центральний нижній ампліфікатор"
              value={row.centerBottomAmplificator || ""}
              onChange={editValue.bind(null, "centerBottomAmplificator")}
            />
            <TextField
              fullWidth
              label="Правий нижній ампліфікатор"
              value={row.rightBottomAmplificator || ""}
              onChange={editValue.bind(null, "rightBottomAmplificator")}
            />
          </Stack>

          <Autocomplete
            multiple
            value={
              mainImageTypes.filter((t) =>
                row.mainImageTypes?.includes(t.type)
              ) || []
            }
            options={mainImageTypes}
            getOptionLabel={(option) => option.uaName}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ display: "flex", alignItems: "center" }}
                {...props}
              >
                <img
                  src={svgFromPath(option.svgPath) || ""}
                  alt={option.uaName}
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
                {option.uaName}
              </Box>
            )}
            onChange={(_, newValue) => {
              setFieldValue(
                `${editPath}.mainImageTypes`,
                newValue.map((v) => v.type)
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label="Основні зображення" />
            )}
          />

          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Typography sx={{ fontSize: "14px" }}>Встановити КП</Typography>
            <Checkbox
              checked={row.isUplifted}
              onChange={(e) =>
                setFieldValue(`${editPath}.isUplifted`, e.target.checked)
              }
              title="Встановити КП"
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalClose} variant="contained">
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface RouteRowProps {
  row: RowData;
  rowIndex: number;
  route: Route;
  routeIndex: number;
  onRowChange: (newRows: RowData[]) => void;
  onDeleteRow: (rowIndex: number) => void;
  onModalOpen: ({
    rowIndex,
    isTopAdditionalDivision,
    isBottomAdditionalDivision,
  }: {
    rowIndex: number;
    isTopAdditionalDivision: boolean;
    isBottomAdditionalDivision: boolean;
  }) => void;
}

const RouteRow = ({
  row,
  rowIndex,
  route,
  routeIndex,
  onRowChange,
  onDeleteRow,
  onModalOpen,
}: RouteRowProps) => {
  const handleValueChange = useCallback(
    (key: keyof RowData, value: string) => {
      const newRows = [...route.rows];
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        [key]: (() => {
          if (key === "unitName") {
            return value;
          }

          return Number(value);
        })(),
      };

      onRowChange(newRows);
    },
    [rowIndex, route.rows, onRowChange]
  );

  const onTopAdditionalDivisionAdd = useCallback(() => {
    const newRows = [...route.rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      topAdditionalDivision: { ...defaultElemGraphInfo },
    };
    onRowChange(newRows);
  }, [rowIndex, route.rows, onRowChange]);

  const onTopAdditionalDivisionDelete = useCallback(() => {
    const newRows = [...route.rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      topAdditionalDivision: undefined,
    };
    onRowChange(newRows);
  }, [rowIndex, route.rows, onRowChange]);

  const onBottomAdditionalDivisionAdd = useCallback(() => {
    const newRows = [...route.rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      bottomAdditionalDivision: { ...defaultElemGraphInfo },
    };
    onRowChange(newRows);
  }, [rowIndex, route.rows, onRowChange]);

  const onBottomAdditionalDivisionDelete = useCallback(() => {
    const newRows = [...route.rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      bottomAdditionalDivision: undefined,
    };
    onRowChange(newRows);
  }, [rowIndex, route.rows, onRowChange]);

  const isDeleteDisabled = useCallback(() => {
    const group = route.groupsInfo.find((group) =>
      group.rows.includes(rowIndex)
    );
    return (group?.rows.length ?? 0) === 1;
  }, [route.groupsInfo, rowIndex]);

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
              margin: 0,
              paddingY: 0,
              paddingX: "3px",
              width: (() => {
                if (key === "type") {
                  return "320px";
                }

                return "auto";
              })(),
            }}
          >
            {(() => {
              if (
                [
                  "depthOfConvoy",
                  "timeToPassPointOfDeparture_convoyStart",
                  "timeToPassPointOfDeparture_convoyEnd",
                  "timeOfStartOfMovement",
                ].includes(key)
              ) {
                return (
                  <Typography sx={{ padding: "3px" }}>
                    {getRowValue(key, value)}
                  </Typography>
                );
              } else {
                return (
                  <TextField
                    fullWidth
                    value={value}
                    type={key === "unitName" ? "text" : "number"}
                    disabled={key === "distToNextConvoy" && rowIndex === 0}
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: "3px",
                      },
                    }}
                    onChange={(e) =>
                      handleValueChange(key as keyof RowData, e.target.value)
                    }
                  />
                );
              }
            })()}
          </TableCell>
        ))}

      {row.stopsData.map((stopData, colIndex) => (
        <TableCell
          key={`${rowIndex}-${colIndex}`}
          sx={{
            margin: 0,
            paddingY: 0,
            paddingX: "3px",
            width: "auto",
          }}
        >
          <Typography sx={{ padding: "3px" }}>
            {getRowValue("stopsData", stopData)}
          </Typography>
        </TableCell>
      ))}
      <TableCell
        key={`${rowIndex}-timeOfEndOfMovement`}
        sx={{
          margin: 0,
          paddingY: 0,
          paddingX: "3px",
          width: "auto",
        }}
      >
        <Typography sx={{ padding: "3px" }}>
          {getRowValue("timeOfEndOfMovement", row.timeOfEndOfMovement)}
        </Typography>
      </TableCell>
      <TableCell sx={{ margin: 0, padding: 0 }}>
        <Stack direction="row">
          <IconButton
            onClick={() =>
              onModalOpen({
                rowIndex,
                isTopAdditionalDivision: false,
                isBottomAdditionalDivision: false,
              })
            }
          >
            <EditIcon sx={{ transform: "scale(1.2)" }} />
          </IconButton>
          <IconButton
            disabled={isDeleteDisabled()}
            onClick={() => onDeleteRow(rowIndex)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </TableCell>
      {routeIndex === 0 && (
        <TableCell sx={{ margin: 0, padding: 0 }}>
          <Stack direction="row">
            {row.topAdditionalDivision ? (
              <>
                <IconButton
                  onClick={() =>
                    onModalOpen({
                      rowIndex,
                      isTopAdditionalDivision: true,
                      isBottomAdditionalDivision: false,
                    })
                  }
                >
                  <EditIcon />
                </IconButton>
                <IconButton onClick={onTopAdditionalDivisionDelete}>
                  <DeleteIcon />
                </IconButton>
              </>
            ) : (
              <IconButton onClick={onTopAdditionalDivisionAdd}>
                <AddIcon />
              </IconButton>
            )}
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            {row.bottomAdditionalDivision ? (
              <>
                <IconButton
                  onClick={() =>
                    onModalOpen({
                      rowIndex,
                      isTopAdditionalDivision: false,
                      isBottomAdditionalDivision: true,
                    })
                  }
                >
                  <EditIcon />
                </IconButton>
                <IconButton onClick={onBottomAdditionalDivisionDelete}>
                  <DeleteIcon />
                </IconButton>
              </>
            ) : (
              <IconButton onClick={onBottomAdditionalDivisionAdd}>
                <AddIcon />
              </IconButton>
            )}
          </Stack>
        </TableCell>
      )}
    </TableRow>
  );
};

export default Routes;
