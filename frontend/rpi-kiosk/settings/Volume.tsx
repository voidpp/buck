import {IconButton, Slider} from "@material-ui/core";
import VolumeMuteIcon from "@material-ui/icons/VolumeMute";
import VolumeUp from "@material-ui/icons/VolumeUp";
import * as React from "react";
import {useState} from "react";
import {useCommonStyles} from "./styles";
import {kioskLocalStorage} from "../tools";

export default () => {
    const [volume, setVolume] = useState(kioskLocalStorage.volume);
    const classes = useCommonStyles();

    const updateValue = (val: number) => {
        setVolume(val);
        kioskLocalStorage.volume = val;
    }

    return (
        <div className={classes.slider}>
            <IconButton onClick={() => updateValue(0)}>
                <VolumeMuteIcon fontSize="small"/>
            </IconButton>
            <Slider value={volume} onChange={(ev, val) => updateValue(val as number)}/>
            <IconButton onClick={() => updateValue(100)}>
                <VolumeUp fontSize="small"/>
            </IconButton>
        </div>
    );
}
