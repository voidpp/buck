import * as React from "react";
import {Error} from "../api";
import {FormattedMessage} from "react-intl";

export const ErrorList = ({errors}: { errors: Error[] }) => {
    if (!errors.length)
        return null;

    return (
        <span>
            {errors.map(err => (
                <span key={err.type}>
                    <FormattedMessage id={err.type} values={JSON.parse(err.context)}/>
                </span>
            ))}
        </span>
    );
}
