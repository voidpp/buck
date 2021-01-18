import * as React from "react";
import {useState} from "react";
import {gql, useQuery} from "@apollo/client";
import {Dialog, DialogContent, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, TextField} from "@material-ui/core";
import {FormattedMessage} from "../../translations";
import {SoundSelectorQuery} from "./__generated__/SoundSelectorQuery";
import {useBoolState} from "../../../hooks";
import {FormattedDialogTitle} from "../../widgets/dialogs";
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import {If} from "../../tools";
import CloseIcon from '@material-ui/icons/Close';

const soundSelectorQuery = gql`
    query SoundSelectorQuery {
        sounds {
            title
            fileName
        }
    }
`;

type Props = {
    value: string,
    onChange: (val: string) => void,
    style?: React.CSSProperties,
}

export default ({value, onChange, style}: Props) => {
    const {data} = useQuery<SoundSelectorQuery>(soundSelectorQuery);
    const [isShow, show, hide] = useBoolState();
    const [audioFile, setAudioFile] = useState<string>();

    const options = data?.sounds ?? [];

    const valueTitle = options.filter(op => op.fileName == value)[0]?.title ?? "";

    return (
        <React.Fragment>
            <If condition={audioFile}>
                <audio src={`/static/audio/${audioFile}`} autoPlay loop/>
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
                                key={option.fileName}
                                button
                                selected={value === option.fileName}
                                onClick={() => {
                                    onChange(option.fileName);
                                    hide();
                                }}
                            >
                                <ListItemText style={{paddingRight: "0.5em"}}>
                                    {option.title}
                                </ListItemText>
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        onClick={() => setAudioFile(audioFile ? null : option.fileName)}
                                        disabled={audioFile && audioFile != option.fileName}
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
