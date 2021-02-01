import * as React from "react";
import {useState} from "react";
import EqualizerIcon from '@material-ui/icons/Equalizer';
import {useBoolState} from "../../../../hooks";
import {Dialog, DialogContent, Divider, IconButton, Tab, Tabs, useTheme} from "@material-ui/core";
import {FormattedDialogTitle} from "../../../widgets/dialogs";
import System from "./debug-info-tabs/System";
import Celery from "./debug-info-tabs/Celery";
import {FormattedMessage} from "react-intl";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";
import Misc from "./debug-info-tabs/Misc";

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

const useStyles = makeStyles((theme: Theme) => createStyles({
    tabHeader: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    } as CreateCSSProperties,
}));

export default ({buttonStyle}: { buttonStyle?: React.CSSProperties }) => {
    const [isShow, show, hide] = useBoolState();
    const [tabIndex, setTabIndex] = useState(0);
    const classes = useStyles();

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
                        className={classes.tabHeader}
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
