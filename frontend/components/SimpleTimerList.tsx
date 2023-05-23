import * as React from "react";

import { List, ListItemButton, SxProps } from "@mui/material";

import { QuickTimerListQuery, useQuickTimerListQuery, useStartTimerMutation } from "@/graphql-types-and-hooks";
import { ArrayElement } from "@/tools";

type Timer = ArrayElement<QuickTimerListQuery["predefinedTimers"]>;

const contentStyles = {
    list: {
        fontSize: "1.1em",
        paddingBottom: "9px",
        paddingTop: "9px",
        whiteSpace: "nowrap",
    },
} satisfies Record<string, SxProps>;

export const SimpleTimerList = ({ onDone, limit = 5 }: { onDone: () => void; limit?: number }) => {
    const { data } = useQuickTimerListQuery({ fetchPolicy: "cache-and-network" });
    const [startTimer] = useStartTimerMutation();

    if (!data) return null;

    const createStartTimer = (timer: Timer) => async () => {
        const res = await startTimer({
            variables: {
                soundFile: timer.soundFile,
                length: timer.length,
                predefinedTimerId: timer.id,
                name: (timer.group ? timer.group.name + " / " : "") + timer.name,
            },
        });
        if (res.data.startTimer.errors) alert("wut? (TODO)");
        else onDone();
    };

    return (
        <List>
            {data.predefinedTimers.slice(0, limit).map(timer => (
                <ListItemButton key={timer.id} onClick={createStartTimer(timer)} sx={contentStyles.list}>
                    {timer.group ? timer.group.name + " / " : ""}
                    {timer.name} ({timer.length})
                </ListItemButton>
            ))}
        </List>
    );
};
