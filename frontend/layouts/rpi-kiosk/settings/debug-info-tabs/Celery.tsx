import * as React from "react";

import { useCeleryInfoQuery } from "@/graphql-types-and-hooks";
import { LinearProgress, Table, TableBody, TableCell, TableRow } from "@mui/material";
import dayjs from "dayjs";
import { FormattedMessage } from "react-intl";
import { BoolIcon } from "../../../../components/widgets";
import FormattedTableHead from "../../FormattedTableHead";

export default () => {
    const { data } = useCeleryInfoQuery();

    if (!data) return <LinearProgress style={{ margin: "1em" }} />;

    if (data.debugInfo.celeryTasks.alarm.length == 0)
        return (
            <div style={{ margin: "1em", fontStyle: "italic" }}>
                <FormattedMessage id="noTasks" />
            </div>
        );

    return (
        <Table size="small">
            <FormattedTableHead labels={["timer", "eta", "last", "revoked"]} />
            <TableBody>
                {data.debugInfo.celeryTasks.alarm.map(task => (
                    <TableRow key={task.eta}>
                        <TableCell>{task.timerId}</TableCell>
                        <TableCell>{dayjs.utc(task.eta).local().format("YYYY-MM-DD HH:mm")}</TableCell>
                        <TableCell>
                            <BoolIcon value={task.isLast} />
                        </TableCell>
                        <TableCell>
                            <BoolIcon value={task.isRevoked} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
