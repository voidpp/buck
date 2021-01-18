import * as React from "react";
import {useState} from "react";
import {Dialog, DialogContent} from "@material-ui/core";
import {FormattedDialogTitle} from "../../../widgets/dialogs";
import {gql, useMutation} from "@apollo/client";
import {StartTimerMutation, StartTimerMutationVariables} from "./__generated__/StartTimerMutation";
import {FormattedMessage} from "../../../translations";
import {ErrorList} from "../../../forms";
import {FormErrorHelper} from "../../../../forms/formErrorHelper";
import PredefinedTimers from "./PredefinedTimers";
import DialogActionButtons from "../../../DialogActionButtons";
import TextFieldDialog from "../../../keyboard/TextFieldDialog";
import {TimerPageDialogProps} from "../types";
import SoundSelector from "../SoundSelector";

const startTimerMutation = gql`
    mutation StartTimerMutation($name: String, $length: String!, $predefinedTimerId: Int, $soundFile: String!) {
        startTimer(name: $name length: $length predefinedTimerId: $predefinedTimerId soundFile: $soundFile) {
            id
            errors {
                path
                type
                context
            }
        }
    }
`;


const defaultFormData: StartTimerMutationVariables = {
    length: '10m',
    name: "",
    soundFile: "",
}

const fieldSpacing = "0.5em";

export default ({show, close}: TimerPageDialogProps) => {

    const [formData, setFormData] = useState<StartTimerMutationVariables>(defaultFormData);
    const [startTimer] = useMutation<StartTimerMutation, StartTimerMutationVariables>(startTimerMutation);
    const errors = new FormErrorHelper<StartTimerMutationVariables>();


    const submit = async () => {
        const result = await startTimer({variables: formData});
        errors.setErrors(result.data.startTimer.errors);
        if (result.data.startTimer.id)
            close();
    }

    const resetForm = () => {
        setFormData(defaultFormData);
        errors.resetErrors();
    }

    const onSelectPredefinedTimer = (length: string, name: string, id: number, soundFile: string) => {
        setFormData({length, name, predefinedTimerId: id, soundFile});
    }

    console.debug(formData);

    return (
        <Dialog open={show} onClose={close} onExited={resetForm}>
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

