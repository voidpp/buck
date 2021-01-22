import * as React from "react";
import {gql, useQuery} from "@apollo/client";
import {CeleryInfoQuery} from "./__generated__/CeleryInfoQuery";
import {LinearProgress, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import {BoolIcon, FormattedTableHead} from "../../../../tools";
import dayjs from "dayjs";

const query = gql`
    query CeleryInfoQuery {
        debugInfo {
            celeryTasks {
                alarm {
                    eta
                    isLast
                    isRevoked
                    timerId
                }
            }
        }
    }
`;

export default () => {
    const {data} = useQuery<CeleryInfoQuery>(query);

    if (!data)
        return <LinearProgress style={{margin: "1em"}} />;

    if (data.debugInfo.celeryTasks.alarm.length == 0)
        return <div style={{margin: "1em", fontStyle: "italic"}}><FormattedMessage id="noTasks"/></div>;

    return (
        <Table size="small">
            <FormattedTableHead labels={["timer", "eta", "last", "revoked"]} />
            <TableBody>
                {data.debugInfo.celeryTasks.alarm.map(task => (
                    <TableRow key={task.eta}>
                        <TableCell>{task.timerId}</TableCell>
                        <TableCell>{dayjs.utc(task.eta).local().format("YYYY-MM-DD HH:mm")}</TableCell>
                        <TableCell><BoolIcon value={task.isLast} /></TableCell>
                        <TableCell><BoolIcon value={task.isRevoked} /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
