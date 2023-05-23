import { FormattedDialogTitle } from "@/components/dialogs";
import { useBoolState, useGroupedPredefinedTimerList } from "@/hooks";
import { FormattedButton, FormattedTableCell } from "@/translations";
import { BuckGenericDialogProps } from "@/types";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Dialog,
    DialogActions,
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

const styles = {
    root: {
        width: "100%",
    },
    heading: {
        fontSize: theme => theme.typography.pxToRem(15),
        flexBasis: "33.33%",
        flexShrink: 0,
    },
    noGroup: {
        fontStyle: "italic",
        opacity: 0.5,
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
                            {grp.group.id ? (
                                <Typography sx={styles.heading}>{grp.group.name}</Typography>
                            ) : (
                                <Typography sx={{ ...styles.heading, ...styles.noGroup }}>
                                    <FormattedMessage id="noGroup" />
                                </Typography>
                            )}
                            <Typography sx={styles.heading}>
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
            <DialogActions>
                <FormattedButton msgId="close" onClick={close} />
            </DialogActions>
        </React.Fragment>
    );
};

export const PredefinedTimerManagerDialog = ({ show, close, muiDialogProps }: BuckGenericDialogProps) => {
    return (
        <Dialog open={show} onClose={close} {...muiDialogProps}>
            <Content close={close} />
        </Dialog>
    );
};
