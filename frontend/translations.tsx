import { Button, ButtonProps, TableCell, TableCellProps } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

type FormattedComponentProps = {
    msgId: string;
};

type FormattedButtonProps = FormattedComponentProps & ButtonProps;

export const FormattedButton = ({ msgId, ...props }: FormattedButtonProps) => (
    <Button color="primary" {...props}>
        <FormattedMessage id={msgId} />
    </Button>
);

type FormattedTableCellProps = FormattedComponentProps & TableCellProps;

export const FormattedTableCell = ({ msgId, ...props }: FormattedTableCellProps) => (
    <TableCell {...props}>
        <FormattedMessage id={msgId} />
    </TableCell>
);
