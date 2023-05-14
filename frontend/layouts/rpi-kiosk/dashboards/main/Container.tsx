import { ClockWidget } from "@/components/Clock";
import { Box, SxProps } from "@mui/material";
import * as React from "react";
import CurrentWeather from "./CurrentWeather";
import QuickStartTimer from "./QuickStartTimer";

const styles = {
    container: {
        height: "100%",
        position: "relative",
    },
} satisfies Record<string, SxProps>;

export default () => {
    return (
        <Box sx={styles.container}>
            <CurrentWeather style={{ top: "1em", right: "1em", position: "absolute" }} />
            <ClockWidget style={{ fontSize: "6em", right: 20, bottom: -30, position: "absolute" }} />
            <QuickStartTimer style={{ left: 5, bottom: 5, position: "absolute" }} />
        </Box>
    );
};
