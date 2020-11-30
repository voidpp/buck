import * as React from "react";
import {useState} from "react";
import {Dialog, DialogContent} from "@material-ui/core";
import {FormattedMessage} from "../../translations";
import {FormattedDialogTitle} from "../../widgets/dialogs";
import {gql, useMutation} from "@apollo/client";
import {FormErrorHelper} from "../../../forms/formErrorHelper";
import {ErrorList} from "../../forms";
import TextFieldDialog from "../../keyboard/TextFieldDialog";
import GroupSelectInput from "./GroupSelectInput";
import DialogActionButtons from "../../DialogActionButtons";
import {SavePredefinedTimerMutation, SavePredefinedTimerMutationVariables} from "./__generated__/SavePredefinedTimerMutation";
import {TimerPageDialogProps} from "./types";

const saveTimerMutation = gql`
    mutation SavePredefinedTimerMutation($name: String!, $length: String!, $groupName: String, $id: Int) {
        savePredefinedTimer(name: $name length: $length groupName: $groupName id: $id) {
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
};

type Props = {
    data?: SavePredefinedTimerMutationVariables,
    onSuccess?: () => void,
} & TimerPageDialogProps;

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
            <DialogActionButtons onSubmit={submit} onCancel={close}/>
        </Dialog>
    );
}

