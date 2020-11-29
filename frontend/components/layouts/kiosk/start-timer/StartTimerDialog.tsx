import * as React from "react";
import {useState} from "react";
import {Dialog, DialogActions, DialogContent, TextField} from "@material-ui/core";
import {FormattedDialogTitle} from "../../../widgets/dialogs";
import {gql, useMutation} from "@apollo/client";
import {StartTimerMutation, StartTimerMutationVariables} from "./__generated__/StartTimerMutation";
import {FormattedButton, FormattedMessage} from "../../../translations";
import {ErrorList} from "../../../forms";
import {FormErrorHelper} from "../../../../forms/formErrorHelper";
import PredefinedTimers from "./PredefinedTimers";
import DialogActionButtons from "../../../DialogActionButtons";
import TextFieldDialog from "../../../keyboard/TextFieldDialog";

const startTimerMutation = gql`
    mutation StartTimerMutation($name: String, $length: String!, $predefinedTimerId: Int) {
        startTimer(name: $name length: $length predefinedTimerId: $predefinedTimerId) {
            id
            errors {
                path
                type
                context
            }
        }
    }
`;


type Props = {
    show: boolean,
    close: () => void,
};

const defaultFormData: StartTimerMutationVariables = {
    length: '10m',
    name: "",
}

export default ({show, close}: Props) => {

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

    const onSelectPredefinedTimer = (length: string, name: string, id: number) => {
        setFormData({length, name, predefinedTimerId: id});
    }

    return (
        <Dialog open={show} onClose={close} onExited={resetForm}>
            <FormattedDialogTitle msgId="startTimer" onCloseIconClick={close}/>
            <DialogContent>
                <TextFieldDialog
                    label={<FormattedMessage id="length"/>}
                    fullWidth
                    required
                    helperText={<ErrorList errors={errors.getErrors("length")}/>}
                    error={errors.hasError("length")}
                    value={formData.length}
                    onChange={ev => setFormData({...formData, length: ev.target.value})}
                    style={{marginBottom: '0.7em'}}
                />
                <TextFieldDialog
                    label={<FormattedMessage id="name"/>}
                    fullWidth
                    helperText={<ErrorList errors={errors.getErrors("name")}/>}
                    error={errors.hasError("name")}
                    value={formData.name}
                    onChange={ev => setFormData({...formData, name: ev.target.value})}
                    style={{marginBottom: '0.7em'}}
                />
                <PredefinedTimers onSelect={onSelectPredefinedTimer}/>
            </DialogContent>
            <DialogActionButtons onSubmit={submit} onCancel={close} />
        </Dialog>
    );
}

