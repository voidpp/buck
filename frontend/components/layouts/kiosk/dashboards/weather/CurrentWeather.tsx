import * as React from "react";
import {useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useBoolState} from "../../../../../hooks";
import {Dialog, DialogContent, Typography} from "@material-ui/core";
import DialogActionButtons from "../../../../DialogActionButtons";
import {buckLocalStorage} from "../../../../../tools";
import TextFieldDialog from "../../../../keyboard/TextFieldDialog";
import {FormattedMessage} from "react-intl";
import {If} from "../../../../tools";
import {gql, useQuery} from "@apollo/client";
import {CurrentWeatherQuery, CurrentWeatherQueryVariables} from "./__generated__/CurrentWeatherQuery";

const useStyles = makeStyles({
    body: {
        display: "flex",
        fontFamily: "Josefin Sans",
        '& img': {
            width: "7em",
        },
    },
    value: {
        fontSize: "2em",
        textAlign: 'center',
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
    }
});

type SettingsDialogProps = {
    isShow: boolean,
    hide: () => void,
    value: string,
    setValue: (v: string) => void,
}

const SettingsDialog = ({hide, isShow, setValue, value}: SettingsDialogProps) => {
    const [formValue, setFormValue] = useState(value || "");

    return (
        <Dialog open={isShow} onClose={hide}>
            <DialogContent>
                <TextFieldDialog
                    label={<FormattedMessage id="name"/>}
                    fullWidth
                    value={formValue}
                    onChange={ev => setFormValue(ev.target.value)}
                />
            </DialogContent>
            <DialogActionButtons onCancel={hide} onSubmit={() => {
                setValue(formValue);
                hide();
            }}/>
        </Dialog>
    )
}

const currentWeatherQuery = gql`
    query CurrentWeatherQuery($city: String!) {
        weather(city: $city) {
            temperature
            conditionsImageUrl
        }
    }
`;

export default ({style}: { style?: React.CSSProperties }) => {
    const classes = useStyles();
    const [city, setCity] = useState(buckLocalStorage.weatherCity);
    const [isShow, show, hide] = useBoolState();

    const {data} = useQuery<CurrentWeatherQuery, CurrentWeatherQueryVariables>(currentWeatherQuery, {variables: {city}});

    return (
        <React.Fragment>
            <div className={classes.body} onClick={show} style={style}>
                <If condition={!city}>
                    <Typography>
                        Click here to set the city!
                    </Typography>
                </If>
                {data ? (
                    <React.Fragment>
                        <div className={classes.text}>
                            <div className={classes.value}>{Math.round(data.weather.temperature)}°C</div>
                            <div className={classes.city}>{city}</div>
                        </div>
                        <img src={data.weather.conditionsImageUrl} alt={data.weather.conditionsImageUrl}/>
                    </React.Fragment>
                ) : null}
            </div>
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
    )
}
