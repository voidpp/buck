import {
    useGetBrightnessLazyQuery,
    useSetAutoBacklightEnabledMutation,
    useSetBrightnessMutation,
} from "@/graphql-types-and-hooks";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import BrightnessLowIcon from "@mui/icons-material/BrightnessLow";
import { Box, IconButton, Slider } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import { commonStyles } from "./styles";

const minValue = 5;

export default () => {
    const [brightness, setBrightness] = useState(0);
    const [isAutoEnabled, setAutoEnabled] = useState(false);
    const [getBrightnessQueryLazy] = useGetBrightnessLazyQuery();
    const [setBrightnessMutation] = useSetBrightnessMutation();
    const [setAutoBacklightEnabledMutation] = useSetAutoBacklightEnabledMutation();

    useEffect(() => {
        getBrightnessQueryLazy().then(res => {
            setBrightness(res.data.brightness);
            setAutoEnabled(res.data.settings.isAutoBacklightEnabled);
        });
    }, []);

    const updateBrightness = (val: number) => {
        setBrightness(val);
        setBrightnessMutation({ variables: { brightness: val } });
    };

    const toggleAutoEnabled = () => {
        const newVal = !isAutoEnabled;
        setAutoEnabled(newVal);
        setAutoBacklightEnabledMutation({ variables: { isAutoEnabled: newVal } });
    };

    return (
        <Box sx={commonStyles.slider}>
            <IconButton color={isAutoEnabled ? "primary" : "default"} onClick={toggleAutoEnabled}>
                <BrightnessAutoIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={() => updateBrightness(minValue)} disabled={isAutoEnabled}>
                <BrightnessLowIcon fontSize="small" />
            </IconButton>
            <Slider
                value={brightness}
                onChange={(ev, val) => updateBrightness(val as number)}
                min={minValue}
                disabled={isAutoEnabled}
            />
            <IconButton onClick={() => updateBrightness(100)} disabled={isAutoEnabled}>
                <Brightness7Icon fontSize="small" />
            </IconButton>
        </Box>
    );
};
