import * as React from "react";

import { useBoolState } from "@/hooks";
import AlarmAddIcon from "@mui/icons-material/AlarmAdd";
import { Box, Dialog, DialogContent, Divider, IconButton, SxProps } from "@mui/material";

import { QuickStartPicker } from "@/components/QuickStartPicker";
import { SimpleTimerList } from "@/components/SimpleTimerList";
import { StartTimerDialog } from "@/components/start-timer/StartTimerDialog";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import { FormattedMessage } from "react-intl";

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
                    <SimpleTimerList onDone={hide} />
                    <Box sx={{ borderRight: "1px solid grey", mr: 3 }} />
                    <QuickStartPicker onDone={hide} />
                </DialogContent>
            </Dialog>
        </Box>
    );
};
