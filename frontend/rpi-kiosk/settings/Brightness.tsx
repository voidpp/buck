import { gql, useApolloClient } from "@apollo/client";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import BrightnessLowIcon from "@mui/icons-material/BrightnessLow";
import { Box, IconButton, Slider } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import { GetBrightnessQuery } from "./__generated__/GetBrightnessQuery";
import { SetAutoBacklightEnabledMutation, SetAutoBacklightEnabledMutationVariables } from "./__generated__/SetAutoBacklightEnabledMutation";
import { SetBrightnessMutation, SetBrightnessMutationVariables } from "./__generated__/SetBrightnessMutation";
import { commonStyles } from "./styles";


const getBrightnessQuery = gql`
    query GetBrightnessQuery {
        brightness
        settings {
            isAutoBacklightEnabled
        }
    }
`;

const setBrightnessMutation = gql`
    mutation SetBrightnessMutation($brightness: Int!) {
        setBrightness(brightness: $brightness)
    }
`;

const setAutoBacklightEnabledMutation = gql`
    mutation SetAutoBacklightEnabledMutation($isAutoEnabled: Boolean!) {
        saveSettings(isAutoBacklightEnabled: $isAutoEnabled)
    }
`;


const minValue = 5;

export default () => {
    const [brightness, setBrightness] = useState(0);
    const [isAutoEnabled, setAutoEnabled] = useState(false);
    const apolloClient = useApolloClient();

    useEffect(() => {
        apolloClient.query<GetBrightnessQuery>({
            query: getBrightnessQuery,
            fetchPolicy: "no-cache",
        }).then(res => {
            setBrightness(res.data.brightness);
            setAutoEnabled(res.data.settings.isAutoBacklightEnabled);
        });
    }, []);

    const updateBrightness = (val: number) => {
        setBrightness(val);
        apolloClient.mutate<SetBrightnessMutation, SetBrightnessMutationVariables>({
            mutation: setBrightnessMutation,
            variables: {brightness: val},
        })
    }

    const toggleAutoEnabled = () => {
        const newVal = !isAutoEnabled;
        setAutoEnabled(newVal);
        apolloClient.mutate<SetAutoBacklightEnabledMutation, SetAutoBacklightEnabledMutationVariables>({
            mutation: setAutoBacklightEnabledMutation,
            variables: {
                isAutoEnabled: newVal,
            },
        });
    }

    return (
        <Box sx={commonStyles.slider}>
            <IconButton color={isAutoEnabled ? "primary" : "default"} onClick={toggleAutoEnabled}>
                <BrightnessAutoIcon fontSize="small"/>
            </IconButton>
            <IconButton onClick={() => updateBrightness(minValue)} disabled={isAutoEnabled}>
                <BrightnessLowIcon fontSize="small"/>
            </IconButton>
            <Slider
                value={brightness}
                onChange={(ev, val) => updateBrightness(val as number)}
                min={minValue}
                disabled={isAutoEnabled}
            />
            <IconButton onClick={() => updateBrightness(100)} disabled={isAutoEnabled}>
                <Brightness7Icon fontSize="small"/>
            </IconButton>
        </Box>
    );
};
