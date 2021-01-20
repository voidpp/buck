import * as React from "react";
import {DialogProps} from "../types";
import {Dialog, DialogContent, Divider} from "@material-ui/core";
import {FormattedButton, FormattedMessage} from "../../../translations";
import {FormattedDialogTitle} from "../../../widgets/dialogs";
import {TranslationKey} from "../../../../translations";
import Brightness from "./Brightness";
import Volume from "./Volume";

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
