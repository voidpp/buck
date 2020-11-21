import * as React from "react";
import {TranslationKey} from "../translations";
import {FormattedMessage as ReactFormattedMessage} from "react-intl";


export const FormattedMessage = ({id}: {id: TranslationKey}) => (
    <ReactFormattedMessage id={id} />
);
