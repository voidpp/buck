import { QuickStartPicker } from "@/components/QuickStartPicker";
import { BuckGenericDialogProps } from "@/types";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { SimpleTimerList } from "../../components/SimpleTimerList";
import { FormattedButton } from "../../translations";

export const QuickStartDialog = ({ show, close, muiDialogProps }: BuckGenericDialogProps) => {
    return (
        <Dialog open={show} onClose={close} {...muiDialogProps} fullWidth>
            <DialogTitle>
                <FormattedMessage id="quickStartTitle" />
            </DialogTitle>
            <DialogContent>
                <SimpleTimerList onDone={close} />
                <QuickStartPicker onDone={close} />
            </DialogContent>
            <DialogActions>
                <FormattedButton msgId="close" onClick={close} />
            </DialogActions>
        </Dialog>
    );
};
