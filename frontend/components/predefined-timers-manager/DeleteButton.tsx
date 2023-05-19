import { PredefinedTimer, useDeleteTimerMutation } from "@/graphql-types-and-hooks";
import * as React from "react";
import ConfirmDeleteButton from "../ConfirmDeleteButton";

export default ({ timer, onSuccess }: { timer: PredefinedTimer; onSuccess: () => void }) => {
    const [deleteTimer] = useDeleteTimerMutation();

    const confirm = async () => {
        await deleteTimer({ variables: { id: timer.id } });
        onSuccess();
    };

    return (
        <ConfirmDeleteButton onConfirm={confirm} messageId="deletePredefinedTimer" messageVars={{ name: timer.name }} />
    );
};
