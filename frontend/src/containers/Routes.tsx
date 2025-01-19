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
} from "@mui/material";
import { useCallback, useState } from "react";
import {
  Route,
  RowData,
  GroupInfo,
  defaultElem,
  TopImageType,
  topImageTypes,
  mainImageTypes,
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

interface RoutesProps {
  route: Route;
  routeIndex: number;
  setFieldValue: (field: string, value: any) => void;
}

const Routes = ({ route, routeIndex, setFieldValue }: RoutesProps) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

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
    (rowIndex: number) => {
      setSelectedRowIndex(rowIndex);
    },
    [setSelectedRowIndex]
  );

  const handleModalClose = useCallback(() => {
    setSelectedRowIndex(null);
  }, [setSelectedRowIndex]);

  return (
    <Card sx={{ p: 1 }}>
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
            {route.rows.map((row, rowIndex) => (
              <RouteRow
                key={rowIndex}
                row={row}
                rowIndex={rowIndex}
                route={route}
                routeIndex={routeIndex}
                onRowChange={(newRows) => {
                  setFieldValue(`routes[${routeIndex}].rows`, newRows);
                }}
                onDeleteRow={(rowIndex) => {
                  const newRows = route.rows.filter((_, i) => i !== rowIndex);
                  setFieldValue(`routes[${routeIndex}].rows`, newRows);

                  // Update groups to remove this row index and shift other indices
                  const newGroupsInfo: GroupInfo[] = [];
                  const startDecrement = false;
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
      <Button variant="contained" onClick={handleAddRow} sx={{ mt: 2 }}>
        Додати рядок
      </Button>

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
          label="Загальний час зупинки (год.)"
          value={route.routeData.totalTimeOfStops}
          sx={{ "& .MuiInputBase-input": { padding: "5px" } }}
          onChange={(e) => {
            setFieldValue(
              `routes[${routeIndex}].routeData.totalTimeOfStops`,
              Number(e.target.value)
            );
          }}
        />
        <TextField
          label="Довжина маршруту (км.)"
          value={route.routeData.lengthOfRoute}
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
          sx={{ "& .MuiInputBase-input": { padding: "5px" } }}
          onChange={(e) => {
            setFieldValue(
              `routes[${routeIndex}].routeData.depthOfDestinationArea`,
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
                setFieldValue(`routes[${routeIndex}].groupsInfo`, newGroups);
              }}
            />
          ))}
        </Stack>
      </Box>

      {selectedRowIndex !== null && (
        <AmplificatorModal
          selectedRowIndex={selectedRowIndex}
          handleModalClose={handleModalClose}
          row={route.rows[selectedRowIndex]}
          routeIndex={routeIndex}
          setFieldValue={setFieldValue}
        />
      )}
    </Card>
  );
};

interface RouteRowProps {
  row: RowData;
  rowIndex: number;
  route: Route;
  routeIndex: number;
  onRowChange: (newRows: RowData[]) => void;
  onDeleteRow: (rowIndex: number) => void;
  onModalOpen: (rowIndex: number) => void;
}

interface AmplificatorModalProps {
  selectedRowIndex: number | null;
  row: RowData;
  handleModalClose: () => void;
  routeIndex: number;
  setFieldValue: (field: string, value: any) => void;
}

const AmplificatorModal = ({
  selectedRowIndex,
  row,
  handleModalClose,
  routeIndex,
  setFieldValue,
}: AmplificatorModalProps) => {
  return (
    <Dialog open={selectedRowIndex !== null} onClose={handleModalClose} maxWidth="md" fullWidth>
      <DialogTitle>Редагувати деталі підрозділу</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Лівий нижній ампліфікатор"
              value={row.leftBottomAmplificator || ''}
              onChange={(e) =>
                setFieldValue(
                  `routes[${routeIndex}].rows[${selectedRowIndex}].leftBottomAmplificator`,
                  e.target.value
                )
              }
            />
            <TextField
              fullWidth
              label="Правий нижній ампліфікатор"
              value={row.rightBottomAmplificator || ''}
              onChange={(e) =>
                setFieldValue(
                  `routes[${routeIndex}].rows[${selectedRowIndex}].rightBottomAmplificator`,
                  e.target.value
                )
              }
            />
            <TextField
              fullWidth
              label="Центральний нижній ампліфікатор"
              value={row.centerBottomAmplificator || ''}
              onChange={(e) =>
                setFieldValue(
                  `routes[${routeIndex}].rows[${selectedRowIndex}].centerBottomAmplificator`,
                  e.target.value
                )
              }
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Лівий верхній ампліфікатор"
              value={row.leftTopAmplificator || ''}
              onChange={(e) =>
                setFieldValue(
                  `routes[${routeIndex}].rows[${selectedRowIndex}].leftTopAmplificator`,
                  e.target.value
                )
              }
            />
            <TextField
              fullWidth
              label="Правий верхній ампліфікатор"
              value={row.rightTopAmplificator || ''}
              onChange={(e) =>
                setFieldValue(
                  `routes[${routeIndex}].rows[${selectedRowIndex}].rightTopAmplificator`,
                  e.target.value
                )
              }
            />
            <TextField
              fullWidth
              label="Центральний верхній ампліфікатор"
              value={row.centerTopAmplificator || ''}
              onChange={(e) =>
                setFieldValue(
                  `routes[${routeIndex}].rows[${selectedRowIndex}].centerTopAmplificator`,
                  e.target.value
                )
              }
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Лівий ампліфікатор"
              value={row.leftAmplificator || ''}
              onChange={(e) =>
                setFieldValue(
                  `routes[${routeIndex}].rows[${selectedRowIndex}].leftAmplificator`,
                  e.target.value
                )
              }
            />
            <TextField
              fullWidth
              label="Правий ампліфікатор"
              value={row.rightAmplificator || ''}
              onChange={(e) =>
                setFieldValue(
                  `routes[${routeIndex}].rows[${selectedRowIndex}].rightAmplificator`,
                  e.target.value
                )
              }
            />
            <TextField
              fullWidth
              label="Центральний ампліфікатор"
              value={row.centerAmplificator || ''}
              onChange={(e) =>
                setFieldValue(
                  `routes[${routeIndex}].rows[${selectedRowIndex}].centerAmplificator`,
                  e.target.value
                )
              }
            />
          </Stack>

          <Autocomplete
            value={topImageTypes.find((t) => t.type === row.topImageType) || null}
            options={topImageTypes}
            getOptionLabel={(option) => option.uaName}
            renderOption={(props, option) => (
              <Box component="li" sx={{ display: 'flex', alignItems: 'center' }} {...props}>
                <img 
                  src={svgFromPath(option.svgPath) || ''} 
                  alt={option.uaName}
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
                {option.uaName}
              </Box>
            )}
            onChange={(_, newValue) => {
              setFieldValue(
                `routes[${routeIndex}].rows[${selectedRowIndex}].topImageType`,
                newValue?.type || TopImageType.None
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label="Тип верхнього зображення" />
            )}
          />
          <Autocomplete
            multiple
            value={mainImageTypes.filter((t) =>
              row.mainImageTypes?.includes(t.type)
            ) || []}
            options={mainImageTypes}
            getOptionLabel={(option) => option.uaName}
            renderOption={(props, option) => (
              <Box component="li" sx={{ display: 'flex', alignItems: 'center' }} {...props}>
                <img
                  src={svgFromPath(option.svgPath) || ''}
                  alt={option.uaName}
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
                {option.uaName}
              </Box>
            )}
            onChange={(_, newValue) => {
              setFieldValue(
                `routes[${routeIndex}].rows[${selectedRowIndex}].mainImageTypes`,
                newValue.map((v) => v.type)
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label="Типи основних зображень" />
            )}
          />
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

const RouteRow = ({
  row,
  rowIndex,
  route,
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
      ].includes(key)
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
                  "timeOfEndOfMovement",
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
      <TableCell sx={{ margin: 0, padding: 0 }}>
        <Stack direction="row">
          <IconButton onClick={() => onModalOpen(rowIndex)}>
            <EditIcon />
          </IconButton>
          <IconButton
            disabled={isDeleteDisabled()}
            onClick={() => onDeleteRow(rowIndex)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default Routes;
