import { TableCell, TableCellProps, TableHead, TableRow, Typography } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

type FormattedTableHeadProps = {
    labels: string[],
    cellProps?: Record<string, TableCellProps>,
    prefix?: string,
    cellRenderer?: { [s: string]: React.Factory<{}> },
};

export default ({labels, cellProps = {}, prefix, cellRenderer = {}}: FormattedTableHeadProps) => (
    <TableHead>
        <TableRow>
            {labels.map((label, idx) => (
                <TableCell key={idx} {...cellProps[label]}>
                    {cellRenderer[label] ? React.createElement(cellRenderer[label]) : (
                        <Typography>
                            {label ? <FormattedMessage id={prefix ? `${prefix}.${label}` : label}/> : null}
                        </Typography>
                    )}
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
);
