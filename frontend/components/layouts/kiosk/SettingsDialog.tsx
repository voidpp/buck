import * as React from "react";
import {useState} from "react";
import {DialogProps} from "./types";
import {Dialog, DialogContent, Divider, IconButton, Slider} from "@material-ui/core";
import {FormattedButton, FormattedMessage} from "../../translations";
import {FormattedDialogTitle} from "../../widgets/dialogs";
import {buckLocalStorage} from "../../../tools";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CreateCSSProperties} from "@material-ui/core/styles/withStyles";
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import {TranslationKey} from "../../../translations";

const useStyles = makeStyles((theme: Theme) => createStyles({
    volume: {
        display: "flex",
        alignItems: "center",
        minWidth: 300,
    } as CreateCSSProperties,
}));

const FormRow = ({labelId, children}: { labelId: TranslationKey, children: React.ReactNode }) => (
    <tr>
        <td style={{textAlign: "right"}}>
            <FormattedMessage id={labelId}/>:
        </td>
        <td style={{paddingLeft: "0.5em"}}>
            {children}
        </td>
    </tr>
)

export default ({show, close, onDone}: DialogProps) => {
    const [volume, setVolume] = useState(buckLocalStorage.volume);
    const classes = useStyles();

    const updateValue = (val: number) => {
        setVolume(val);
        buckLocalStorage.volume = val;
    }

    return (
        <Dialog open={show} onClose={close}>
            <FormattedDialogTitle msgId="settings" onCloseIconClick={close} style={{padding: "0.5em 1em"}}/>
            <Divider/>
            <DialogContent style={{paddingTop: "1em"}}>
                <table>
                    <tbody>
                    <FormRow labelId="appReload">
                        <FormattedButton
                            msgId="reload"
                            onClick={() => window.location.reload()}
                            size="small"
                            variant="contained"
                            style={{fontSize: "0.8em"}}
                        />
                    </FormRow>
                    <FormRow labelId="volume">
                        <div className={classes.volume}>
                            <IconButton onClick={() => updateValue(0)}>
                                <VolumeMuteIcon/>
                            </IconButton>
                            <Slider value={volume} onChange={(ev, val) => updateValue(val as number)}/>
                            <IconButton onClick={() => updateValue(100)}>
                                <VolumeUp/>
                            </IconButton>
                        </div>
                    </FormRow>
                    </tbody>
                </table>
            </DialogContent>
        </Dialog>
    );
};
