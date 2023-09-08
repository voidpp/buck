import { Box, Dialog, Fade, IconButton, SxProps, Theme } from "@mui/material";
import * as React from "react";

import { useBoolState, useRunningTimers } from "@/hooks";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import CloseIcon from "@mui/icons-material/Close";
import { If, SlideDown } from "../../components/widgets";
import RunningTimer from "./RunningTimer";

const styles = {
    button: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: theme => theme.zIndex.modal + 1,
    },
    container: {
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        padding: "10px",
    },
    content: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
    },
} satisfies Record<string, SxProps<Theme>>;

export default () => {
    const [isDialogForceOpen, _1, _2, dialogForceToggle] = useBoolState(true);
    const runningTimers = useRunningTimers();

    const isTimersRunning = runningTimers.length > 0;

    let isOpen = isTimersRunning;

    if (isTimersRunning) isOpen = isDialogForceOpen;

    return (
        <React.Fragment>
            <Dialog open={isOpen} fullScreen TransitionComponent={SlideDown}>
                <Box sx={styles.content}>
                    <Box sx={styles.container}>
                        {runningTimers.map(timer => (
                            <RunningTimer key={timer.id} timer={timer} />
                        ))}
                    </Box>
                </Box>
            </Dialog>
            <Fade in={isTimersRunning}>
                <Box sx={styles.button}>
                    <IconButton onClick={dialogForceToggle}>
                        <If condition={isDialogForceOpen} else_={<AlarmOnIcon />}>
                            <CloseIcon />
                        </If>
                    </IconButton>
                </Box>
            </Fade>
        </React.Fragment>
    );
};
