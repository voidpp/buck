import * as React from "react";
import {useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";
import {Icon, IconProps, Tab, Tabs} from "@material-ui/core";
import Clock from "../../widgets/Clock";
import TimerDashboard from "./TimerDashboard";
import ActiveTimerDialog from "./ActiveTimerDialog";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import TimerIcon from '@material-ui/icons/Timer';
import DashboardIcon from '@material-ui/icons/Dashboard';
import {FormattedMessage} from "../../translations";
import {TranslationKey} from "../../../translations";
import ActiveAlarmPage from "./ActiveAlarmPage";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: "flex",
        // transform: "scaleX(0.95)",
        '& *': {
            cursor: "none",
        }
    } as CreateCSSProperties,
}));

const TabPanel = ({children, value, index}: { children: React.ReactNode, value: number, index: number }) => {
    return (
        <div
            hidden={value !== index}
            style={{height: "100%", flexGrow: 1}}
        >
            {children}
        </div>
    );
}

function createTab(icon: React.Factory<IconProps>, labelId: TranslationKey) {
    const margin = "0.5em";
    const iconProps: IconProps = {
        style: {
            marginTop: margin,
        },
        fontSize: "large",
    }

    const Icon = icon;

    const label = (
        <div style={{marginBottom: margin}}><FormattedMessage id={labelId} /></div>
    );

    return (
        <Tab icon={<Icon {...iconProps} />} label={label}/>
    )
}

export default () => {
    const classes = useStyles();
    const [value, setValue] = useState(0);

    return (
        <div className={classes.root} style={{width: 800, height: 480}}>
            <Tabs
                orientation="vertical"
                value={value}
                indicatorColor="primary"
                onChange={(event, newValue) => setValue(newValue)}
                style={{borderRight: "1px solid rgba(255,255,255,0.2)"}}
            >
                {createTab(AccessTimeIcon, "clock")}
                {createTab(TimerIcon, "timer")}
                {/*{createTab(DashboardIcon, "dashboard")}*/}
            </Tabs>
            <TabPanel value={value} index={0}>
                <Clock/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <TimerDashboard/>
                <ActiveTimerDialog/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                dashboard
            </TabPanel>
            <ActiveAlarmPage />
        </div>
    );
}
