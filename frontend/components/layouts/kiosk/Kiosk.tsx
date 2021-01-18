import * as React from "react";
import {useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";
import {Drawer, Icon, IconButton, IconProps, Tab, Tabs} from "@material-ui/core";
import {ClockPanel} from "../../widgets/Clock";
import TimerDashboard from "./TimerDashboard";
import ActiveTimerDialog from "./ActiveTimerDialog";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import TimerIcon from '@material-ui/icons/Timer';
import DashboardIcon from '@material-ui/icons/Dashboard';
import {FormattedMessage} from "../../translations";
import {TranslationKey} from "../../../translations";
import ActiveAlarmPage from "./ActiveAlarmPage";
import {buckLocalStorage} from "../../../tools";
import CaludeDashboard from "./calude-dashboard/Container";
import {If} from "../../tools";
import {useBoolState} from "../../../hooks";
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        // transform: "scaleX(0.95)",
        '& *': {
            cursor: "none",
        }
    } as CreateCSSProperties,
    panels: {
        display: "flex",
        width: 800,
        height: 480,
        overflow: "hidden",
    } as CreateCSSProperties,
    menu: {
        position: "fixed",
        top: 0,
        left: 0,
    } as CreateCSSProperties,
}));

const TabPanel = ({children, value, index}: { children: React.ReactNode, value: number, index: number }) => {
    const show = value === index;

    return (
        <div
            hidden={!show}
            style={{height: "100%", flexGrow: 1}}
        >
            {show ? children : null}
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
        <div style={{marginBottom: margin}}><FormattedMessage id={labelId}/></div>
    );

    return (
        <Tab icon={<Icon {...iconProps} />} label={label}/>
    )
}

export default () => {
    const classes = useStyles();
    const [value, setValue] = useState(buckLocalStorage.selectedKioskTab);
    const [isShow, show, hide] = useBoolState();

    return (
        <div className={classes.root}>
            <div className={classes.menu}>
                <IconButton onClick={show}>
                    <MenuIcon/>
                </IconButton>
            </div>
            <Drawer anchor="left" open={isShow} onClose={hide}>
                <Tabs
                    orientation="vertical"
                    value={value}
                    indicatorColor="primary"
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        buckLocalStorage.selectedKioskTab = newValue;
                    }}
                    style={{borderRight: "1px solid rgba(255,255,255,0.2)"}}
                >
                    {createTab(AccessTimeIcon, "clock")}
                    {createTab(TimerIcon, "timer")}
                    {window.claudeApiUrl ? createTab(DashboardIcon, "dashboard") : null}
                </Tabs>
            </Drawer>
            <div className={classes.panels}>
                <TabPanel value={value} index={0}>
                    <ClockPanel/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <TimerDashboard/>
                </TabPanel>
                <If condition={window.claudeApiUrl}>
                    <TabPanel value={value} index={2}>
                        <CaludeDashboard/>
                    </TabPanel>
                </If>
                <ActiveTimerDialog/>
                <ActiveAlarmPage/>
            </div>
        </div>
    );
}
