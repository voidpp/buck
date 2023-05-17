import { DialogActionButtons } from "@/components/widgets";
import { SavePredefinedTimerMutationVariables, useSavePredefinedTimerMutation } from "@/graphql-types-and-hooks";
import { BuckGenericDialogProps } from "@/types";
import { Dialog, DialogContent, useMediaQuery } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { FormErrorHelper } from "../forms/formErrorHelper";
import { GroupSelectInput } from "./GroupSelectInput";
import SoundSelector from "./SoundSelector";
import { TextField } from "./TextField";
import { FormattedDialogTitle } from "./dialogs";
import { ErrorList } from "./forms";

const defaultFormData: SavePredefinedTimerMutationVariables = {
    name: "",
    length: "10m",
    groupName: "",
    soundFile: "",
};

type Props = {
    data?: SavePredefinedTimerMutationVariables;
    onSuccess?: () => void;
} & BuckGenericDialogProps;

const fieldSpacing = "0.4em";

export default ({ show, close, data, onSuccess }: Props) => {
    const [formData, setFormData] = useState<SavePredefinedTimerMutationVariables>({ ...defaultFormData, ...data });
    const [createTimer] = useSavePredefinedTimerMutation();
    const isTall = useMediaQuery("(min-height: 600px)");

    const errors = new FormErrorHelper<SavePredefinedTimerMutationVariables>();

    const resetForm = () => {
        setFormData(defaultFormData);
        errors.resetErrors();
    };

    const submit = async () => {
        const result = await createTimer({ variables: formData });
        errors.setErrors(result.data.savePredefinedTimer.errors);
        if (result.data.savePredefinedTimer.id) {
            close();
            if (onSuccess) onSuccess();
        }
    };

    return (
        <Dialog open={show} onClose={close} TransitionProps={{ onExited: resetForm }}>
            <FormattedDialogTitle msgId={data ? "updateTimer" : "createTimer"} onCloseIconClick={close} />
            <DialogContent sx={{ "& > div": { marginTop: isTall ? "1em" : "0.5em" } }}>
                <TextField
                    label={<FormattedMessage id="name" />}
                    fullWidth
                    required
                    helperText={<ErrorList errors={errors.getErrors("name")} />}
                    error={errors.hasError("name")}
                    value={formData.name}
                    onChange={ev => setFormData({ ...formData, name: ev.target.value })}
                    style={{ marginBottom: fieldSpacing }}
                />
                <TextField
                    label={<FormattedMessage id="length" />}
                    fullWidth
                    required
                    helperText={<ErrorList errors={errors.getErrors("length")} />}
                    error={errors.hasError("length")}
                    value={formData.length}
                    onChange={ev => setFormData({ ...formData, length: ev.target.value })}
                    style={{ marginBottom: fieldSpacing }}
                />
                <SoundSelector
                    value={formData.soundFile}
                    onChange={val => setFormData({ ...formData, soundFile: val })}
                    style={{ marginBottom: fieldSpacing }}
                />
                <GroupSelectInput
                    value={formData.groupName}
                    onChange={groupName => setFormData({ ...formData, groupName })}
                />
            </DialogContent>
            <DialogActionButtons onSubmit={submit} onCancel={close} />
        </Dialog>
    );
};
