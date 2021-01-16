import * as React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";
import {ClockWidget} from "../../../widgets/Clock";
import CurrentWeather from "./CurrentWeather";

const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
        padding: "1em",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
    } as CreateCSSProperties,
    clock: {
        fontSize: "6em",
        alignSelf: "flex-end",
        marginBottom: "-0.4em",
    } as CreateCSSProperties,
}));

export default () => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <CurrentWeather style={{alignSelf: "flex-end"}} />
            <ClockWidget className={classes.clock} />
        </div>
    )
}
