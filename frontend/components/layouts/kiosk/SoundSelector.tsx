import * as React from "react";
import {gql, useQuery} from "@apollo/client";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {FormattedMessage} from "../../translations";
import {SoundSelectorQuery} from "./__generated__/SoundSelectorQuery";

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

    const options = data?.sounds ?? [];

    return (
        <FormControl fullWidth style={style}>
            <InputLabel>
                <FormattedMessage id="alarmSoundFile"/>
            </InputLabel>
            <Select value={value} onChange={ev => onChange(ev.target.value as string)} fullWidth>
                {options.map(op => (
                    <MenuItem value={op.fileName} key={op.fileName}>{op.title}</MenuItem>
                ))}
            </Select>
        </FormControl>

    );
}
