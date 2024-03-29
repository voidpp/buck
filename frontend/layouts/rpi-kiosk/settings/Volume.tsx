import { buckLocalStorage } from "@/tools";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeUp from "@mui/icons-material/VolumeUp";
import { Box, IconButton, Slider } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { commonStyles } from "./styles";

export default () => {
    const [volume, setVolume] = useState(buckLocalStorage.volume);

    const updateValue = (val: number) => {
        setVolume(val);
        buckLocalStorage.volume = val;
    };

    return (
        <Box sx={commonStyles.slider}>
            <IconButton onClick={() => updateValue(0)}>
                <VolumeMuteIcon fontSize="small" />
            </IconButton>
            <Slider value={volume} onChange={(ev, val) => updateValue(val as number)} />
            <IconButton onClick={() => updateValue(100)}>
                <VolumeUp fontSize="small" />
            </IconButton>
        </Box>
    );
};
