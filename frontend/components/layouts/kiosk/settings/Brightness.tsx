import {IconButton, Slider} from "@material-ui/core";
import BrightnessLowIcon from "@material-ui/icons/BrightnessLow";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import * as React from "react";
import {useEffect, useState} from "react";
import {useCommonStyles} from "./styles";
import {gql, useApolloClient} from "@apollo/client";
import {GetBrightnessQuery} from "./__generated__/GetBrightnessQuery";
import {SetBrightnessMutation, SetBrightnessMutationVariables} from "./__generated__/SetBrightnessMutation";


const getBrightnessQuery = gql`
    query GetBrightnessQuery {
        brightness
    }
`;

const setBrightnessMutation = gql`
    mutation SetBrightnessMutation($brightness: Int!) {
        setBrightness(brightness: $brightness)
    }
`;

const minValue = 5;

export default () => {
    const [brightness, setBrightness] = useState(0);
    const classes = useCommonStyles();
    const apolloClient = useApolloClient();

    useEffect(() => {
        apolloClient.query<GetBrightnessQuery>({
            query: getBrightnessQuery,
            fetchPolicy: "no-cache",
        }).then(res => setBrightness(res.data.brightness));
    }, []);

    const updateValue = (val: number) => {
        setBrightness(val);
        apolloClient.mutate<SetBrightnessMutation, SetBrightnessMutationVariables>({
            mutation: setBrightnessMutation,
            variables: {brightness: val},
        })
    }

    return (
        <div className={classes.slider}>
            <IconButton onClick={() => updateValue(minValue)}>
                <BrightnessLowIcon fontSize="small"/>
            </IconButton>
            <Slider
                value={brightness}
                onChange={(ev, val) => updateValue(val as number)}
                min={minValue}
            />
            <IconButton onClick={() => updateValue(100)}>
                <Brightness7Icon fontSize="small"/>
            </IconButton>
        </div>
    );
};
