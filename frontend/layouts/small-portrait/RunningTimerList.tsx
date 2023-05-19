import { If, Timedelta } from "@/components/widgets";
import {
    RunningTimersSubscription,
    TimerOperation,
    useRunningTimersSubscription,
    useTimerOperationMutation,
} from "@/graphql-types-and-hooks";
import { ArrayElement } from "@/tools";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { Box, Collapse, Divider, IconButton, SxProps, Theme, Typography } from "@mui/material";
import * as React from "react";
import { TransitionGroup } from "react-transition-group";

const styles = {
    timer: {
        m: 1,
        p: 2,
        backgroundColor: theme => theme.palette.info.dark,
        borderRadius: 3,
    },
    listContainer: {
        display: "flex",
        height: "100%",
        flexDirection: "column-reverse",
        pb: 10,
    },
} satisfies Record<string, SxProps<Theme>>;

type RunningTimerProps = {
    timer: ArrayElement<RunningTimersSubscription["runningTimers"]>;
};

const RunningTimer = ({ timer }: RunningTimerProps) => {
    const [operateTimer] = useTimerOperationMutation();

    return (
        <Box sx={styles.timer}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Box>
                        <Typography variant="caption">Name</Typography>
                        <Typography variant="h5">{timer.name}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption">Length</Typography>
                        <Typography variant="h5">{timer.origLength}</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    {timer.remainingTimes.map((time, idx) => (
                        <Box key={idx} sx={{}} style={{ fontSize: idx == 0 ? "4em" : "1.5em" }}>
                            <Timedelta value={time} />
                        </Box>
                    ))}
                </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "center", fontSize: "4rem" }}>
                <If condition={timer.state == "STARTED"}>
                    <IconButton
                        onClick={() => operateTimer({ variables: { id: timer.id, operation: TimerOperation.Pause } })}
                        sx={{ fontSize: "inherit" }}
                    >
                        <PauseIcon fontSize="inherit" />
                    </IconButton>
                </If>
                <If condition={timer.state == "PAUSED"}>
                    <IconButton
                        onClick={() => operateTimer({ variables: { id: timer.id, operation: TimerOperation.Unpause } })}
                        sx={{ fontSize: "inherit" }}
                    >
                        <PlayArrowIcon fontSize="inherit" />
                    </IconButton>
                </If>
                <IconButton
                    onClick={() => operateTimer({ variables: { id: timer.id, operation: TimerOperation.Stop } })}
                    sx={{ fontSize: "inherit" }}
                >
                    <StopIcon fontSize="inherit" />
                </IconButton>
            </Box>
        </Box>
    );
};

const TimerListContainer = ({ children }: { children: React.ReactNode }) => (
    <Box sx={styles.listContainer}>{children}</Box>
);

export const RunningTimerList = () => {
    const { data } = useRunningTimersSubscription();

    return (
        <TransitionGroup component={TimerListContainer}>
            {data?.runningTimers.map(timer => (
                <Collapse key={timer.id}>
                    <RunningTimer key={timer.id} timer={timer} />
                </Collapse>
            ))}
        </TransitionGroup>
    );
};
