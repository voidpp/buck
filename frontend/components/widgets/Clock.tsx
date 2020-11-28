import * as React from "react";
import {useInterval} from "../../hooks";
import dayjs from 'dayjs';
import {useEffect, useRef, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
    } as CreateCSSProperties,
}));


const now = () => dayjs(new Date()).format('HH:mm');

export default ({onClick}: {onClick?: () => void}) => {
    const classes = useStyles();
    const [time, setTime] = useState<string>(now());
    const containerRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState(10);

    useInterval(() => {
        setTime(now());
    }, 1000);

    useEffect(() => {
        setFontSize(containerRef.current.offsetHeight * 0.6);
    }, []);

    return (
        <div className={classes.root} ref={containerRef} style={{fontSize}} onClick={onClick}>
            {time}
        </div>
    );
}
