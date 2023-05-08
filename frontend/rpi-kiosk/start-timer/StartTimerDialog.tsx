import { useMutation } from "@apollo/client";
import { Dialog, DialogContent } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { FormErrorHelper } from "../../forms/formErrorHelper";
import SoundSelector from "../SoundSelector";
import { StartTimerMutation, StartTimerMutationVariables } from "../__generated__/StartTimerMutation";
import { FormattedDialogTitle } from "../dialogs";
import { ErrorList } from "../forms";
import { startTimerMutation } from "../queries";
import { DialogProps } from "../types";
import TextFieldDialog from "../virtual-keyboard/TextFieldDialog";
import { DialogActionButtons } from "../widgets";
import PredefinedTimers from "./PredefinedTimers";



const defaultFormData: StartTimerMutationVariables = {
    length: "10m",
    name: "",
    soundFile: "that-was-quick-606.mp3", // TODO: fix this shit
}

const fieldSpacing = "0.5em";

export default ({show, close, onDone}: DialogProps) => {

    const [formData, setFormData] = useState<StartTimerMutationVariables>(defaultFormData);
    const [startTimer] = useMutation<StartTimerMutation, StartTimerMutationVariables>(startTimerMutation);
    const errors = new FormErrorHelper<StartTimerMutationVariables>();


    const submit = async () => {
        const result = await startTimer({variables: formData});
        errors.setErrors(result.data.startTimer.errors);
        if (result.data.startTimer.id) {
            close();
            onDone();
        }
    }

    const resetForm = () => {
        setFormData(defaultFormData);
        errors.resetErrors();
    }

    const onSelectPredefinedTimer = (length: string, name: string, id: number, soundFile: string) => {
        setFormData({length, name, predefinedTimerId: id, soundFile});
    }

    return (
        <Dialog open={show} onClose={close} TransitionProps={{onExited: resetForm}} >
            <FormattedDialogTitle msgId="startTimer" onCloseIconClick={close}>
                <PredefinedTimers onSelect={onSelectPredefinedTimer} style={{marginLeft: "1em"}}/>
            </FormattedDialogTitle>
            <DialogContent>
                <TextFieldDialog
                    label={<FormattedMessage id="length"/>}
                    fullWidth
                    required
                    helperText={<ErrorList errors={errors.getErrors("length")}/>}
                    error={errors.hasError("length")}
                    value={formData.length}
                    onChange={ev => setFormData({...formData, length: ev.target.value})}
                    style={{marginBottom: fieldSpacing}}
                />
                <SoundSelector
                    value={formData.soundFile}
                    onChange={val => setFormData({...formData, soundFile: val})}
                />
                <TextFieldDialog
                    label={<FormattedMessage id="name"/>}
                    fullWidth
                    helperText={<ErrorList errors={errors.getErrors("name")}/>}
                    error={errors.hasError("name")}
                    value={formData.name}
                    onChange={ev => setFormData({...formData, name: ev.target.value})}
                    style={{marginBottom: fieldSpacing, marginTop: fieldSpacing}}
                />
            </DialogContent>
            <DialogActionButtons onSubmit={submit} onCancel={close}/>
        </Dialog>
    );
}

