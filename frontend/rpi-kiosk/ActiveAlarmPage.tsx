import { gql, useMutation, useSubscription } from "@apollo/client";
import { Box, Button, Dialog, SxProps } from "@mui/material";
import * as React from "react";
import { useState } from "react";

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { FormattedMessage } from "react-intl";
import { Audio, If, SlideUp } from "./widgets";

import { TimerEventType, TimerOperation } from "../__generated__/globalTypes";
import { useInterval } from "../hooks";
import { TimerEventsSubscription, TimerEventsSubscription_timerEvents } from "./__generated__/TimerEventsSubscription";
import { TimerOperationMutation, TimerOperationMutationVariables } from "./__generated__/TimerOperationMutation";
import { timerOperationMutation } from "./timerOperationMutation";

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
                soundFile
            }
        }
    }
`;

const styles = {
    content: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        flexDirection: "column",
    },
    button: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    description: {
        fontSize: "0.9em",
        opacity: 0.6,
        textTransform: "lowercase",
    },
} satisfies Record<string, SxProps>;

const Counter = ({style}: { style?: React.CSSProperties }) => {
    const [milliSeconds, setMilliSeconds] = useState(0);
    useInterval(() => setMilliSeconds(milliSeconds + 100), 100);

    const minutes = Math.floor(milliSeconds / 1000 / 60);
    const seconds = Math.floor((milliSeconds - (minutes * 60 * 1000)) / 1000);
    const ms = Math.floor((milliSeconds % 1000) / 100);

    return (
        <span style={style}>
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}.
            {ms.toString().padStart(1, "0")}
        </span>
    );
}

type ActiveAlarmProps = {
    event: TimerEventsSubscription_timerEvents,
    onStop: () => void,
}

const ActiveAlarm = ({event, onStop}: ActiveAlarmProps) => {

    if (!event)
        return null;

    return (
        <Box sx={styles.content}>
            <If condition={!!event.timer.soundFile}>
                <Audio src={`/static/audio/${event.timer.soundFile}`}/>
            </If>
            <Box style={{paddingBottom: "1em"}}>
                <FormattedMessage id="alarmCounterMsg"/>
                <Counter style={{marginLeft: "0.5em"}}/>
            </Box>
            <Button size="large" onClick={onStop} color="primary">
                <Box sx={styles.button}>
                    <HighlightOffIcon style={{fontSize: "8em"}}/>
                    <FormattedMessage id="stopAlarm"/>
                </Box>
            </Button>
            <Box sx={styles.description}>(
                <FormattedMessage id="name"/>: {event.timer.name || event.timer.length}
                , <FormattedMessage id="lengthHeader"/>: {event.timer.length})
            </Box>
        </Box>
    )
}

const exampleEvent: TimerEventsSubscription_timerEvents = {
    id: 1,
    type: TimerEventType.ALARM,
    time: "2021-01-15T22:40:32.863447",
    timer: {
        id: 1,
        length: "1s",
        name: "",
        soundFile: "",
        __typename: "Timer",
    },
    __typename: "TimerEvent",
};

export default () => {
    const [activeEvent, setActiveEvent] = useState<TimerEventsSubscription_timerEvents>();
    const [operateTimer] = useMutation<TimerOperationMutation, TimerOperationMutationVariables>(timerOperationMutation);

    useSubscription<TimerEventsSubscription>(timerEventsSubscription, {
        onSubscriptionData: options => {
            for (const event of options.subscriptionData.data.timerEvents) {
                switch (event.type) {
                    case "ALARM":
                        setActiveEvent(event);
                        break;
                    case "CLEAR_ALARM":
                        setActiveEvent(null);
                        break;
                }
                return
            }
        }
    });

    return (
        <Dialog open={!!activeEvent} fullScreen TransitionComponent={SlideUp}>
            <ActiveAlarm
                event={activeEvent}
                onStop={() => {
                    operateTimer({variables: {id: activeEvent.timer.id, operation: TimerOperation.CLEAR_ALARM}})
                    setActiveEvent(null);
                }}
            />
        </Dialog>
    );
}
