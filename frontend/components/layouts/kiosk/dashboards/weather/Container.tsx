import * as React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";
import {ClockWidget} from "../Clock";
import CurrentWeather from "./CurrentWeather";
import QuickStartTimer from "./QuickStartTimer";

const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
        height: "100%",
        position: "relative",
    } as CreateCSSProperties,
    clock: {} as CreateCSSProperties,
    widget: {
        position: "absolute",
    } as CreateCSSProperties,
}));

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
