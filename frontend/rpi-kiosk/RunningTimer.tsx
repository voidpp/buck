import { useMutation } from "@apollo/client";
import { Divider, IconButton } from "@material-ui/core";
import * as React from "react";

import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { CreateCSSProperties } from "@material-ui/core/styles/withStyles";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { TimerOperation, TimerState } from "../__generated__/globalTypes";
import { timerOperationMutation } from "./timerOperationMutation";
import { If, Timedelta } from "./widgets";
import { TimerOperationMutation, TimerOperationMutationVariables } from "./__generated__/TimerOperationMutation";


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

const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
        // display: "inline-block",
        padding,
        borderRadius: theme.shape.borderRadius,
        border: "1px solid grey",
        boxShadow: "0 0 10px rgba(0,0,0,.7)",
        margin: "0.5em",
    } as CreateCSSProperties,
    title: {
        paddingBottom: padding,
        whiteSpace: "nowrap",
    } as CreateCSSProperties,
    controls: {
        display: "flex",
        justifyContent: "center",
    } as CreateCSSProperties,
    timer: {
        textAlign: "center",
        padding: "0 0.3em",
    } as CreateCSSProperties,
}));

export default ({timer}: { timer: RunningTimer }) => {
    const classes = useStyles();

    const [operateTimer] = useMutation<TimerOperationMutation, TimerOperationMutationVariables>(timerOperationMutation);

    return (
        <div className={classes.container}>
            <div>
                <div className={classes.title}>
                    <span style={{fontSize: "2em", marginRight: "0.4em", marginLeft: "0.2em"}}>{timer.name}</span>
                    <If condition={timer.name != timer.origLength}>
                        <span style={{opacity: 0.8}}>({timer.origLength})</span>
                    </If>
                </div>
                <Divider/>
                <div className={classes.controls}>
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
                </div>
            </div>
            {timer.remainingTimes.map((time, idx) => (
                <div key={idx} className={classes.timer} style={{fontSize: idx == 0 ? '4em' : '1.5em'}}>
                    <Timedelta value={time}/>
                </div>
            ))}
        </div>
    );
}
