import * as React from "react";

import { useBoolState } from "@/hooks";
import AlarmAddIcon from "@mui/icons-material/AlarmAdd";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, DialogContent, Divider, IconButton, SxProps } from "@mui/material";

import { QuickStartPicker } from "@/components/QuickStartPicker";
import { SimpleTimerList } from "@/components/SimpleTimerList";
import { FormattedMessage } from "react-intl";

const styles = {
    title: {
        padding: "8px 39px",
        fontSize: "1.2em",
        display: "flex",
        alignItems: "center",
    },
} satisfies Record<string, SxProps>;

export default ({ style, className }: { style?: React.CSSProperties; className?: string }) => {
    const [isShow, show, hide] = useBoolState();

    return (
        <Box style={style} className={className}>
            <IconButton onClick={show}>
                <AlarmAddIcon fontSize="large" />
            </IconButton>
            <Dialog open={isShow} onClose={hide} maxWidth="md" fullWidth>
                <Box sx={styles.title}>
                    <span style={{ flexGrow: 1 }}>
                        <FormattedMessage id="quickStartTitle" />
                    </span>
                    <IconButton size="small" onClick={hide} sx={{ mr: -3 }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Divider />
                <DialogContent sx={{ display: "flex", py: 1 }}>
                    <SimpleTimerList onDone={hide} limit={5} />
                    <Box sx={{ borderRight: "1px solid grey", mr: 3 }} />
                    <QuickStartPicker onDone={hide} sx={{ width: "100%" }} optionMinWidth={75} />
                </DialogContent>
            </Dialog>
        </Box>
    );
};
