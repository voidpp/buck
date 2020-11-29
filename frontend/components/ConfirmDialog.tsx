import * as React from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {TranslationKey} from "../translations";
import {FormattedButton, FormattedMessage} from "./translations";
import HelpIcon from '@material-ui/icons/Help';

type MessageValues = { [key: string]: any };

export type ContentProps = {
    messageId?: TranslationKey,
    messageVars?: MessageValues,
};

type Props = {
    onConfirm: () => void,
    close: () => void,
    isOpen: boolean,
    onCancel?: () => void,
    titleId?: TranslationKey,
} & ContentProps;

const defaultMessage: TranslationKey = "areYouSure";

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
        <Dialog
            open={isOpen}
            disableBackdropClick
            onEscapeKeyDown={close}
        >
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
