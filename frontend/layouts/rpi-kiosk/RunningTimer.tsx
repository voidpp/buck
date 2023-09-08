import { If, Timedelta } from "@/components/widgets";
import {
    RunningTimersSubscription,
    TimerOperation,
    TimerState,
    useTimerOperationMutation,
} from "@/graphql-types-and-hooks";
import { useActiveTimersTicks } from "@/hooks";
import { ArrayElement } from "@/tools";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { Box, Divider, IconButton, SxProps, Theme } from "@mui/material";
import * as React from "react";

const padding = "0.5em";

const styles = {
    container: {
        padding,
        borderRadius: theme => theme.shape.borderRadius,
        border: "1px solid grey",
        boxShadow: "0 0 10px rgba(0,0,0,.7)",
        margin: "0.5em",
    },
    title: {
        paddingBottom: padding,
        whiteSpace: "nowrap",
    },
    controls: {
        display: "flex",
        justifyContent: "center",
    },
    timer: {
        textAlign: "center",
        padding: "0 0.3em",
    },
} satisfies Record<string, SxProps<Theme>>;

export default ({ timer }: { timer: ArrayElement<RunningTimersSubscription["runningTimers"]> }) => {
    const [operateTimer] = useTimerOperationMutation();

    return (
        <Box sx={styles.container}>
            <Box>
                <Box sx={styles.title}>
                    <span style={{ fontSize: "2em", marginRight: "0.4em", marginLeft: "0.2em" }}>{timer.name}</span>
                    <If condition={timer.name != timer.origLength}>
                        <span style={{ opacity: 0.8 }}>({timer.origLength})</span>
                    </If>
                </Box>
                <Divider />
                <Box sx={styles.controls}>
                    <If condition={timer.state == "STARTED"}>
                        <IconButton
                            onClick={() =>
                                operateTimer({ variables: { id: timer.id, operation: TimerOperation.Pause } })
                            }
                        >
                            <PauseIcon fontSize="large" />
                        </IconButton>
                    </If>
                    <If condition={timer.state == "PAUSED"}>
                        <IconButton
                            onClick={() =>
                                operateTimer({ variables: { id: timer.id, operation: TimerOperation.Unpause } })
                            }
                        >
                            <PlayArrowIcon fontSize="large" />
                        </IconButton>
                    </If>
                    <IconButton
                        onClick={() => operateTimer({ variables: { id: timer.id, operation: TimerOperation.Stop } })}
                    >
                        <StopIcon fontSize="large" />
                    </IconButton>
                </Box>
            </Box>
            <TimeList times={timer.remainingTimes} isRunning={timer.state === TimerState.Started} />
        </Box>
    );
};

const TimeList = ({ times, isRunning }: { times: number[]; isRunning: boolean }) => {
    const activeTimers = useActiveTimersTicks(times, isRunning);

    return (
        <>
            {activeTimers.map((time, idx) => (
                <Box key={idx} sx={styles.timer} style={{ fontSize: idx == 0 ? "4em" : "1.5em" }}>
                    <Timedelta value={time} />
                </Box>
            ))}
        </>
    );
};
