import { gql, useMutation, useQuery } from "@apollo/client";
import * as React from "react";
import { useState } from "react";

import AlarmAddIcon from '@mui/icons-material/AlarmAdd';
import { Box, Button, Dialog, DialogContent, Divider, IconButton, List, ListItem, SxProps } from "@mui/material";
import { useBoolState } from "../../../hooks";

import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import { FormattedMessage } from "react-intl";
import { StartTimerMutation, StartTimerMutationVariables } from "../../__generated__/StartTimerMutation";
import { startTimerMutation } from "../../queries";
import StartTimerDialog from "../../start-timer/StartTimerDialog";
import { Timedelta } from "../../widgets";
import { QuickTimerList, QuickTimerList_predefinedTimers } from "./__generated__/QuickTimerList";

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

const contentStyles = {
    list: {
        fontSize: "1.1em",
        paddingBottom: '9px',
        paddingTop: '9px',
    }
} satisfies Record<string, SxProps>;

const Content = ({onDone}: { onDone: () => void }) => {
    const {data} = useQuery<QuickTimerList>(quickTimerListQuery, {fetchPolicy: "cache-and-network"});
    const [startTimer] = useMutation<StartTimerMutation, StartTimerMutationVariables>(startTimerMutation);

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
                <ListItem button key={timer.id} onClick={createStartTimer(timer)} sx={contentStyles.list}>
                    {timer.group ? (timer.group.name + " / ") : ""}{timer.name} ({timer.length})
                </ListItem>
            ))}
        </List>
    );
}

const styles = {
    title: {
        padding: "8px 39px",
        fontSize: "1.2em",
        display: "flex",
        alignItems: "center",
    },
    pickerOption: {
        textTransform: "lowercase",
    },
    picker: {
        marginLeft: '15px',
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
    },
    optionsContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridGap: '10px',
        paddingBottom: '15px',
    },
} satisfies Record<string, SxProps>;

type Unit = "s" | "m" | "h";

const units: { [K in Unit]: number } = {
    s: 1,
    m: 60,
    h: 60 * 60,
};

type Option = { amount: number, unit: Unit };

const PickerOption = ({amount, unit, onSelect}: { onSelect: (value: number) => void } & Option) => {
    return (
        <Button
            onClick={e => onSelect(amount * units[unit])}
            sx={styles.pickerOption}
            variant="contained"
            size="large"
            fullWidth
            style={{
                padding: "12px 24px",
            }}
        >
            {amount}{unit}
        </Button>
    );
}

const options: Option[] = [
    {amount: 5, unit: "s"},
    {amount: 15, unit: "s"},
    {amount: 30, unit: "s"},
    {amount: 1, unit: "m"},
    {amount: 2, unit: "m"},
    {amount: 5, unit: "m"},
    {amount: 10, unit: "m"},
    {amount: 15, unit: "m"},
    {amount: 30, unit: "m"},
    {amount: 1, unit: "h"},
    {amount: 2, unit: "h"},
    {amount: 5, unit: "h"},
];

function timeToLength(value: number): string {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value - hours * 3600) / 60);
    const seconds = value - hours * 3600 - minutes * 60;

    let res = "";
    if (hours)
        res += hours + "h";
    if (minutes)
        res += minutes + "m";
    if (seconds)
        res += seconds + "s";
    return res;
}

const Picker = ({onDone}: { onDone: () => void }) => {
    const [value, setValue] = useState(0);
    const [startTimer] = useMutation<StartTimerMutation, StartTimerMutationVariables>(startTimerMutation);

    const start = async () => {
        const res = await startTimer({
            variables: {
                soundFile: "that-was-quick-606.mp3", // TODO: fix this shit
                length: timeToLength(value),
            }
        });
        if (res.data.startTimer.errors)
            alert("wut? (TODO)");
        else
            onDone();
    }

    return (
        <Box sx={styles.picker}>
            <Box sx={styles.optionsContainer}>
                {options.map(op =>
                    <PickerOption {...op} onSelect={val => setValue(value + val)} key={`${op.amount}${op.unit}`}/>
                )}
            </Box>
            <Box style={{fontSize: "1.5em"}}><Timedelta value={value}/></Box>
            <Box>
                <Button size="large" color="primary" onClick={start} disabled={!value}>start</Button>
                <Button size="large" color="secondary" onClick={e => setValue(0)}>clear</Button>
            </Box>
        </Box>
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

export default ({style, className}: { style?: React.CSSProperties, className?: string }) => {
    const [isShow, show, hide] = useBoolState();

    return (
        <Box style={style} className={className}>
            <IconButton onClick={show}>
                <AlarmAddIcon fontSize="large"/>
            </IconButton>
            <Dialog open={isShow} onClose={hide} maxWidth="md">
                <Box sx={styles.title}>
                    <span style={{flexGrow: 1}}>
                        <FormattedMessage id="quickStartTitle"/>
                    </span>
                    <StartTimerDialogButton/>
                </Box>
                <Divider/>
                <DialogContent style={{display: "flex"}}>
                    <Content onDone={hide}/>
                    <Box style={{borderRight: "1px solid grey"}}/>
                    <Picker onDone={hide}/>
                </DialogContent>
            </Dialog>
        </Box>
    );
};
