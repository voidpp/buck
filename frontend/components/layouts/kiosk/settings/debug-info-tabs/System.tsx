import {gql, useQuery} from "@apollo/client";
import {TranslationKey} from "../../../../../translations";
import * as React from "react";
import {LinearProgress, Table, TableBody, TableCell, TableRow} from "@material-ui/core";
import {FormattedMessage} from "../../../../translations";
import {DebugInfoQuery} from "./__generated__/DebugInfoQuery";
import dayjs from "dayjs";

const query = gql`
    query DebugInfoQuery {
        debugInfo {
            systemStats {
                load
                memory {
                    percent
                }
                uptime
            }
        }
    }
`;

const FormattedFieldRow = ({labelId, children}: { labelId: TranslationKey, children: React.ReactNode }) => (
    <TableRow>
        <TableCell style={{textAlign: "right"}}>
            <FormattedMessage id={labelId}/>:
        </TableCell>
        <TableCell>
            {children}
        </TableCell>
    </TableRow>
);

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
            </TableBody>
        </Table>
    );
}
