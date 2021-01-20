import * as React from "react";
import EqualizerIcon from '@material-ui/icons/Equalizer';
import {gql, useQuery} from "@apollo/client";
import {DebugInfoQuery} from "./__generated__/DebugInfoQuery";
import {useBoolState} from "../../../../hooks";
import {Dialog, DialogContent, Divider, IconButton, LinearProgress, Table, TableBody, TableCell, TableRow} from "@material-ui/core";
import {FormattedDialogTitle} from "../../../widgets/dialogs";
import {TranslationKey} from "../../../../translations";
import {FormattedMessage} from "../../../translations";
import dayjs from 'dayjs';

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
            <FormattedMessage id={labelId} />:
        </TableCell>
        <TableCell>
            {children}
        </TableCell>
    </TableRow>
);

const DebugInfoPanel = () => {
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
                    <LinearProgress variant="determinate" value={data.debugInfo.systemStats.memory.percent} />
                </FormattedFieldRow>
                <FormattedFieldRow labelId="uptime">
                    {dayjs.duration(data.debugInfo.systemStats.uptime * 1000).humanize()}
                </FormattedFieldRow>
            </TableBody>
        </Table>
    );
}

export default ({buttonStyle}: {buttonStyle?: React.CSSProperties}) => {
    const [isShow, show, hide] = useBoolState();

    return (
        <React.Fragment>
            <IconButton onClick={show} size="small" style={buttonStyle}>
                <EqualizerIcon fontSize="small"/>
            </IconButton>
            <Dialog open={isShow} onClose={hide}>
                <FormattedDialogTitle msgId="debugInfo" onCloseIconClick={hide} style={{padding: "0.5em 1em"}}/>
                <Divider/>
                <DialogContent>
                    <DebugInfoPanel/>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
