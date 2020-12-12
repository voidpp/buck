import * as React from "react";
import {useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";
import {FormattedMessage} from "../../translations";
import StartTimerDialog from "./start-timer/StartTimerDialog";
import PredefinedTimerManagerDialog from "./predefined-timers-manager/Dialog";
import SavePredefinedTimerDialog from "./SavePredefinedTimerDialog";
import {TranslationKey} from "../../../translations";
import {TimerPageDialogProps} from "./types";
import {Button, Icon} from "@material-ui/core";
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ViewListIcon from '@material-ui/icons/ViewList';
import HistoryIcon from '@material-ui/icons/History';
import TimerHistoryDialog from "./TimerHistoryDialog";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: "grid",
        width: "100%",
        height: "100%",
        alignItems: "center",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        padding: '2em',
        '& > div': {
            display: "flex",
            justifyContent: "center",
        },
    } as CreateCSSProperties,
    button: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    } as CreateCSSProperties,
}));

type DialogState = Record<string, boolean>;

type DialogRenderer = {
    name: TranslationKey,
    icon: typeof Icon,
    dialog: (props: TimerPageDialogProps) => JSX.Element,
};

const dialogRenderers: DialogRenderer[] = [{
    name: "startTimer",
    icon: PlayCircleFilledWhiteIcon,
    dialog: StartTimerDialog,
}, {
    name: "createTimer",
    icon: AddCircleIcon,
    dialog: SavePredefinedTimerDialog,
}, {
    name: "predefinedTimerManager",
    icon: ViewListIcon,
    dialog: PredefinedTimerManagerDialog,
}, {
    name: "timerHistory",
    icon: HistoryIcon,
    dialog: TimerHistoryDialog,
}];

const defaultDialogState = dialogRenderers.reduce((res, cur) => {
    res[cur.name] = false;
    return res;
}, {} as DialogState);

export default () => {
    const classes = useStyles();
    const [dialogState, setDialogState] = useState<DialogState>(defaultDialogState);

    const showDialog = (key: string) => () => {
        setDialogState({...dialogState, [key]: true});
    }

    const hideDialog = (key: string) => () => {
        setDialogState({...dialogState, [key]: false});
    }

    return (
        <div className={classes.root}>
            {dialogRenderers.map(desc => {
                const DialogComponent = desc.dialog;
                const IconComponent = desc.icon;

                return (
                    <div key={desc.name}>
                        <Button onClick={showDialog(desc.name)} color="primary">
                            <div className={classes.button}>
                                <IconComponent style={{fontSize: "4em"}}/>
                                <FormattedMessage id={desc.name}/>
                            </div>
                        </Button>
                        <DialogComponent
                            show={dialogState[desc.name]}
                            close={hideDialog(desc.name)}
                        />
                    </div>
                );
            })}
        </div>
    );
}
