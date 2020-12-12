import * as React from "react";
import {Dialog, DialogContent, Table, TableBody, TableCell, TableRow} from "@material-ui/core";
import {gql, useQuery} from "@apollo/client";
import {TimerEventsQuery} from "./__generated__/TimerEventsQuery";
import {FormattedDialogTitle} from "../../widgets/dialogs";
import {Timer} from "../../../api";

const timerEventsQuery = gql`
    query TimerEventsQuery {
        timerEvents {
            id
            time
            type
            timer {
                name
                length
            }
        }
    }
`;

const TimerName = ({timer}: { timer: Pick<Timer, "name" | "length"> }) => {
    if (!timer.name)
        return <TableCell>{timer.length}</TableCell>;
    return <TableCell>{timer.name} ({timer.length})</TableCell>;
}

const Content = () => {

    const {data} = useQuery<TimerEventsQuery>(timerEventsQuery);

    const events = data?.timerEvents ?? [];

    return (
        <DialogContent>
            <Table size="small">
                <TableBody>
                    {events.map(event => (
                        <TableRow key={event.id}>
                            <TimerName timer={event.timer}/>
                            <TableCell>{event.type}</TableCell>
                            {/*<TableCell>{event.time}</TableCell>*/}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DialogContent>
    );
}

export default ({show, close}: { show: boolean, close: () => void }) => (
    <Dialog open={show} onClose={close}>
        <FormattedDialogTitle msgId="timerHistory" onCloseIconClick={close}/>
        <Content/>
    </Dialog>
)
