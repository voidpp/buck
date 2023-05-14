import { FormattedDialogTitle } from "@/components/dialogs";
import { useBoolState, useGroupedPredefinedTimerList } from "@/hooks";
import { FormattedTableCell } from "@/translations";
import { DialogProps } from "@/types";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Dialog,
    DialogContent,
    IconButton,
    SxProps,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Theme,
    Typography,
} from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import SavePredefinedTimerDialog from "../SavePredefinedTimerDialog";
import DeleteButton from "./DeleteButton";
import UpdateButton from "./UpdateButton";

const sytles = {
    root: {
        width: "100%",
    },
    heading: {
        fontSize: theme => theme.typography.pxToRem(15),
        flexBasis: "33.33%",
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme => theme.typography.pxToRem(15),
        color: theme => theme.palette.text.secondary,
    },
} satisfies Record<string, SxProps<Theme>>;

const Content = ({ close }: { close: () => void }) => {
    const { timers, refetch } = useGroupedPredefinedTimerList();
    const [showGrpId, setShowGrpId] = useState<number>();
    const [isShowCreateTimerDialog, showCreateTimerDialog, hideCreateTimerDialog] = useBoolState();

    const openGroup = (grpId: number) => (ev, isExpanded: boolean) => {
        setShowGrpId(isExpanded ? grpId : null);
    };

    return (
        <React.Fragment>
            <SavePredefinedTimerDialog
                show={isShowCreateTimerDialog}
                close={hideCreateTimerDialog}
                onSuccess={() => refetch()}
            />
            <FormattedDialogTitle msgId="predefinedTimers" onCloseIconClick={close} style={{ paddingBottom: 0 }}>
                <IconButton onClick={showCreateTimerDialog} style={{ marginLeft: "0.1em" }}>
                    <AddBoxIcon />
                </IconButton>
            </FormattedDialogTitle>
            <DialogContent>
                {timers.map(grp => (
                    <Accordion
                        expanded={showGrpId == grp.group.id}
                        key={grp.group.id}
                        onChange={openGroup(grp.group.id)}
                        elevation={5}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={sytles.heading}>{grp.group.name}</Typography>
                            <Typography sx={sytles.heading}>
                                <FormattedMessage id="timersCount" values={{ cnt: grp.predefinedTimers.length }} />
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <FormattedTableCell msgId="name" />
                                        <FormattedTableCell msgId="lengthHeader" />
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {grp.predefinedTimers.map(t => (
                                        <TableRow key={t.id}>
                                            <TableCell>{t.name}</TableCell>
                                            <TableCell>{t.length}</TableCell>
                                            <TableCell>
                                                <UpdateButton timer={t} onSuccess={() => refetch()} />
                                                <DeleteButton timer={t} onSuccess={() => refetch()} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </DialogContent>
        </React.Fragment>
    );
};

export default ({ show, close }: DialogProps) => {
    return (
        <Dialog open={show} onClose={close}>
            <Content close={close} />
        </Dialog>
    );
};
