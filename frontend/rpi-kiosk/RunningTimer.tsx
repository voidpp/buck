import { useMutation } from "@apollo/client";
import { Box, Divider, IconButton, SxProps, Theme } from "@mui/material";
import * as React from "react";

import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { TimerOperation, TimerState } from "../__generated__/globalTypes";
import { TimerOperationMutation, TimerOperationMutationVariables } from "./__generated__/TimerOperationMutation";
import { timerOperationMutation } from "./timerOperationMutation";
import { If, Timedelta } from "./widgets";


type RunningTimer = {
    id: number,
    name: string,
    state: TimerState,
    elapsedTime: number,
    lengths: number[],
    remainingTimes: number[],
    origLength: string,
}

const padding = "0.5em";

const styles = {
    container: {
        // display: "inline-block",
        padding,
        borderRadius: (theme) => theme.shape.borderRadius,
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

export default ({timer}: { timer: RunningTimer }) => {

    const [operateTimer] = useMutation<TimerOperationMutation, TimerOperationMutationVariables>(timerOperationMutation);

    return (
        <Box sx={styles.container}>
            <Box>
                <Box sx={styles.title}>
                    <span style={{fontSize: "2em", marginRight: "0.4em", marginLeft: "0.2em"}}>{timer.name}</span>
                    <If condition={timer.name != timer.origLength}>
                        <span style={{opacity: 0.8}}>({timer.origLength})</span>
                    </If>
                </Box>
                <Divider/>
                <Box sx={styles.controls}>
                    <If condition={timer.state == "STARTED"}>
                        <IconButton onClick={() => operateTimer({variables: {id: timer.id, operation: TimerOperation.PAUSE}})}>
                            <PauseIcon fontSize="large"/>
                        </IconButton>
                    </If>
                    <If condition={timer.state == "PAUSED"}>
                        <IconButton onClick={() => operateTimer({variables: {id: timer.id, operation: TimerOperation.UNPAUSE}})}>
                            <PlayArrowIcon fontSize="large"/>
                        </IconButton>
                    </If>
                    <IconButton onClick={() => operateTimer({variables: {id: timer.id, operation: TimerOperation.STOP}})}>
                        <StopIcon fontSize="large"/>
                    </IconButton>
                </Box>
            </Box>
            {timer.remainingTimes.map((time, idx) => (
                <Box key={idx} sx={styles.timer} style={{fontSize: idx == 0 ? '4em' : '1.5em'}}>
                    <Timedelta value={time}/>
                </Box>
            ))}
        </Box>
    );
}
