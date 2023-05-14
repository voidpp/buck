import { LinearProgress, Table, TableBody } from "@mui/material";
import * as React from "react";

import { useDebugInfoQuery } from "@/graphql-types-and-hooks";
import dayjs from "dayjs";
import { FormattedFieldRow } from "./tools";

export default () => {
    const { data } = useDebugInfoQuery();
    if (!data) return null;
    return (
        <Table size="small">
            <TableBody>
                <FormattedFieldRow labelId="load">
                    {data.debugInfo.systemStats.load.map(l => l.toFixed(2)).join(", ")}
                </FormattedFieldRow>
                <FormattedFieldRow labelId="memory">
                    <LinearProgress variant="determinate" value={data.debugInfo.systemStats.memory.percent} />
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
};
