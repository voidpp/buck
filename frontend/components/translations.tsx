import * as React from "react";
import {TranslationKey} from "../translations";
import {FormattedMessage as ReactFormattedMessage} from "react-intl";
import {Button, ButtonProps} from "@material-ui/core";


export const FormattedMessage = ({id, values}: { id: TranslationKey, values?: any }) => (
    <ReactFormattedMessage id={id} values={values}/>
);

type FormattedButtonProps = {
    msgId: TranslationKey,
} & ButtonProps;

export const FormattedButton = (props: FormattedButtonProps) => {
    const props_ = {...props};
    delete props_.msgId;

    return (
        <Button color="primary" {...props_}>
            <FormattedMessage id={props.msgId}/>
        </Button>
    )
};
