import * as React from "react";
import {Dialog, DialogContent, IconButton} from "@material-ui/core";
import {gql, useMutation, useSubscription} from "@apollo/client";
import {TimerOperation, TimerState} from "../../../__generated__/globalTypes";
import StopIcon from '@material-ui/icons/Stop';
import PauseIcon from '@material-ui/icons/Pause';
import {TimerOperationMutation, TimerOperationMutationVariables} from "./__generated__/TimerOperationMutation";
import {If} from "../../tools";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import {RunningTimersSubscription} from "./__generated__/RunningTimersSubscription";

const timerEventsSubscription = gql`
    subscription TimerEventsSubscription {
        timerEvents {
            id
            time
            type
            timer {
                id
                length
                name
            }
        }
    }
`;

const Timedelta = ({value}: { value: number }) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value - (hours * 3600)) / 60);
    const seconds = value % 60;

    return (
        <span>{hours ? `${hours}:` : ''}{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
    );
}

const now = (): number => Math.round((new Date().getTime() / 1000));

type RunningTimer = {
    id: number,
    name: string,
    state: TimerState,
    elapsedTime: number,
    lengths: number[],
    remainingTimes: number[],
    endTimes?: number[],
}

const timerOperationMutation = gql`
    mutation TimerOperationMutation($id: Int! $operation: TimerOperation!) {
        operateTimer(id: $id operation: $operation) {
            errors {
                type
            }
        }
    }
`;


const Countdown = ({timer}: { timer: RunningTimer }) => {

    const [operateTimer] = useMutation<TimerOperationMutation, TimerOperationMutationVariables>(timerOperationMutation);

    return (
        <div>
            <div>
                {timer.name}
                <IconButton onClick={() => operateTimer({variables: {id: timer.id, operation: TimerOperation.STOP}})}>
                    <StopIcon/>
                </IconButton>
                <If condition={timer.state == "STARTED"}>
                    <IconButton onClick={() => operateTimer({variables: {id: timer.id, operation: TimerOperation.PAUSE}})}>
                        <PauseIcon/>
                    </IconButton>
                </If>
                <If condition={timer.state == "PAUSED"}>
                    <IconButton onClick={() => operateTimer({variables: {id: timer.id, operation: TimerOperation.UNPAUSE}})}>
                        <PlayArrowIcon/>
                    </IconButton>
                </If>
            </div>
            {timer.remainingTimes.map((time, idx) => (
                <div key={idx}>
                    <Timedelta value={time}/>
                </div>
            ))}
        </div>
    );
}

const runningTimersSubscription = gql`
    subscription RunningTimersSubscription {
        runningTimers {
            id
            name
            state
            elapsedTime
            lengths
            remainingTimes
        }
    }
`;

export default () => {
    const {data} = useSubscription<RunningTimersSubscription>(runningTimersSubscription);

    const runningTimers = data?.runningTimers ?? [];

    const isOpen = runningTimers.length > 0;
    console.debug("running timers:", runningTimers.length);

    return (
        <Dialog open={isOpen} fullScreen>
            <DialogContent>
                {runningTimers.map(timer => <Countdown key={timer.id} timer={timer}/>)}
            </DialogContent>
        </Dialog>
    );
}
