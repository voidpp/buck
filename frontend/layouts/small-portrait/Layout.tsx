import { PredefinedTimerManagerDialog } from "@/components/predefined-timers-manager/Dialog";
import { StartTimerDialog } from "@/components/start-timer/StartTimerDialog";
import { BuckGenericDialogProps } from "@/types";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import AlarmAddIcon from "@mui/icons-material/AlarmAdd";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Box, Icon, SpeedDial, SpeedDialAction, SxProps, Theme, Typography } from "@mui/material";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { ClockWidget } from "../../components/Clock";
import { ActiveAlarmDialog } from "./ActiveAlarm";
import { QuickStartDialog } from "./QuickStartDialog";
import { RunningTimerList } from "./RunningTimerList";

const styles = {
    appBackground: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        fontSize: "10rem",
        opacity: 0.05,
        position: "absolute",
        zIndex: -1,
    },
} satisfies Record<string, SxProps<Theme>>;

type DialogState = Record<string, boolean>;

type DialogRenderer = {
    name: string;
    icon: typeof Icon;
    dialog: (props: BuckGenericDialogProps) => JSX.Element;
};

const dialogs: DialogRenderer[] = [
    {
        name: "quickStartTitle",
        icon: AlarmAddIcon,
        dialog: QuickStartDialog,
    },
    {
        name: "startTimer",
        icon: PlayCircleFilledWhiteIcon,
        dialog: StartTimerDialog,
    },
    {
        name: "predefinedTimerManager",
        icon: ViewListIcon,
        dialog: PredefinedTimerManagerDialog,
    },
];

const defaultDialogState = dialogs.reduce((res, cur) => {
    res[cur.name] = false;
    return res;
}, {} as DialogState);

export const SmallPortraitLayout = () => {
    const [dialogState, setDialogState] = React.useState<DialogState>(defaultDialogState);

    const showDialog = (key: string) => () => {
        setDialogState({ ...dialogState, [key]: true });
    };

    const hideDialog = (key: string) => () => {
        setDialogState({ ...dialogState, [key]: false });
    };

    return (
        <>
            <Box sx={styles.appBackground}>
                <AccessAlarmIcon fontSize="inherit" />
            </Box>
            <RunningTimerList />
            <ClockWidget style={{ fontSize: "5em", left: 20, bottom: -20, position: "absolute", opacity: 0.5 }} />
            <SpeedDial
                ariaLabel="SpeedDial"
                sx={{ position: "absolute", bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                {dialogs.map(desc => {
                    const IconComponent = desc.icon;

                    return (
                        <SpeedDialAction
                            key={desc.name}
                            onClick={showDialog(desc.name)}
                            icon={<IconComponent />}
                            tooltipTitle={
                                <Typography sx={{ whiteSpace: "nowrap" }}>
                                    <FormattedMessage id={desc.name} />
                                </Typography>
                            }
                            tooltipOpen
                        />
                    );
                })}
            </SpeedDial>
            {dialogs.map(desc => {
                const DialogComponent = desc.dialog;
                return (
                    <DialogComponent
                        key={desc.name}
                        show={dialogState[desc.name]}
                        close={hideDialog(desc.name)}
                        onDone={() => {}}
                        muiDialogProps={{
                            disableRestoreFocus: true, // without this the speed dial opens after dialog close
                        }}
                    />
                );
            })}
            <ActiveAlarmDialog />
        </>
    );
};
