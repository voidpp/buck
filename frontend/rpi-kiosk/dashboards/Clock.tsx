import { Box, SxProps } from "@mui/material";
import dayjs from 'dayjs';
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useInterval } from "../../hooks";

const now = () => {
    const time = dayjs(new Date());
    return {
        hours: time.format('HH'),
        minutes: time.format('mm'),
        seconds: time.second(),
    }
}

export const ClockWidget = ({style, className}: { style?: React.CSSProperties, className?: string }) => {
    const [time, setTime] = useState(now());

    useInterval(() => {
        setTime(now());
    }, 1000);

    const colonStyle = {
        opacity: time.seconds % 2 ? 0.3 : 1,
        transition: "opacity 1s",
    } as React.CSSProperties;

    return (
        <div style={{fontFamily: "Josefin Sans", ...style}} className={className}>
            {time.hours}
            <span style={colonStyle}>:</span>
            {time.minutes}
        </div>
    );
}

const styles = {
    root: {
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        paddingTop: ".15em",
    },
} satisfies Record<string, SxProps>;


export const ClockPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState(10);

    useEffect(() => {
        setFontSize(containerRef.current.offsetHeight * 0.48);
    }, []);

    return (
        <Box sx={styles.root} ref={containerRef} style={{fontSize}}>
            <ClockWidget/>
        </Box>
    );
}
