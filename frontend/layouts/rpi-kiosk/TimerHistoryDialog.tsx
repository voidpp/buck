import { Dialog, DialogContent, Table, TableBody, TableCell, TableRow } from "@mui/material";
import * as React from "react";

import { Timer, useTimerEventListQuery } from "@/graphql-types-and-hooks";
import { FormattedDialogTitle } from "../../components/dialogs";

const TimerName = ({ timer }: { timer: Pick<Timer, "name" | "length"> }) => {
    if (!timer.name) return <TableCell>{timer.length}</TableCell>;
    return (
        <TableCell>
            {timer.name} ({timer.length})
        </TableCell>
    );
};

const Content = () => {
    const { data } = useTimerEventListQuery();

    const events = data?.timerEvents ?? [];

    return (
        <DialogContent>
            <Table size="small">
                <TableBody>
                    {events.map(event => (
                        <TableRow key={event.id}>
                            <TimerName timer={event.timer} />
                            <TableCell>{event.type}</TableCell>
                            {/*<TableCell>{event.time}</TableCell>*/}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DialogContent>
    );
};

export default ({ show, close }: { show: boolean; close: () => void }) => (
    <Dialog open={show} onClose={close}>
        <FormattedDialogTitle msgId="timerHistory" onCloseIconClick={close} />
        <Content />
    </Dialog>
);
