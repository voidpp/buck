import * as React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {ClockWidget} from "../Clock";
import CurrentWeather from "./CurrentWeather";
import QuickStartTimer from "./QuickStartTimer";

const useStyles = makeStyles({
    container: {
        height: "100%",
        position: "relative",
    },
    clock: {},
    widget: {
        position: "absolute",
    },
});

export default () => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <CurrentWeather style={{top: "1em", right: "1em", position: "absolute"}}/>
            <ClockWidget style={{fontSize: "6em", right: 20, bottom: -30, position: "absolute"}}/>
            <QuickStartTimer style={{left: 5, bottom: 5, position: "absolute"}}/>
        </div>
    )
}
