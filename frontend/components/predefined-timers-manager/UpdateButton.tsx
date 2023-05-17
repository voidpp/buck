import { PredefinedTimer } from "@/graphql-types-and-hooks";
import { useBoolState } from "@/hooks";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import * as React from "react";
import SavePredefinedTimerDialog from "../SavePredefinedTimerDialog";

export default ({ timer, onSuccess }: { timer: PredefinedTimer; onSuccess: () => void }) => {
    const [isOpen, open, close] = useBoolState();

    return (
        <React.Fragment>
            <IconButton size="small" style={{ marginRight: 10 }} onClick={open}>
                <EditIcon fontSize="small" />
            </IconButton>
            <SavePredefinedTimerDialog
                show={isOpen}
                close={close}
                data={{ ...timer, groupName: timer.group?.name ?? "" }}
                onSuccess={onSuccess}
            />
        </React.Fragment>
    );
};
