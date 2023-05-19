import { useInterval } from "@/hooks";
import dayjs from "dayjs";
import * as React from "react";
import { useState } from "react";

const now = () => {
    const time = dayjs(new Date());
    return {
        hours: time.format("HH"),
        minutes: time.format("mm"),
        seconds: time.second(),
    };
};

export const ClockWidget = ({ style, className }: { style?: React.CSSProperties; className?: string }) => {
    const [time, setTime] = useState(now());

    useInterval(() => {
        setTime(now());
    }, 1000);

    const colonStyle = {
        opacity: time.seconds % 2 ? 0.3 : 1,
        transition: "opacity 1s",
    } as React.CSSProperties;

    return (
        <div style={{ fontFamily: "Josefin Sans", ...style }} className={className}>
            {time.hours}
            <span style={colonStyle}>:</span>
            {time.minutes}
        </div>
    );
};
