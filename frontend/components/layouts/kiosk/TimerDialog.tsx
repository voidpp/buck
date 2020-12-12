import * as React from "react";
import {useState} from "react";
import {Dialog, DialogContent, IconButton} from "@material-ui/core";
import {gql, useMutation, useQuery, useSubscription} from "@apollo/client";
import {RunningTimersQuery, RunningTimersQuery_runningTimers} from "./__generated__/RunningTimersQuery";
import {useInterval} from "../../../hooks";
import {TimerOperation, TimerState} from "../../../__generated__/globalTypes";
import {TimerEventsSubscription} from "./__generated__/TimerEventsSubscription";
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

const runningTimersQuery = gql`
    query RunningTimersQuery {
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

    // const [remainingTimes, setRemainingTimes] = useState<number[]>(timer.remainingTimes);

    const [operateTimer] = useMutation<TimerOperationMutation, TimerOperationMutationVariables>(timerOperationMutation);

    // useInterval(() => {
    //     if (timer.state == "PAUSED")
    //         return
    //
    //     const times = [];
    //     const now_ = now();
    //
    //     for (const endTime of timer.endTimes) {
    //         const time = endTime - now_;
    //         if (time >= 0)
    //             times.push(time);
    //     }
    //     setRemainingTimes(times);
    //
    // }, 1000);

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

// function calcEndTimes(timers: RunningTimersQuery_runningTimers[]): RunningTimer[] {
//     const now_ = now();
//     const res: RunningTimer[] = [];
//
//     for (const timer of timers) {
//         const endTimes = [];
//         for (const length of timer.remainingTimes) {
//             endTimes.push(now_ + length);
//         }
//         res.push({...timer, endTimes});
//     }
//
//     return res;
// }

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
    // const [runningTimers, setRunningTimers] = useState<RunningTimer[]>([]);

    // const {refetch} = useQuery<RunningTimersQuery>(runningTimersQuery, {
    //     onCompleted: data => {
    //         console.debug("RunningTimersQuery arrived");
    //         setRunningTimers(calcEndTimes(data.runningTimers));
    //     },
    //     fetchPolicy: "cache-and-network",
    // });
    //
    // useSubscription<TimerEventsSubscription>(timerEventsSubscription, {
    //     onSubscriptionData: ({subscriptionData: {data: {timerEvents}}}) => {
    //         console.debug("TimerEventsSubscription onData");
    //         // refetch();
    //     }
    // });
    //
    // useSubscription<RunningTimersSubscription>(runningTimersSubscription, {
    //     onSubscriptionData: ({subscriptionData: {data}}) => {
    //         setRunningTimers(data.runningTimers);
    //     }
    // });

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
