import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {useInterval} from "../../../../hooks";
import dayjs from 'dayjs';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";

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
        transition: "opacity 0.3s",
    } as React.CSSProperties;

    return (
        <div style={{fontFamily: "Josefin Sans", ...style}} className={className}>
            {time.hours}
            <span style={colonStyle}>:</span>
            {time.minutes}
        </div>
    );
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        paddingTop: ".15em",
    } as CreateCSSProperties,
}));


export const ClockPanel = () => {
    const classes = useStyles();
    const containerRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState(10);

    useEffect(() => {
        setFontSize(containerRef.current.offsetHeight * 0.48);
    }, []);

    return (
        <div className={classes.root} ref={containerRef} style={{fontSize}}>
            <ClockWidget/>
        </div>
    );
}
