import EqualizerIcon from '@mui/icons-material/Equalizer';
import { Dialog, DialogContent, Divider, IconButton, Tab, Tabs } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useBoolState } from "../../hooks";
import { FormattedDialogTitle } from "../dialogs";
import Celery from "./debug-info-tabs/Celery";
import Misc from "./debug-info-tabs/Misc";
import System from "./debug-info-tabs/System";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            hidden={value !== index}
            {...other}
        >
            {value == index ? children : null}
        </div>
    );
}

export default ({buttonStyle}: { buttonStyle?: React.CSSProperties }) => {
    const [isShow, show, hide] = useBoolState();
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <React.Fragment>
            <IconButton onClick={show} size="small" style={buttonStyle}>
                <EqualizerIcon fontSize="small"/>
            </IconButton>
            <Dialog open={isShow} onClose={hide}>
                <FormattedDialogTitle msgId="debugInfo" onCloseIconClick={hide} style={{padding: "0.5em 1em"}}/>
                <Divider/>
                <DialogContent>
                    <Tabs
                        value={tabIndex}
                        onChange={(ev, index) => setTabIndex(index)}
                        indicatorColor="primary"
                        sx={{borderBottom: theme => `1px solid ${theme.palette.divider}`}}
                    >
                        <Tab label={<FormattedMessage id="system"/>} style={{textTransform: "none"}}/>
                        <Tab label={<FormattedMessage id="celery"/>} style={{textTransform: "none"}}/>
                        <Tab label={<FormattedMessage id="misc"/>} style={{textTransform: "none"}}/>
                    </Tabs>
                    <TabPanel value={tabIndex} index={0}>
                        <System/>
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                        <Celery/>
                    </TabPanel>
                    <TabPanel value={tabIndex} index={2}>
                        <Misc/>
                    </TabPanel>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
