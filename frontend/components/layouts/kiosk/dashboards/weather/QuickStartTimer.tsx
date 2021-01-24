import * as React from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
import {QuickTimerList, QuickTimerList_predefinedTimers} from "./__generated__/QuickTimerList";
import {Dialog, DialogContent, Divider, IconButton, List, ListItem} from "@material-ui/core";
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import {useBoolState} from "../../../../../hooks";
import {FormattedDialogTitle} from "../../../../widgets/dialogs";
import {StartTimerMutation, StartTimerMutationVariables} from "../../__generated__/StartTimerMutation";
import {startTimerMutation} from "../../queries";

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

const Content = ({onDone}: {onDone: () => void}) => {
    const {data} = useQuery<QuickTimerList>(quickTimerListQuery, {fetchPolicy: "cache-and-network"});
    const [startTimer] = useMutation<StartTimerMutation, StartTimerMutationVariables>(startTimerMutation);

    if (!data)
        return null;

    const createStartTimer = (timer: QuickTimerList_predefinedTimers) => async () => {
        const res = await startTimer({variables: {
            soundFile: timer.soundFile,
            length: timer.length,
            predefinedTimerId: timer.id,
            name: timer.name,
        }});
        if (res.data.startTimer.errors)
            alert("wut? (TODO)");
        else
            onDone();
    }

    return (
        <List>
            {data.predefinedTimers.slice(0, 8).map(timer => (
                <ListItem button dense key={timer.id} onClick={createStartTimer(timer)}>
                    {timer.group ? (timer.group.name + " / ") : ""}{timer.name} ({timer.length})
                </ListItem>
            ))}
        </List>
    );
}

export default ({style, className}: { style?: React.CSSProperties, className?: string }) => {
    const [isShow, show, hide] = useBoolState();

    return (
        <div style={style} className={className}>
            <IconButton onClick={show}>
                <AlarmAddIcon />
            </IconButton>
            <Dialog open={isShow} onClose={hide}>
                <FormattedDialogTitle msgId="quickStartTitle" style={{paddingBottom: "0.4em"}} />
                <Divider />
                <DialogContent>
                    <Content onDone={hide} />
                </DialogContent>
            </Dialog>
        </div>
    );
};
