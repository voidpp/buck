import {gql, useQuery} from "@apollo/client";
import * as React from "react";
import {LinearProgress, Table, TableBody} from "@material-ui/core";

import dayjs from "dayjs";
import {FormattedFieldRow} from "./tools";
import {DebugInfoQuery} from "./__generated__/DebugInfoQuery";

const query = gql`
    query DebugInfoQuery {
        debugInfo {
            systemStats {
                load
                memory {
                    percent
                }
                uptime
                cpuTemp
            }
        }
    }
`;

export default () => {
    const {data} = useQuery<DebugInfoQuery>(query);
    if (!data)
        return null;
    return (
        <Table size="small">
            <TableBody>
                <FormattedFieldRow labelId="load">
                    {data.debugInfo.systemStats.load.map(l => l.toFixed(2)).join(", ")}
                </FormattedFieldRow>
                <FormattedFieldRow labelId="memory">
                    <LinearProgress variant="determinate" value={data.debugInfo.systemStats.memory.percent}/>
                </FormattedFieldRow>
                <FormattedFieldRow labelId="uptime">
                    {dayjs.duration(data.debugInfo.systemStats.uptime * 1000).humanize()}
                </FormattedFieldRow>
                <FormattedFieldRow labelId="cpuTemp">
                    {Math.round(data.debugInfo.systemStats.cpuTemp)}°C
                </FormattedFieldRow>
            </TableBody>
        </Table>
    );
}
