import { QuickStartPicker } from "@/components/QuickStartPicker";
import { DialogProps } from "@/types";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export const QuickStartDialog = ({ show, close }: DialogProps) => {
    return (
        <Dialog open={show} onClose={close}>
            <DialogTitle>
                <FormattedMessage id="quickStartTitle" />
            </DialogTitle>
            <DialogContent>
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
