import { Box, Button, Dialog, SxProps } from "@mui/material";
import * as React from "react";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { FormattedMessage } from "react-intl";
import { Audio, Counter, If, SlideUp } from "../../components/widgets";

import { TimerEventType, TimerOperation, useTimerOperationMutation } from "@/graphql-types-and-hooks";
import { useActiveTimerEvent } from "@/hooks";
import { TimerEvent } from "../../graphql-types-and-hooks";

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
        alignItems: "center",
    },
    description: {
        fontSize: "0.9em",
        opacity: 0.6,
        textTransform: "lowercase",
    },
} satisfies Record<string, SxProps>;

type ActiveAlarmProps = {
    event: TimerEvent;
    onStop: () => void;
};

const ActiveAlarm = ({ event, onStop }: ActiveAlarmProps) => {
    if (!event) return null;

    return (
        <Box sx={styles.content}>
            <If condition={!!event.timer.soundFile}>
                <Audio src={`/static/audio/${event.timer.soundFile}`} />
            </If>
            <Box style={{ paddingBottom: "1em" }}>
                <FormattedMessage id="alarmCounterMsg" />
                <Counter sx={{ marginLeft: "0.5em" }} />
            </Box>
            <Button size="large" onClick={onStop} color="primary">
                <Box sx={styles.button}>
                    <HighlightOffIcon style={{ fontSize: "8em" }} />
                    <FormattedMessage id="stopAlarm" />
                </Box>
            </Button>
            <Box sx={styles.description}>
                (
                <FormattedMessage id="name" />: {event.timer.name || event.timer.length}
                , <FormattedMessage id="lengthHeader" />: {event.timer.length})
            </Box>
        </Box>
    );
};

const exampleEvent: TimerEvent = {
    id: 1,
    type: TimerEventType.Alarm,
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
    const [operateTimer] = useTimerOperationMutation();
    const { activeEvent, clearEvent } = useActiveTimerEvent();

    return (
        <Dialog open={!!activeEvent} fullScreen TransitionComponent={SlideUp}>
            <ActiveAlarm
                event={activeEvent}
                onStop={() => {
                    operateTimer({ variables: { id: activeEvent.timer.id, operation: TimerOperation.ClearAlarm } });
                    clearEvent();
                }}
            />
        </Dialog>
    );
};
