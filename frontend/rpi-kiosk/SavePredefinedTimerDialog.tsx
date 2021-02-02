import * as React from "react";
import {useState} from "react";
import {Dialog, DialogContent} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import {FormattedDialogTitle} from "./dialogs";
import {gql, useMutation} from "@apollo/client";
import {FormErrorHelper} from "../forms/formErrorHelper";
import {ErrorList} from "./forms";
import TextFieldDialog from "./virtual-keyboard/TextFieldDialog";
import GroupSelectInput from "./GroupSelectInput";

import {DialogProps} from "./types";
import SoundSelector from "./SoundSelector";
import {SavePredefinedTimerMutation, SavePredefinedTimerMutationVariables} from "./__generated__/SavePredefinedTimerMutation";
import {DialogActionButtons} from "./widgets";

const saveTimerMutation = gql`
    mutation SavePredefinedTimerMutation($name: String!, $length: String!, $groupName: String, $id: Int, $soundFile: String) {
        savePredefinedTimer(name: $name length: $length groupName: $groupName id: $id soundFile: $soundFile) {
            id
            errors {
                context
                path
                type
            }
        }
    }
`;

const defaultFormData: SavePredefinedTimerMutationVariables = {
    name: "",
    length: "10m",
    groupName: "",
    soundFile: "",
};

type Props = {
    data?: SavePredefinedTimerMutationVariables,
    onSuccess?: () => void,
} & DialogProps;

const fieldSpacing = "0.4em";

export default ({show, close, data, onSuccess}: Props) => {

    const [formData, setFormData] = useState<SavePredefinedTimerMutationVariables>({...defaultFormData, ...data});
    const [createTimer] = useMutation<SavePredefinedTimerMutation, SavePredefinedTimerMutationVariables>(saveTimerMutation);

    const errors = new FormErrorHelper<SavePredefinedTimerMutationVariables>();

    const resetForm = () => {
        setFormData(defaultFormData);
        errors.resetErrors();
    }

    const submit = async () => {
        const result = await createTimer({variables: formData});
        errors.setErrors(result.data.savePredefinedTimer.errors);
        if (result.data.savePredefinedTimer.id) {
            close();
            if (onSuccess)
                onSuccess();
        }
    }

    return (
        <Dialog open={show} onClose={close} onExited={resetForm}>
            <FormattedDialogTitle msgId={data ? "updateTimer" : "createTimer"} onCloseIconClick={close}/>
            <DialogContent>
                <TextFieldDialog
                    label={<FormattedMessage id="name"/>}
                    fullWidth
                    required
                    helperText={<ErrorList errors={errors.getErrors("name")}/>}
                    error={errors.hasError("name")}
                    value={formData.name}
                    onChange={ev => setFormData({...formData, name: ev.target.value})}
                    style={{marginBottom: fieldSpacing}}
                />
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
                    style={{marginBottom: fieldSpacing}}
                />
                <GroupSelectInput
                    value={formData.groupName}
                    onChange={groupName => setFormData({...formData, groupName})}
                />
            </DialogContent>
            <DialogActionButtons onSubmit={submit} onCancel={close}/>
        </Dialog>
    );
}

