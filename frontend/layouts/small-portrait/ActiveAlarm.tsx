import { Audio, Counter, If, SlideUp } from "@/components/widgets";
import { TimerEvent, TimerEventType, TimerOperation, useTimerOperationMutation } from "@/graphql-types-and-hooks";
import { useActiveTimerEvent } from "@/hooks";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Box, Dialog, SxProps, Theme } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

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

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        flexDirection: "column",
    },
    icon: {
        fontSize: "12rem",
        lineHeight: "10rem",
    },
    description: {
        fontSize: "1.5rem",
        opacity: 0.6,
        textTransform: "lowercase",
        mt: 5,
    },
    counter: {
        fontSize: "1.5rem",
        opacity: 0.6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 5,
    },
} satisfies Record<string, SxProps<Theme>>;

const ActiveAlarm = ({ event, onStop }: { event: TimerEvent; onStop: () => void }) => {
    if (!event) return null;

    return (
        <Box sx={styles.container} onClick={onStop}>
            <If condition={!!event.timer.soundFile}>
                <Audio src={`/static/audio/${event.timer.soundFile}`} />
            </If>
            <Box sx={styles.counter}>
                <FormattedMessage id="alarmCounterMsg" />
                <Counter />
            </Box>
            <Box sx={styles.icon}>
                <NotificationsIcon
                    fontSize="inherit"
                    sx={{
                        animation: "ringing 2s .7s ease-in-out infinite",
                        transformOrigin: "50% 4px",
                    }}
                />
            </Box>
            <Box sx={styles.description}>
                (
                <FormattedMessage id="name" />: {event.timer.name || event.timer.length}
                , <FormattedMessage id="lengthHeader" />: {event.timer.length})
            </Box>
        </Box>
    );
};

export const ActiveAlarmDialog = () => {
    const [operateTimer] = useTimerOperationMutation();
    const { activeEvent, clearEvent } = useActiveTimerEvent();

    return (
        <Dialog fullScreen open={!!activeEvent} TransitionComponent={SlideUp}>
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
