import { useBoolState, useGroupedPredefinedTimerList } from "@/hooks";
import { FormattedButton } from "@/translations";
import { Dialog, DialogContent, List, ListItem, ListItemText, ListSubheader } from "@mui/material";
import * as React from "react";

type Props = {
    onSelect: (length: string, name: string, id: number, soundFile: string) => void;
    style?: React.CSSProperties;
};

export default ({ onSelect, style }: Props) => {
    const [isShowDialog, showDialog, hideDialog] = useBoolState();

    const { timers } = useGroupedPredefinedTimerList();

    return (
        <React.Fragment>
            <FormattedButton
                onClick={showDialog}
                msgId="predefinedTimersSelect"
                variant="contained"
                size="small"
                disabled={timers.length == 0}
                style={style}
            />
            <Dialog open={isShowDialog} onClose={hideDialog}>
                <DialogContent>
                    {timers.map(grp => (
                        <List
                            key={grp.group?.id ?? 0}
                            subheader={<ListSubheader disableSticky={true}>{grp.group?.name ?? "empty"}</ListSubheader>}
                        >
                            {grp.predefinedTimers.map(t => (
                                <ListItem
                                    button
                                    key={t.id}
                                    onClick={() => {
                                        onSelect(
                                            t.length,
                                            (grp.group ? grp.group.name + " / " : "") + t.name,
                                            t.id,
                                            t.soundFile
                                        );
                                        hideDialog();
                                    }}
                                >
                                    <ListItemText>
                                        {t.name} ({t.length})
                                    </ListItemText>
                                </ListItem>
                            ))}
                        </List>
                    ))}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};
