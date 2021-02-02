import * as React from "react";
import {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
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
    MenuItem,
} from "@material-ui/core";
import {ClockPanel} from "./dashboards/Clock";
import ActiveTimerDialog from "./ActiveTimerDialog";
import {FormattedMessage} from "react-intl";
import ActiveAlarmPage from "./ActiveAlarmPage";
import {kioskLocalStorage} from "./tools";
import CaludeDashboard from "./dashboards/weather/Container";
import {useBoolState} from "../hooks";
import MenuIcon from '@material-ui/icons/Menu';
import DialogList from "./DialogList";
import DashboardIcon from '@material-ui/icons/Dashboard';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles({
    root: {
        height: "100%",
    },
    main: {
        display: "flex",
        height: "100%",
        overflow: "hidden",
    },
    menu: {
        position: "fixed",
        top: 0,
        left: 0,
    },
    dashboardContainer: {
        width: "100%",
        height: "100%",
    },
});

type DashboardDescriptor = {
    name: string,
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
    const [selectedDashboard, setSelectedDashboard] = useState(kioskLocalStorage.selectedDashboard);
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
                        setSelectedDashboard(idx);
                        kioskLocalStorage.selectedDashboard = idx;
                    }} key={desc.name}>
                        <ListItemIcon>
                            <CheckIcon style={{opacity: selectedDashboard == idx ? 1 : 0}}/>
                        </ListItemIcon>
                        <ListItemText style={{paddingRight: "1em"}}>
                            <FormattedMessage id={desc.name}/>
                        </ListItemText>
                    </MenuItem>
                ))}
            </Menu>
            <div className={classes.main}>
                <ActiveTimerDialog/>
                <ActiveAlarmPage/>
                {dashboards.map((desc, idx) => {
                    if (idx !== selectedDashboard)
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
