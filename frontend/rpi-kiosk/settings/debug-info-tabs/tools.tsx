import * as React from "react";
import {TableCell, TableRow} from "@material-ui/core";
import {FormattedMessage} from "react-intl";

export const FormattedFieldRow = ({labelId, children}: { labelId: string, children: React.ReactNode }) => (
    <TableRow>
        <TableCell style={{textAlign: "right"}}>
            <FormattedMessage id={labelId}/>:
        </TableCell>
        <TableCell>
            {children}
        </TableCell>
    </TableRow>
);
