import { useCallback } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { Group, Route } from "../types/types";
import { Box, Typography, TextField, IconButton, Button, Card } from "@mui/material";

interface GroupsEditorProps {
  groups: Group[];
  routes: Route[];
  onGroupsChange: (newGroups: Group[], newRoutes: Route[]) => void;
}

const GroupsEditor = ({
  groups,
  routes,
  onGroupsChange,
}: GroupsEditorProps) => {
  const handleGroupNameChange = useCallback(
    (groupIndex: number, newName: string) => {
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
    },
    [groups, routes, onGroupsChange]
  );

  const handleAddGroup = useCallback(() => {
    const newGroupName = `Група ${groups.length + 1}`;

    // Update groups
    const newGroups: Group[] = [...groups, { name: newGroupName }];

    // Update groupsInfo in routes
    const newRoutes = routes.map((route) => {
      const lastRowIndex = route.rows.length;

      return {
        ...route,
        rows: [...route.rows, { ...route.rows[0] }],
        groupsInfo: [
          ...route.groupsInfo,
          {
            name: newGroupName,
            rows: [lastRowIndex],
          },
        ],
      };
    });

    onGroupsChange(newGroups, newRoutes);
  }, [groups, routes, onGroupsChange]);

  const handleDeleteGroup = useCallback(
    (groupIndex: number) => {
      const newGroups = groups.filter((_, i) => i !== groupIndex);

      const newRoutes = routes.map((route) => {
        const removedIndexes = route.groupsInfo[groupIndex].rows;

        const newRoute = {
          ...route,
          rows: route.rows.filter((_, i) => !removedIndexes.includes(i)),
        };

        const newGroupsInfo = [];
        const lastRemovedIndex = removedIndexes[removedIndexes.length - 1];
        for (let i = 0; i < route.groupsInfo.length; i++) {
          if (i === groupIndex) continue;

          newGroupsInfo.push({
            name: route.groupsInfo[i].name,
            rows: route.groupsInfo[i].rows.map((rowIndex) => {
              if (rowIndex > lastRemovedIndex) {
                return rowIndex - removedIndexes.length;
              }

              return rowIndex;
            }),
          });
        }

        newRoute.groupsInfo = newGroupsInfo;

        return newRoute;
      });

      onGroupsChange(newGroups, newRoutes);
    },
    [groups, routes, onGroupsChange]
  );

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

      <Button variant="outlined" onClick={handleAddGroup} sx={{ mt: 2 }}>
        Додати групу
      </Button>
    </Card>
  );
};

export default GroupsEditor;