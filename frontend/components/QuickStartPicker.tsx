import * as React from "react";
import { useState } from "react";

import { Box, Button, SxProps } from "@mui/material";
import { useStartTimerMutation } from "../graphql-types-and-hooks";
import { SoundSelector } from "./SoundSelector";
import { Timedelta } from "./widgets";

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
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
    },
    optionsContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridGap: "10px",
    },
} satisfies Record<string, SxProps>;

type Unit = "s" | "m" | "h";

const units: { [K in Unit]: number } = {
    s: 1,
    m: 60,
    h: 60 * 60,
};

type Option = { amount: number; unit: Unit };

const PickerOption = ({ amount, unit, onSelect }: { onSelect: (value: number) => void } & Option) => {
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
            {amount}
            {unit}
        </Button>
    );
};

const options: Option[] = [
    { amount: 5, unit: "s" },
    { amount: 15, unit: "s" },
    { amount: 30, unit: "s" },
    { amount: 1, unit: "m" },
    { amount: 2, unit: "m" },
    { amount: 5, unit: "m" },
    { amount: 10, unit: "m" },
    { amount: 15, unit: "m" },
    { amount: 30, unit: "m" },
    { amount: 1, unit: "h" },
    { amount: 2, unit: "h" },
    { amount: 5, unit: "h" },
];

function timeToLength(value: number): string {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value - hours * 3600) / 60);
    const seconds = value - hours * 3600 - minutes * 60;

    let res = "";
    if (hours) res += hours + "h";
    if (minutes) res += minutes + "m";
    if (seconds) res += seconds + "s";
    return res;
}

export const QuickStartPicker = ({ onDone, showSoundPicker }: { onDone: () => void; showSoundPicker?: boolean }) => {
    const [value, setValue] = useState(0);
    const [startTimer] = useStartTimerMutation();
    const [soundFile, setSoundFile] = useState("that-was-quick-606.mp3");

    const start = async () => {
        const res = await startTimer({
            variables: {
                soundFile,
                length: timeToLength(value),
            },
        });
        if (res.data.startTimer.errors) alert("wut? (TODO)");
        else onDone();
    };

    return (
        <Box sx={styles.picker}>
            {showSoundPicker && <SoundSelector value={soundFile} onChange={setSoundFile} sx={{ mb: 2 }} />}
            <Box sx={styles.optionsContainer}>
                {options.map(op => (
                    <PickerOption {...op} onSelect={val => setValue(value + val)} key={`${op.amount}${op.unit}`} />
                ))}
            </Box>
            <Box sx={{ display: "flex", mt: 2, justifyContent: "space-around", alignItems: "center", width: "100%" }}>
                <Box sx={{ fontSize: "1.5em" }}>
                    <Timedelta value={value} />
                </Box>
                <Box>
                    <Button size="large" color="primary" onClick={start} disabled={!value}>
                        start
                    </Button>
                    <Button size="large" color="secondary" onClick={e => setValue(0)}>
                        clear
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};