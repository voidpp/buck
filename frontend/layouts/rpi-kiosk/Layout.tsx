import { useBoolState } from "@/hooks";
import { buckLocalStorage } from "@/tools";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CheckIcon from "@mui/icons-material/Check";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import {
    Box,
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
    SxProps,
} from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import ActiveAlarmPage from "./ActiveAlarmPage";
import ActiveTimerDialog from "./ActiveTimerDialog";
import DialogList from "./DialogList";
import { ClockPanel } from "./dashboards/Clock";
import MainDashboard from "./dashboards/main/Container";

const styles = {
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
} satisfies Record<string, SxProps>;

type DashboardDescriptor = {
    name: string;
    component: () => JSX.Element;
};

const dashboards: DashboardDescriptor[] = [
    {
        name: "main",
        component: MainDashboard,
    },
    {
        name: "clock",
        component: ClockPanel,
    },
];

export const RPiKioskLayout = () => {
    const [selectedDashboard, setSelectedDashboard] = useState(buckLocalStorage.selectedDashboard);
    const [isShowDrawer, showDrawer, hideDrawer] = useBoolState();
    const [dashboardMenuAnchorEl, setDashboardMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const closeDashboardMenu = () => {
        setDashboardMenuAnchorEl(null);
    };

    return (
        <Box sx={styles.root}>
            <Drawer anchor="left" open={isShowDrawer} onClose={hideDrawer}>
                <List>
                    <ListItem button onClick={ev => setDashboardMenuAnchorEl(ev.currentTarget)}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary={<FormattedMessage id="dashboards" />} />
                        <ListItemSecondaryAction style={{ display: "flex" }}>
                            <ArrowRightIcon />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
                <Divider />
                <DialogList onDone={hideDrawer} />
            </Drawer>
            <Menu
                anchorEl={dashboardMenuAnchorEl}
                open={!!dashboardMenuAnchorEl}
                onClose={closeDashboardMenu}
                anchorOrigin={{
                    horizontal: "right",
                    vertical: "top",
                }}
                TransitionProps={{ onExited: hideDrawer }}
            >
                {dashboards.map((desc, idx) => (
                    <MenuItem
                        onClick={() => {
                            closeDashboardMenu();
                            setSelectedDashboard(idx);
                            buckLocalStorage.selectedDashboard = idx;
                        }}
                        key={desc.name}
                    >
                        <ListItemIcon>
                            <CheckIcon style={{ opacity: selectedDashboard == idx ? 1 : 0 }} />
                        </ListItemIcon>
                        <ListItemText style={{ paddingRight: "1em" }}>
                            <FormattedMessage id={desc.name} />
                        </ListItemText>
                    </MenuItem>
                ))}
            </Menu>
            <Box sx={styles.main}>
                <ActiveTimerDialog />
                <ActiveAlarmPage />
                {dashboards.map((desc, idx) => {
                    if (idx !== selectedDashboard) return null;
                    const Component = desc.component;
                    return (
                        <Box sx={styles.dashboardContainer} key={desc.name}>
                            <Component />
                        </Box>
                    );
                })}
            </Box>
            <Box sx={styles.menu}>
                <IconButton onClick={showDrawer}>
                    <MenuIcon />
                </IconButton>
            </Box>
        </Box>
    );
};
