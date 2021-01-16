import * as React from "react";
import {useEffect, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useBoolState, useInterval} from "../../../../hooks";
import {claudeApi, IdokepCurrentResponse} from "./claude";
import {Dialog, DialogContent, Typography} from "@material-ui/core";
import DialogActionButtons from "../../../DialogActionButtons";
import {buckLocalStorage} from "../../../../tools";
import TextFieldDialog from "../../../keyboard/TextFieldDialog";
import {FormattedMessage} from "../../../translations";
import {If} from "../../../tools";

const useStyles = makeStyles((theme: Theme) => createStyles({
    body: {
        display: "flex",
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
}));

type SettingsDialogProps = {
    isShow: boolean,
    hide: () => void,
    value: string,
    setValue: (v: string) => void,
}

const SettingsDialog = ({hide, isShow, setValue, value}: SettingsDialogProps) => {
    const [formValue, setFormValue] = useState(value || "");

    return(
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

export default ({style}: {style?: React.CSSProperties}) => {
    const [data, setData] = useState<IdokepCurrentResponse>();
    const classes = useStyles();
    const [city, setCity] = useState(buckLocalStorage.claudeDashboardWeatherCity);
    const [isShow, show, hide] = useBoolState();

    const fetchData = () => {
        if (city)
            claudeApi.idokep.current(city).then(setData);
    }

    useInterval(fetchData, 60 * 1000);
    useEffect(fetchData, [city]);

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
                            <div className={classes.value}>{data.value}°C</div>
                            <div className={classes.city}>{city}</div>
                        </div>
                        <img src={data.img} alt={data.img}/>
                    </React.Fragment>
                ) : null}
            </div>
            <SettingsDialog
                isShow={isShow}
                hide={hide}
                value={city}
                setValue={val => {
                    setCity(val);
                    buckLocalStorage.claudeDashboardWeatherCity = val;
                }}
            />
        </React.Fragment>
    )
}
