import * as React from "react";

import { useGroupListQuery } from "@/graphql-types-and-hooks";
import { useBoolState } from "@/hooks";
import { Dialog, DialogContent, List, ListItem } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { FormattedDialogTitle } from "../../components/dialogs";
import { TextField } from "../../components/virtual-keyboard/TextField";
import { FormattedButton } from "../../translations";

type Props = {
    value: string;
    onChange: (val: string) => void;
};

export default ({ value, onChange }: Props) => {
    const [isShowDialog, showDialog, hideDialog] = useBoolState();
    const { data } = useGroupListQuery({ fetchPolicy: "cache-and-network" });

    const groups = data?.groups ?? [];

    return (
        <div style={{ display: "flex" }}>
            <TextField
                label={<FormattedMessage id="group" />}
                value={value}
                onChange={ev => onChange(ev.target.value)}
                fullWidth
                style={{ marginRight: 10 }}
            />
            <FormattedButton
                msgId="selectGroup"
                variant="contained"
                size="small"
                style={{ whiteSpace: "nowrap", minWidth: "auto" }}
                onClick={showDialog}
                disabled={groups.length === 0}
            />
            <Dialog open={isShowDialog} onClose={hideDialog}>
                <FormattedDialogTitle msgId="selectGroup" onCloseIconClick={hideDialog} />
                <DialogContent>
                    <List>
                        {groups.map(grp => (
                            <ListItem
                                key={grp.id}
                                button
                                onClick={() => {
                                    onChange(grp.name);
                                    hideDialog();
                                }}
                            >
                                {grp.name}
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </div>
    );
};
