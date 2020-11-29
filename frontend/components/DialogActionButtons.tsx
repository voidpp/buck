import * as React from "react";
import {DialogActions} from "@material-ui/core";
import {FormattedButton} from "./translations";

export default ({onCancel, onSubmit}: { onSubmit: () => void, onCancel: () => void }) => (
    <DialogActions>
        <FormattedButton onClick={onSubmit} msgId="submit"/>
        <FormattedButton onClick={onCancel} msgId="cancel" color="secondary"/>
    </DialogActions>
)
