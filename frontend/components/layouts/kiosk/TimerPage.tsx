import * as React from "react";
import {useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";
import {FormattedButton} from "../../translations";
import StartTimerDialog from "./start-timer/StartTimerDialog";
import CreateTimerDialog from "./CreateTimerDialog";
import PredefinedTimerManagerDialog from "./predefined-timers-manager/Dialog";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    } as CreateCSSProperties,
}));

type DialogState = {
    startTimer: boolean,
    createTimer: boolean,
    predefinedTimerManager: boolean,
}

export default () => {
    const classes = useStyles();

    const [dialogState, setDialogState] = useState<DialogState>();

    const showDialog = (key: keyof DialogState) => () => {
        setDialogState({...dialogState, [key]: true});
    }

    const hideDialog = (key: keyof DialogState) => () => {
        setDialogState({...dialogState, [key]: false});
    }

    return (
        <div className={classes.root}>
            <div>
                <FormattedButton onClick={showDialog('startTimer')} msgId="startTimer"/>
                <StartTimerDialog show={dialogState?.startTimer ?? false} close={hideDialog('startTimer')}/>
            </div>
            <div>
                <FormattedButton onClick={showDialog('createTimer')} msgId="createTimer"/>
                <CreateTimerDialog show={dialogState?.createTimer ?? false} close={hideDialog('createTimer')}/>
            </div>
            <div>
                <FormattedButton onClick={showDialog('predefinedTimerManager')} msgId="predefinedTimers"/>
                <PredefinedTimerManagerDialog
                    show={dialogState?.predefinedTimerManager ?? false}
                    close={hideDialog('predefinedTimerManager')}
                />
            </div>
        </div>
    );
}
