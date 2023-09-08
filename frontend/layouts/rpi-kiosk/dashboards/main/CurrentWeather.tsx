import { DialogActionButtons, If } from "@/components/widgets";
import { useCurrentWeatherQuery } from "@/graphql-types-and-hooks";
import { useBoolState, useInterval } from "@/hooks";
import { buckLocalStorage } from "@/tools";
import { Box, Dialog, DialogContent, SxProps, Typography } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { TextField } from "../../../../components/TextField";

const styles = {
    body: {
        display: "flex",
        fontFamily: "Josefin Sans",
        "& img": {
            width: "7em",
        },
    },
    value: {
        fontSize: "2em",
        textAlign: "center",
    },
    city: {
        fontSize: "0.9em",
        textAlign: "center",
    },
    text: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        marginRight: "0.5em",
    },
} satisfies Record<string, SxProps>;

type SettingsDialogProps = {
    isShow: boolean;
    hide: () => void;
    value: string;
    setValue: (v: string) => void;
};

const SettingsDialog = ({ hide, isShow, setValue, value }: SettingsDialogProps) => {
    const [formValue, setFormValue] = useState(value || "");

    return (
        <Dialog open={isShow} onClose={hide}>
            <DialogContent>
                <TextField
                    label={<FormattedMessage id="name" />}
                    fullWidth
                    value={formValue}
                    onChange={ev => setFormValue(ev.target.value)}
                />
            </DialogContent>
            <DialogActionButtons
                onCancel={hide}
                onSubmit={() => {
                    setValue(formValue);
                    hide();
                }}
            />
        </Dialog>
    );
};

export default ({ style }: { style?: React.CSSProperties }) => {
    const [city, setCity] = useState(buckLocalStorage.weatherCity);
    const [isShow, show, hide] = useBoolState();

    const { data, refetch } = useCurrentWeatherQuery({ variables: { city } });

    useInterval(refetch, 1000 * 60);

    return (
        <React.Fragment>
            <Box sx={styles.body} onClick={show} style={style}>
                <If condition={!city}>
                    <Typography>Click here to set the city!</Typography>
                </If>
                {data ? (
                    <React.Fragment>
                        <Box sx={styles.text}>
                            <Box sx={styles.value}>{Math.round(data.weather.temperature)}°C</Box>
                            <Box sx={styles.city}>{city}</Box>
                        </Box>
                        <img src={data.weather.conditionsImageUrl} alt={data.weather.conditionsImageUrl} />
                    </React.Fragment>
                ) : null}
            </Box>
            <SettingsDialog
                isShow={isShow}
                hide={hide}
                value={city}
                setValue={val => {
                    setCity(val);
                    buckLocalStorage.weatherCity = val;
                }}
            />
        </React.Fragment>
    );
};
