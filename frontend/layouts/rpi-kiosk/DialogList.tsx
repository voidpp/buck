import { DialogProps } from "@/types";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HistoryIcon from "@mui/icons-material/History";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Icon, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { StartTimerDialog } from "../../components/start-timer/StartTimerDialog";
import SavePredefinedTimerDialog from "./SavePredefinedTimerDialog";
import TimerHistoryDialog from "./TimerHistoryDialog";
import PredefinedTimerManagerDialog from "./predefined-timers-manager/Dialog";
import SettingsDialog from "./settings/Dialog";

type DialogState = Record<string, boolean>;

type DialogRenderer = {
    name: string;
    icon: typeof Icon;
    dialog: (props: DialogProps) => JSX.Element;
};

const dialogs: DialogRenderer[] = [
    {
        name: "startTimer",
        icon: PlayCircleFilledWhiteIcon,
        dialog: StartTimerDialog,
    },
    {
        name: "createTimer",
        icon: AddCircleIcon,
        dialog: SavePredefinedTimerDialog,
    },
    {
        name: "predefinedTimerManager",
        icon: ViewListIcon,
        dialog: PredefinedTimerManagerDialog,
    },
    {
        name: "timerHistory",
        icon: HistoryIcon,
        dialog: TimerHistoryDialog,
    },
    {
        name: "settings",
        icon: SettingsIcon,
        dialog: SettingsDialog,
    },
];

const defaultDialogState = dialogs.reduce((res, cur) => {
    res[cur.name] = false;
    return res;
}, {} as DialogState);

export default ({ onDone }: { onDone: () => void }) => {
    const [dialogState, setDialogState] = useState<DialogState>(defaultDialogState);

    const showDialog = (key: string) => () => {
        setDialogState({ ...dialogState, [key]: true });
    };

    const hideDialog = (key: string) => () => {
        setDialogState({ ...dialogState, [key]: false });
    };

    return (
        <React.Fragment>
            <List>
                {dialogs.map(desc => {
                    const IconComponent = desc.icon;

                    return (
                        <ListItem button onClick={showDialog(desc.name)} key={desc.name}>
                            <ListItemIcon>
                                <IconComponent />
                            </ListItemIcon>
                            <ListItemText
                                style={{ paddingRight: "1em" }}
                                primary={<FormattedMessage id={desc.name} />}
                            />
                        </ListItem>
                    );
                })}
            </List>
            {dialogs.map(desc => {
                const DialogComponent = desc.dialog;
                return (
                    <DialogComponent
                        key={desc.name}
                        show={dialogState[desc.name]}
                        close={hideDialog(desc.name)}
                        onDone={onDone}
                    />
                );
            })}
        </React.Fragment>
    );
};
