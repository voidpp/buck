import HelpIcon from '@mui/icons-material/Help';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { FormattedButton } from "./translations";

type MessageValues = { [key: string]: any };

export type ContentProps = {
    messageId?: string,
    messageVars?: MessageValues,
};

type Props = {
    onConfirm: () => void,
    close: () => void,
    isOpen: boolean,
    onCancel?: () => void,
    titleId?: string,
} & ContentProps;

const defaultMessage: string = "areYouSure";

export const ConfirmDialogContent = ({messageId = defaultMessage, messageVars}: ContentProps) => (
    <DialogContent style={{padding: "0.5em 1em", display: "flex", alignItems: "center"}}>
        <HelpIcon style={{marginRight: "0.3em"}} fontSize="large"/>
        <div style={{marginRight: '0.3em'}}>
            <FormattedMessage id={messageId} values={messageVars}/>
        </div>
    </DialogContent>
);

export default (props: Props) => {

    const {onConfirm, onCancel, isOpen, close, titleId = "confirm", messageId = defaultMessage, messageVars = {}} = props;

    function confirm() {
        if (close) close();
        onConfirm();
    }

    function cancel() {
        if (close) close();
        if (onCancel) onCancel();
    }

    return (
        <Dialog open={isOpen} onClose={close}>
            <DialogTitle>
                <FormattedMessage id={titleId}/>
            </DialogTitle>
            <ConfirmDialogContent messageId={messageId} messageVars={messageVars}/>
            <DialogActions>
                <FormattedButton msgId="yes" autoFocus onClick={confirm} color="primary"/>
                <FormattedButton msgId="no" onClick={cancel} color="secondary"/>
            </DialogActions>
        </Dialog>
    );
};
