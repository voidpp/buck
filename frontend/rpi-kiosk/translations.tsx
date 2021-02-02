import * as React from "react";
import {Button, ButtonProps, TableCell, TableCellProps} from "@material-ui/core";
import {FormattedMessage} from "react-intl";

type FormattedButtonProps = {
    msgId: string,
} & ButtonProps;

export const FormattedButton = (props: FormattedButtonProps) => {
    const props_ = {...props};
    delete props_.msgId;

    return (
        <Button color="primary" {...props_}>
            <FormattedMessage id={props.msgId}/>
        </Button>
    )
};

type FormattedTableCellProps = {
    msgId: string,
} & TableCellProps;


export const FormattedTableCell = (props: FormattedTableCellProps) => {
    const props_ = {...props};
    delete props_.msgId;

    return (
        <TableCell {...props_}>
            <FormattedMessage id={props.msgId}/>
        </TableCell>
    )
}
