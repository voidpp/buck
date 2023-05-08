import { TableCell, TableRow } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

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
