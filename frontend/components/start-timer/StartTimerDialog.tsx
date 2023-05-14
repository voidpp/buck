import { StartTimerMutationVariables, useStartTimerMutation } from "@/graphql-types-and-hooks";
import { DialogProps } from "@/types";
import { Dialog, DialogContent, useMediaQuery } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { FormErrorHelper } from "../../forms/formErrorHelper";
import SoundSelector from "../SoundSelector";
import { FormattedDialogTitle } from "../dialogs";
import { ErrorList } from "../forms";
import { TextField } from "../virtual-keyboard/TextField";
import { DialogActionButtons } from "../widgets";
import PredefinedTimers from "./PredefinedTimers";

const defaultFormData: StartTimerMutationVariables = {
    length: "10m",
    name: "",
    soundFile: "that-was-quick-606.mp3", // TODO: fix this shit
};

const fieldSpacing = "0.5em";

export const StartTimerDialog = ({ show, close, onDone }: DialogProps) => {
    const [formData, setFormData] = useState<StartTimerMutationVariables>(defaultFormData);
    const [startTimer] = useStartTimerMutation();
    const errors = new FormErrorHelper<StartTimerMutationVariables>();
    const isTall = useMediaQuery("(min-height: 600px)");

    const submit = async () => {
        const result = await startTimer({ variables: formData });
        errors.setErrors(result.data.startTimer.errors);
        if (result.data.startTimer.id) {
            close();
            onDone();
        }
    };

    const resetForm = () => {
        setFormData(defaultFormData);
        errors.resetErrors();
    };

    const onSelectPredefinedTimer = (length: string, name: string, id: number, soundFile: string) => {
        setFormData({ length, name, predefinedTimerId: id, soundFile });
    };

    return (
        <Dialog open={show} onClose={close} TransitionProps={{ onExited: resetForm }}>
            <FormattedDialogTitle msgId="startTimer" onCloseIconClick={close}>
                <PredefinedTimers onSelect={onSelectPredefinedTimer} style={{ marginLeft: "1em" }} />
            </FormattedDialogTitle>
            <DialogContent sx={{ "& > div": { marginTop: isTall ? "1em" : "0.5em" } }}>
                <TextField
                    label={<FormattedMessage id="length" />}
                    fullWidth
                    required
                    helperText={<ErrorList errors={errors.getErrors("length")} />}
                    error={errors.hasError("length")}
                    value={formData.length}
                    onChange={ev => setFormData({ ...formData, length: ev.target.value })}
                />
                <SoundSelector
                    value={formData.soundFile}
                    onChange={val => setFormData({ ...formData, soundFile: val })}
                />
                <TextField
                    label={<FormattedMessage id="name" />}
                    fullWidth
                    helperText={<ErrorList errors={errors.getErrors("name")} />}
                    error={errors.hasError("name")}
                    value={formData.name}
                    onChange={ev => setFormData({ ...formData, name: ev.target.value })}
                />
            </DialogContent>
            <DialogActionButtons onSubmit={submit} onCancel={close} />
        </Dialog>
    );
};
