import * as React from "react";
import {Dialog, Fade, IconButton} from "@material-ui/core";
import {gql, useSubscription} from "@apollo/client";
import {RunningTimersSubscription} from "./__generated__/RunningTimersSubscription";
import RunningTimer from "./RunningTimer";
import {useBoolState} from "../../../hooks";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";
import CloseIcon from '@material-ui/icons/Close';
import {If, SlideDown} from "../../tools";
import AlarmOnIcon from '@material-ui/icons/AlarmOn';


const runningTimersSubscription = gql`
    subscription RunningTimersSubscription {
        runningTimers {
            id
            name
            state
            elapsedTime
            lengths
            remainingTimes
            origLength
        }
    }
`;

const useStyles = makeStyles((theme: Theme) => createStyles({
    button: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: theme.zIndex.modal + 1,
    } as CreateCSSProperties,
    container: {
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        padding: 10,
    } as CreateCSSProperties,
    content: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
    } as CreateCSSProperties,
}));

export default () => {
    const classes = useStyles();
    const [isDialogForceOpen, _1, _2, dialogForceToggle] = useBoolState(true);
    const {data} = useSubscription<RunningTimersSubscription>(runningTimersSubscription);
    const runningTimers = data?.runningTimers ?? [];

    const isTimersRunning = runningTimers.length > 0

    let isOpen = isTimersRunning;

    if (isTimersRunning)
        isOpen = isDialogForceOpen;

    return (
        <React.Fragment>
            <Dialog open={isOpen} fullScreen TransitionComponent={SlideDown}>
                <div className={classes.content}>
                    <div className={classes.container}>
                        {runningTimers.map(timer => <RunningTimer key={timer.id} timer={timer}/>)}
                    </div>
                </div>
            </Dialog>
            <Fade in={isTimersRunning}>
                <div className={classes.button}>
                    <IconButton onClick={dialogForceToggle}>
                        <If condition={isDialogForceOpen} else_={<AlarmOnIcon/>}>
                            <CloseIcon/>
                        </If>
                    </IconButton>
                </div>
            </Fade>
        </React.Fragment>
    );
}
