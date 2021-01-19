import * as React from "react";
import {useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";
import {
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Menu,
    MenuItem
} from "@material-ui/core";
import {ClockPanel} from "./dashboards/Clock";
import ActiveTimerDialog from "./ActiveTimerDialog";
import {FormattedMessage} from "../../translations";
import {TranslationKey} from "../../../translations";
import ActiveAlarmPage from "./ActiveAlarmPage";
import {buckLocalStorage} from "../../../tools";
import CaludeDashboard from "./dashboards/weather/Container";
import {useBoolState} from "../../../hooks";
import MenuIcon from '@material-ui/icons/Menu';
import DialogList from "./DialogList";
import DashboardIcon from '@material-ui/icons/Dashboard';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import CheckIcon from '@material-ui/icons/Check';

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
    dashboardContainer: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
    } as CreateCSSProperties,
}));

type DashboardDescriptor = {
    name: TranslationKey,
    component: () => JSX.Element,
}

const dashboards: DashboardDescriptor[] = [{
    name: "clock",
    component: ClockPanel,
}, {
    name: "misc",
    component: CaludeDashboard,
}];

export default () => {
    const classes = useStyles();
    const [selectedKioskTab, setSelectedKioskTab] = useState(buckLocalStorage.selectedKioskTab);
    const [isShowDrawer, showDrawer, hideDrawer] = useBoolState();
    const [dashboardMenuAnchorEl, setDashboardMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const closeDashboardMenu = () => {
        setDashboardMenuAnchorEl(null);
    }

    return (
        <div className={classes.root}>
            <Drawer anchor="left" open={isShowDrawer} onClose={hideDrawer}>
                <List>
                    <ListItem button onClick={ev => setDashboardMenuAnchorEl(ev.currentTarget)}>
                        <ListItemIcon>
                            <DashboardIcon/>
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="dashboards"/>}/>
                        <ListItemSecondaryAction style={{display: "flex"}}>
                            <ArrowRightIcon/>
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
                <Divider/>
                <DialogList onDone={hideDrawer}/>
            </Drawer>
            <Menu
                anchorEl={dashboardMenuAnchorEl}
                open={!!dashboardMenuAnchorEl}
                onClose={closeDashboardMenu}
                anchorOrigin={{
                    horizontal: "right",
                    vertical: "top",
                }}
                onExited={hideDrawer}
            >
                {dashboards.map((desc, idx) => (
                    <MenuItem onClick={() => {
                        closeDashboardMenu();
                        setSelectedKioskTab(idx);
                        buckLocalStorage.selectedKioskTab = idx;
                    }} key={desc.name}>
                        <ListItemIcon>
                            <CheckIcon style={{opacity: selectedKioskTab == idx ? 1 : 0}}/>
                        </ListItemIcon>
                        <ListItemText style={{paddingRight: "1em"}}>
                            <FormattedMessage id={desc.name}/>
                        </ListItemText>
                    </MenuItem>
                ))}
            </Menu>
            <div className={classes.panels}>
                <ActiveTimerDialog/>
                <ActiveAlarmPage/>
                {dashboards.map((desc, idx) => {
                    if (idx !== selectedKioskTab)
                        return null;
                    const Component = desc.component;
                    return (
                        <div
                            className={classes.dashboardContainer}
                            key={desc.name}>
                            <Component/>
                        </div>
                    );
                })}
            </div>
            <div className={classes.menu}>
                <IconButton onClick={showDrawer}>
                    <MenuIcon/>
                </IconButton>
            </div>
        </div>
    );
}
