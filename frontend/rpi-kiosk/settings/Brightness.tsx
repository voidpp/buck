import {IconButton, Slider} from "@material-ui/core";
import BrightnessLowIcon from "@material-ui/icons/BrightnessLow";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import * as React from "react";
import {useEffect, useState} from "react";
import {useCommonStyles} from "./styles";
import {gql, useApolloClient} from "@apollo/client";
import {GetBrightnessQuery} from "./__generated__/GetBrightnessQuery";
import {SetBrightnessMutation, SetBrightnessMutationVariables} from "./__generated__/SetBrightnessMutation";
import BrightnessAutoIcon from '@material-ui/icons/BrightnessAuto';
import {SetAutoBacklightEnabledMutation, SetAutoBacklightEnabledMutationVariables} from "./__generated__/SetAutoBacklightEnabledMutation";


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
    const classes = useCommonStyles();
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
        <div className={classes.slider}>
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
        </div>
    );
};
