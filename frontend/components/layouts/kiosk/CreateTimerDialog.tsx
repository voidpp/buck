import * as React from "react";
import {useState} from "react";
import {Dialog, DialogActions, DialogContent} from "@material-ui/core";
import {FormattedButton, FormattedMessage} from "../../translations";
import {FormattedDialogTitle} from "../../widgets/dialogs";
import {gql, useMutation} from "@apollo/client";
import {CreateTimerMutation, CreateTimerMutationVariables} from "./__generated__/CreateTimerMutation";
import {FormErrorHelper} from "../../../forms/formErrorHelper";
import {ErrorList} from "../../forms";
import TextFieldDialog from "../../keyboard/TextFieldDialog";
import GroupSelectInput from "./GroupSelectInput";
import DialogActionButtons from "../../DialogActionButtons";

const createTimerMutation = gql`
    mutation CreateTimerMutation($name: String!, $length: String!, $groupName: String) {
        predefineTimer(name: $name length: $length groupName: $groupName) {
            id
            errors {
                path
                type
                context
            }
        }
    }
`;

const defaultFormData: CreateTimerMutationVariables = {
    name: "",
    length: "10m",
    groupName: "",
};

type Props = {
    show: boolean,
    close: () => void,
    defaultData?: Partial<CreateTimerMutationVariables>,
    onTimerCreated?: () => void,
}

export default ({show, close, defaultData = defaultFormData, onTimerCreated}: Props) => {

    const [formData, setFormData] = useState<CreateTimerMutationVariables>({...defaultFormData, ...defaultData});
    const [createTimer] = useMutation<CreateTimerMutation, CreateTimerMutationVariables>(createTimerMutation);

    const errors = new FormErrorHelper<CreateTimerMutationVariables>();

    const resetForm = () => {
        setFormData(defaultFormData);
        errors.resetErrors();
    }

    const submit = async () => {
        const result = await createTimer({variables: formData});
        errors.setErrors(result.data.predefineTimer.errors);
        if (result.data.predefineTimer.id) {
            close();
            if (onTimerCreated)
                onTimerCreated();
        }
    }

    return (
        <Dialog open={show} onClose={close} onExited={resetForm}>
            <FormattedDialogTitle msgId="createTimer" onCloseIconClick={close}/>
            <DialogContent>
                <TextFieldDialog
                    label={<FormattedMessage id="name"/>}
                    fullWidth
                    required
                    helperText={<ErrorList errors={errors.getErrors("name")}/>}
                    error={errors.hasError("name")}
                    value={formData.name}
                    onChange={ev => setFormData({...formData, name: ev.target.value})}
                    style={{marginBottom: '0.7em'}}
                />
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
                <GroupSelectInput
                    value={formData.groupName}
                    onChange={groupName => setFormData({...formData, groupName})}
                />
            </DialogContent>
            <DialogActionButtons onSubmit={submit} onCancel={close} />
        </Dialog>
    );
}

