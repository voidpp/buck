import * as React from "react";
import {DialogTitle, IconButton} from "@material-ui/core";
import {FormattedMessage} from "../translations";
import {TranslationKey} from "../../translations";
import CloseIcon from '@material-ui/icons/Close';
import {If} from "../tools";

export const FormattedDialogTitle = ({msgId, onCloseIconClick}: { msgId: TranslationKey, onCloseIconClick?: () => void }) => (
    <DialogTitle>
        <div style={{display: "flex", flexDirection: "row"}}>
            <div style={{flexGrow: 1}}>
                <FormattedMessage id={msgId}/>
            </div>
            <If condition={!!onCloseIconClick}>
                <IconButton size="small" style={{marginRight: -6, marginLeft: '0.5em'}} onClick={onCloseIconClick}>
                    <CloseIcon style={{margin: '0 3px'}} fontSize="small"/>
                </IconButton>
            </If>
        </div>
    </DialogTitle>
);
