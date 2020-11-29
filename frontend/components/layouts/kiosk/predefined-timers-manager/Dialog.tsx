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
import EditIcon from '@material-ui/icons/Edit';
import {FormattedButton, FormattedMessage, FormattedTableCell} from "../../../translations";
import DeleteButton from "./DeleteButton";
import CreateTimerDialog from "../CreateTimerDialog";
import {useBoolState} from "../../../../hooks";

type Props = {
    show: boolean,
    close: () => void,
}

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

const Content = () => {
    const {timers, refetch} = useGroupedPredefinedTimerList();
    const [showGrpId, setShowGrpId] = useState<number>();
    const [isShowCreateTimerDialog, showCreateTimerDialog, hideCreateTimerDialog] = useBoolState();
    const classes = useStyles();

    const openGroup = (grpId: number) => (ev, isExpanded: boolean) => {
        setShowGrpId(isExpanded ? grpId : null);
    }

    return (
        <DialogContent>
            <CreateTimerDialog show={isShowCreateTimerDialog} close={hideCreateTimerDialog}/>
            <FormattedButton
                onClick={showCreateTimerDialog}
                msgId="createTimer"
                style={{marginBottom: '0.3em'}}
                variant="contained"
                size="small"
            />
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
                                            <IconButton size="small" style={{marginRight: 10}}>
                                                <EditIcon fontSize="small"/>
                                            </IconButton>
                                            <DeleteButton timer={t} onDeleteSuccess={refetch}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AccordionDetails>
                </Accordion>
            ))}
        </DialogContent>
    );
}

export default ({show, close}: Props) => {
    return (
        <Dialog open={show} onClose={close}>
            <FormattedDialogTitle msgId="predefinedTimers" onCloseIconClick={close}/>
            <Content/>
        </Dialog>
    );
}
