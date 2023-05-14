import * as React from "react";

import { useBoolState } from "@/hooks";
import AlarmAddIcon from "@mui/icons-material/AlarmAdd";
import { Box, Dialog, DialogContent, Divider, IconButton, List, ListItem, SxProps } from "@mui/material";

import { QuickStartPicker } from "@/components/QuickStartPicker";
import { StartTimerDialog } from "@/components/start-timer/StartTimerDialog";
import { QuickTimerListQuery, useQuickTimerListQuery, useStartTimerMutation } from "@/graphql-types-and-hooks";
import { ArrayElement } from "@/tools";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import { FormattedMessage } from "react-intl";

type Timer = ArrayElement<QuickTimerListQuery["predefinedTimers"]>;

const contentStyles = {
    list: {
        fontSize: "1.1em",
        paddingBottom: "9px",
        paddingTop: "9px",
    },
} satisfies Record<string, SxProps>;

const Content = ({ onDone }: { onDone: () => void }) => {
    const { data } = useQuickTimerListQuery({ fetchPolicy: "cache-and-network" });
    const [startTimer] = useStartTimerMutation();

    if (!data) return null;

    const createStartTimer = (timer: Timer) => async () => {
        const res = await startTimer({
            variables: {
                soundFile: timer.soundFile,
                length: timer.length,
                predefinedTimerId: timer.id,
                name: (timer.group ? timer.group.name + " / " : "") + timer.name,
            },
        });
        if (res.data.startTimer.errors) alert("wut? (TODO)");
        else onDone();
    };

    return (
        <List>
            {data.predefinedTimers.slice(0, 6).map(timer => (
                <ListItem button key={timer.id} onClick={createStartTimer(timer)} sx={contentStyles.list}>
                    {timer.group ? timer.group.name + " / " : ""}
                    {timer.name} ({timer.length})
                </ListItem>
            ))}
        </List>
    );
};

const styles = {
    title: {
        padding: "8px 39px",
        fontSize: "1.2em",
        display: "flex",
        alignItems: "center",
    },
} satisfies Record<string, SxProps>;

const StartTimerDialogButton = () => {
    const [isShow, show, hide] = useBoolState();

    return (
        <>
            <IconButton onClick={show} size="small">
                <PlayCircleFilledWhiteIcon />
            </IconButton>
            <StartTimerDialog show={isShow} close={hide} />
        </>
    );
};

export default ({ style, className }: { style?: React.CSSProperties; className?: string }) => {
    const [isShow, show, hide] = useBoolState();

    return (
        <Box style={style} className={className}>
            <IconButton onClick={show}>
                <AlarmAddIcon fontSize="large" />
            </IconButton>
            <Dialog open={isShow} onClose={hide} maxWidth="md">
                <Box sx={styles.title}>
                    <span style={{ flexGrow: 1 }}>
                        <FormattedMessage id="quickStartTitle" />
                    </span>
                    <StartTimerDialogButton />
                </Box>
                <Divider />
                <DialogContent sx={{ display: "flex", py: 1 }}>
                    <Content onDone={hide} />
                    <Box style={{ borderRight: "1px solid grey" }} />
                    <QuickStartPicker onDone={hide} />
                </DialogContent>
            </Dialog>
        </Box>
    );
};
