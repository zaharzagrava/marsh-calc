import { Stack, Typography, IconButton } from "@mui/material";
import { useCallback } from "react";
import { RowData, GroupInfo } from "../types/types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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

    const newGroups = [...groupsInfo.map((g) => ({ ...g }))];
    // Remove the new index from other groups
    newGroups[groupIndex].rows = groupInfo.rows.filter((r) => r !== currentEnd);

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

    const newGroups = [...groupsInfo.map((g) => ({ ...g }))];
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
          <IconButton onClick={onArrowBackClick}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton onClick={onArrowForwardClick}>
            <ArrowForwardIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );
};

export default GroupsOrderEditor;