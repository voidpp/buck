import { QuickStartPicker } from "@/components/QuickStartPicker";
import { BuckGenericDialogProps } from "@/types";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { SimpleTimerList } from "../../components/SimpleTimerList";

export const QuickStartDialog = ({ show, close, muiDialogProps }: BuckGenericDialogProps) => {
    return (
        <Dialog open={show} onClose={close} {...muiDialogProps}>
            <DialogTitle>
                <FormattedMessage id="quickStartTitle" />
            </DialogTitle>
            <DialogContent>
                <SimpleTimerList onDone={close} />
                <Divider sx={{ mb: 3 }} />
                <QuickStartPicker onDone={close} />
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>
                    <FormattedMessage id="cancel" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
