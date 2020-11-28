import * as React from "react";
import {Error} from "../api";
import {FormattedMessage} from "./translations";
import {TranslationKey} from "../translations";

export const ErrorList = ({errors}: { errors: Error[] }) => {
    if (!errors.length)
        return null;

    return (
        <span>
            {errors.map(err => (
                <span key={err.type}>
                    <FormattedMessage id={err.type as TranslationKey} values={JSON.parse(err.context)}/>
                </span>
            ))}
        </span>
    );
}
