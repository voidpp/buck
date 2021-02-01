import * as React from "react";
import {DialogProps} from "../types";
import {Dialog, DialogContent, Divider} from "@material-ui/core";
import {FormattedButton} from "../../../translations";
import {FormattedDialogTitle} from "../../../widgets/dialogs";
import Brightness from "./Brightness";
import Volume from "./Volume";
import DebugInfoDialog from "./DebugInfoDialog";
import {FormattedMessage} from "react-intl";

const FormRow = ({labelId, children}: { labelId: string, children: React.ReactNode }) => (
    <tr>
        <td style={{textAlign: "right"}}>
            <FormattedMessage id={labelId}/>:
        </td>
        <td style={{paddingLeft: "0.5em"}}>
            {children}
        </td>
    </tr>
)

const Version = () => {
    return <span>v{window.bundleVersion}</span>;
}

export default ({show, close, onDone}: DialogProps) => {
    return (
        <Dialog open={show} onClose={close}>
            <FormattedDialogTitle msgId="settings" onCloseIconClick={close} style={{padding: "0.5em 1em"}}>
                <DebugInfoDialog buttonStyle={{marginLeft: "0.5em"}}/>
            </FormattedDialogTitle>
            <Divider/>
            <DialogContent style={{padding: "1em"}}>
                <table>
                    <tbody>
                    <FormRow labelId="version">
                        <Version/>
                        <FormattedButton
                            msgId="reload"
                            onClick={() => window.location.reload()}
                            size="small"
                            variant="contained"
                            style={{fontSize: "0.7em", marginLeft: "0.5em"}}
                        />
                    </FormRow>
                    <FormRow labelId="volume">
                        <Volume/>
                    </FormRow>
                    <FormRow labelId="brightness">
                        <Brightness/>
                    </FormRow>
                    </tbody>
                </table>
            </DialogContent>
        </Dialog>
    );
};
