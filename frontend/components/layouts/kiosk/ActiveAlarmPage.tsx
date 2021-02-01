import * as React from "react";
import {useState} from "react";
import {gql, useSubscription} from "@apollo/client";
import {Button, Dialog} from "@material-ui/core";
import {TimerEventsSubscription, TimerEventsSubscription_timerEvents} from "./__generated__/TimerEventsSubscription";
import {If, SlideUp} from "../../tools";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";
import {FormattedMessage} from "react-intl";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {TimerEventType} from "../../../__generated__/globalTypes";
import {useInterval} from "../../../hooks";
import Audio from "./Audio";

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

const useStyles = makeStyles((theme: Theme) => createStyles({
    content: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        flexDirection: "column",
    } as CreateCSSProperties,
    button: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    } as CreateCSSProperties,
    description: {
        fontSize: "0.9em",
        opacity: 0.6,
        textTransform: "lowercase",
    } as CreateCSSProperties,
}));

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
    const classes = useStyles();

    if (!event)
        return null;

    return (
        <div className={classes.content}>
            <If condition={!!event.timer.soundFile}>
                <Audio src={`/static/audio/${event.timer.soundFile}`}/>
            </If>
            <div style={{paddingBottom: "1em"}}>
                <FormattedMessage id="alarmCounterMsg"/>
                <Counter style={{marginLeft: "0.5em"}}/>
            </div>
            <Button size="large" onClick={onStop} color="primary">
                <div className={classes.button}>
                    <HighlightOffIcon style={{fontSize: "4em"}}/>
                    <FormattedMessage id="stopAlarm"/>
                </div>
            </Button>
            <div className={classes.description}>(
                <FormattedMessage id="name"/>: {event.timer.name || event.timer.length}
                , <FormattedMessage id="lengthHeader"/>: {event.timer.length})
            </div>
        </div>
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

    useSubscription<TimerEventsSubscription>(timerEventsSubscription, {
        onSubscriptionData: options => {
            for (const event of options.subscriptionData.data.timerEvents) {
                if (event.type !== "ALARM")
                    continue
                setActiveEvent(event);
                return;
            }
        }
    });

    return (
        <Dialog open={!!activeEvent} fullScreen TransitionComponent={SlideUp}>
            <ActiveAlarm
                event={activeEvent}
                onStop={() => setActiveEvent(null)}
            />
        </Dialog>
    );
}
