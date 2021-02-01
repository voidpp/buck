import * as React from "react";
import {useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    createStyles,
    Dialog,
    DialogContent,
    IconButton,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Theme,
    Typography
} from "@material-ui/core";
import {FormattedDialogTitle} from "../../../widgets/dialogs";
import {useGroupedPredefinedTimerList} from "../hooks";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {FormattedTableCell} from "../../../translations";
import DeleteButton from "./DeleteButton";
import {useBoolState} from "../../../../hooks";
import AddBoxIcon from '@material-ui/icons/AddBox';
import UpdateButton from "./UpdateButton";
import SavePredefinedTimerDialog from "../SavePredefinedTimerDialog";
import {DialogProps} from "../types";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            flexBasis: '33.33%',
            flexShrink: 0,
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
    }),
);

const Content = ({close}: { close: () => void }) => {
    const {timers, refetch} = useGroupedPredefinedTimerList();
    const [showGrpId, setShowGrpId] = useState<number>();
    const [isShowCreateTimerDialog, showCreateTimerDialog, hideCreateTimerDialog] = useBoolState();
    const classes = useStyles();

    const openGroup = (grpId: number) => (ev, isExpanded: boolean) => {
        setShowGrpId(isExpanded ? grpId : null);
    }

    return (
        <React.Fragment>
            <SavePredefinedTimerDialog
                show={isShowCreateTimerDialog}
                close={hideCreateTimerDialog}
                onSuccess={() => refetch()}
            />
            <FormattedDialogTitle msgId="predefinedTimers" onCloseIconClick={close} style={{paddingBottom: 0}}>
                <IconButton onClick={showCreateTimerDialog} style={{marginLeft: '0.1em'}}>
                    <AddBoxIcon/>
                </IconButton>
            </FormattedDialogTitle>
            <DialogContent>
                {timers.map(grp => (
                    <Accordion
                        expanded={showGrpId == (grp.group.id)}
                        key={grp.group.id}
                        onChange={openGroup(grp.group.id)}
                        elevation={5}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography className={classes.heading}>{grp.group.name}</Typography>
                            <Typography className={classes.heading}>
                                <FormattedMessage id="timersCount" values={{cnt: grp.predefinedTimers.length}}/>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <FormattedTableCell msgId="name"/>
                                        <FormattedTableCell msgId="lengthHeader"/>
                                        <TableCell/>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {grp.predefinedTimers.map(t => (
                                        <TableRow key={t.id}>
                                            <TableCell>{t.name}</TableCell>
                                            <TableCell>{t.length}</TableCell>
                                            <TableCell>
                                                <UpdateButton timer={t} onSuccess={() => refetch()}/>
                                                <DeleteButton timer={t} onSuccess={() => refetch()}/>
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
}

export default ({show, close}: DialogProps) => {
    return (
        <Dialog open={show} onClose={close}>
            <Content close={close}/>
        </Dialog>
    );
}
