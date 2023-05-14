import CloseIcon from "@mui/icons-material/Close";
import { DialogTitle, IconButton } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { If } from "./widgets";

type FormattedDialogTitleProps = {
    msgId: string;
    onCloseIconClick?: () => void;
    children?: React.ReactNode;
    style?: React.CSSProperties;
};

export const FormattedDialogTitle = ({ msgId, onCloseIconClick, children, style }: FormattedDialogTitleProps) => (
    <DialogTitle style={{ paddingBottom: 0, ...style }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flexGrow: 1 }}>
                <FormattedMessage id={msgId} />
                {children}
            </div>
            <If condition={!!onCloseIconClick}>
                <IconButton size="small" style={{ marginRight: -6, marginLeft: "0.5em" }} onClick={onCloseIconClick}>
                    <CloseIcon style={{ margin: "0 3px" }} fontSize="small" />
                </IconButton>
            </If>
        </div>
    </DialogTitle>
);
