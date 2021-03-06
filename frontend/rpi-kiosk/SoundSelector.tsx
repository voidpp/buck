import * as React from "react";
import {useState} from "react";
import {Dialog, DialogContent, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, TextField} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import {useBoolState} from "../hooks";
import {FormattedDialogTitle} from "./dialogs";
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import {Audio, If} from "./widgets";
import CloseIcon from '@material-ui/icons/Close';
import {useConfig} from "../contexts/config";


type Props = {
    value: string,
    onChange: (val: string) => void,
    style?: React.CSSProperties,
}

export default ({value, onChange, style}: Props) => {
    const config = useConfig();
    const [isShow, show, hide] = useBoolState();
    const [audioFile, setAudioFile] = useState<string>();

    const options = config.sounds;

    const valueTitle = options.filter(op => op.filename == value)[0]?.title ?? "";

    return (
        <React.Fragment>
            <If condition={audioFile}>
                <Audio src={`/static/audio/${audioFile}`}/>
            </If>
            <div style={{display: "flex", width: "100%", alignItems: "flex-end", ...style}}>
                <TextField
                    style={{flexGrow: 1}}
                    label={<FormattedMessage id="alarmSoundFile"/>}
                    fullWidth
                    value={valueTitle}
                    InputProps={{
                        readOnly: true,
                    }}
                    disabled={options.length == 0}
                    onClick={show}
                />
                <IconButton
                    size="small"
                    disabled={!value}
                    onClick={() => {
                        onChange("");
                        setAudioFile(null);
                    }}
                >
                    <CloseIcon fontSize="small"/>
                </IconButton>
                <IconButton
                    size="small"
                    disabled={!value}
                    onClick={() => setAudioFile(audioFile ? null : value)}
                >
                    <VolumeUpIcon fontSize="small"/>
                </IconButton>
            </div>
            <Dialog open={isShow && options.length > 0} onClose={hide}>
                <FormattedDialogTitle msgId="soundSelectorTitle"/>
                <DialogContent>
                    <List dense>
                        {options.map(option => (
                            <ListItem
                                key={option.filename}
                                button
                                selected={value === option.filename}
                                onClick={() => {
                                    onChange(option.filename);
                                    hide();
                                }}
                            >
                                <ListItemText style={{paddingRight: "0.5em"}}>
                                    {option.title}
                                </ListItemText>
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        onClick={() => setAudioFile(audioFile ? null : option.filename)}
                                        disabled={audioFile && audioFile != option.filename}
                                    >
                                        <VolumeUpIcon fontSize="small"/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
