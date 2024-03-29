import { useBoolState } from "@/hooks";
import CloseIcon from "@mui/icons-material/Close";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
    Dialog,
    DialogContent,
    IconButton,
    List,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    SxProps,
    TextField,
} from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useConfig } from "../contexts/config";
import { FormattedDialogTitle } from "./dialogs";
import { Audio, If } from "./widgets";

type Props = {
    value: string;
    onChange: (val: string) => void;
    sx?: SxProps;
};

export const SoundSelector = ({ value, onChange, sx }: Props) => {
    const config = useConfig();
    const [isShow, show, hide] = useBoolState();
    const [audioFile, setAudioFile] = useState<string>();

    const options = config.sounds;

    const valueTitle = options.filter(op => op.filename == value)[0]?.title ?? "";

    return (
        <React.Fragment>
            <If condition={audioFile}>
                <Audio src={`/static/audio/${audioFile}`} />
            </If>
            <TextField
                label={<FormattedMessage id="alarmSoundFile" />}
                fullWidth
                value={valueTitle}
                sx={sx}
                InputProps={{
                    readOnly: true,
                    inputProps: {
                        onClick: show,
                    },
                    endAdornment: (
                        <>
                            <IconButton
                                size="small"
                                disabled={!value}
                                onClick={() => {
                                    onChange("");
                                    setAudioFile(null);
                                }}
                                sx={{ p: 0 }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                disabled={!value}
                                onClick={() => setAudioFile(audioFile ? null : value)}
                                sx={{ p: 0, ml: 1 }}
                            >
                                <VolumeUpIcon fontSize="small" />
                            </IconButton>
                        </>
                    ),
                }}
            />
            <Dialog open={isShow && options.length > 0} onClose={hide}>
                <FormattedDialogTitle msgId="soundSelectorTitle" />
                <DialogContent>
                    <List dense>
                        {options.map(option => (
                            <ListItemButton
                                key={option.filename}
                                selected={value === option.filename}
                                onClick={() => {
                                    onChange(option.filename);
                                    hide();
                                }}
                            >
                                <ListItemText style={{ paddingRight: "1em" }}>{option.title}</ListItemText>
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        onClick={() => setAudioFile(audioFile ? null : option.filename)}
                                        disabled={audioFile && audioFile != option.filename}
                                    >
                                        <VolumeUpIcon fontSize="small" />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};
