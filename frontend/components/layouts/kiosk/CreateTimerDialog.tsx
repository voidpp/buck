import * as React from "react";
import {useState} from "react";
import {Dialog, DialogActions, DialogContent, TextField} from "@material-ui/core";
import {FormattedButton, FormattedMessage} from "../../translations";
import {FormattedDialogTitle} from "../../widgets/dialogs";
import {gql, useMutation, useQuery} from "@apollo/client";
import {CreateTimerMutation, CreateTimerMutationVariables} from "./__generated__/CreateTimerMutation";
import {FormErrorHelper} from "../../../forms/formErrorHelper";
import {ErrorList} from "../../forms";
import {GroupList} from "./__generated__/GroupList";
import {Autocomplete} from "@material-ui/lab";
import TextFieldDialog from "../../keyboard/TextFieldDialog";

const createTimerMutation = gql`
    mutation CreateTimerMutation($name: String!, $length: Int!, $groupName: String) {
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

const groupListQuery = gql`
    query GroupList {
        groups {
            id
            name
        }
    }
`;

const defaultFormData: CreateTimerMutationVariables = {
    name: "",
    length: 30,
    groupName: null,
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
    const {data} = useQuery<GroupList>(groupListQuery);

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
                    onChange={ev => setFormData({...formData, length: Number(ev.target.value)})}
                />
                <Autocomplete
                    freeSolo={true}
                    options={data?.groups ? data.groups.map(g => g.name) : []}
                    renderInput={(params) => (
                        <TextField {...params} label={<FormattedMessage id="group"/>} margin="dense"/>
                    )}
                />
            </DialogContent>
            <DialogActions>
                <FormattedButton onClick={submit} msgId="submit"/>
                <FormattedButton onClick={close} msgId="cancel" color="secondary"/>
            </DialogActions>
        </Dialog>
    );
}

