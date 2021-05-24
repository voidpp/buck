import * as React from "react";
import {gql, useMutation, useQuery} from "@apollo/client";

import {Dialog, DialogContent, Divider, IconButton, List, ListItem} from "@material-ui/core";
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import {useBoolState} from "../../../hooks";

import {startTimerMutation} from "../../queries";
import {QuickTimerList, QuickTimerList_predefinedTimers} from "./__generated__/QuickTimerList";
import {StartTimerMutation, StartTimerMutationVariables} from "../../__generated__/StartTimerMutation";
import {makeStyles} from "@material-ui/core/styles";
import {FormattedMessage} from "react-intl";
import StartTimerDialog from "../../start-timer/StartTimerDialog";
import PlayCircleFilledWhiteIcon from "@material-ui/icons/PlayCircleFilledWhite";

const quickTimerListQuery = gql`
    query QuickTimerList {
        predefinedTimers(sortBy: LAST_USED) {
            name
            length
            id
            soundFile
            group {
                name
            }
        }
    }
`;

const useContentStyles = makeStyles({
    list: {
        fontSize: "1.1em",
        paddingBottom: 9,
        paddingTop: 9,
    }
});

const Content = ({onDone}: { onDone: () => void }) => {
    const {data} = useQuery<QuickTimerList>(quickTimerListQuery, {fetchPolicy: "cache-and-network"});
    const [startTimer] = useMutation<StartTimerMutation, StartTimerMutationVariables>(startTimerMutation);
    const classes = useContentStyles();

    if (!data)
        return null;

    const createStartTimer = (timer: QuickTimerList_predefinedTimers) => async () => {
        const res = await startTimer({
            variables: {
                soundFile: timer.soundFile,
                length: timer.length,
                predefinedTimerId: timer.id,
                name: (timer.group ? timer.group.name + " / " : "") + timer.name,
            }
        });
        if (res.data.startTimer.errors)
            alert("wut? (TODO)");
        else
            onDone();
    }

    return (
        <List>
            {data.predefinedTimers.slice(0, 6).map(timer => (
                <ListItem button key={timer.id} onClick={createStartTimer(timer)} className={classes.list}>
                    {timer.group ? (timer.group.name + " / ") : ""}{timer.name} ({timer.length})
                </ListItem>
            ))}
        </List>
    );
}

const StartTimerDialogButton = () => {
    const [isShow, show, hide] = useBoolState();

    return (
        <>
            <IconButton onClick={show} size="small">
                <PlayCircleFilledWhiteIcon/>
            </IconButton>
            <StartTimerDialog show={isShow} close={hide}/>
        </>
    )
};

const useStyles = makeStyles({
    title: {
        padding: "8px 39px",
        fontSize: "1.2em",
        display: "flex",
        alignItems: "center",
    }
});

export default ({style, className}: { style?: React.CSSProperties, className?: string }) => {
    const [isShow, show, hide] = useBoolState();
    const classes = useStyles();

    return (
        <div style={style} className={className}>
            <IconButton onClick={show}>
                <AlarmAddIcon fontSize="large"/>
            </IconButton>
            <Dialog open={isShow} onClose={hide}>
                <div className={classes.title}>
                    <span style={{flexGrow: 1}}>
                        <FormattedMessage id="quickStartTitle"/>
                    </span>
                    <StartTimerDialogButton/>
                </div>
                <Divider/>
                <DialogContent>
                    <Content onDone={hide}/>
                </DialogContent>
            </Dialog>
        </div>
    );
};
