import * as React from "react";
import Clock from "../../widgets/Clock";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";
import TimerPage from "./TimerPage";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: "flex",
    } as CreateCSSProperties,
}));



export default () => {
    const classes = useStyles();

    const onClick = () => {
        console.debug("ddd");
    }

    return (
        <div className={classes.root} style={{width: 800, height: 480}}>
            {/*<Clock onClick={onClick} />*/}
            <TimerPage />
        </div>
    );
}
