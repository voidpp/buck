import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import * as React from "react";
import { useBoolState } from "../hooks";
import ConfirmDialog, { ContentProps } from "./ConfirmDialog";

export default ({onConfirm, messageId, messageVars}: { onConfirm: () => void } & ContentProps) => {
    const [isOpen, open, close] = useBoolState();

    return (
        <React.Fragment>
            <IconButton size="small" onClick={open}>
                <DeleteIcon fontSize="small"/>
            </IconButton>
            <ConfirmDialog
                isOpen={isOpen}
                close={close}
                onConfirm={onConfirm}
                messageId={messageId}
                messageVars={messageVars}
            />
        </React.Fragment>
    );
}
