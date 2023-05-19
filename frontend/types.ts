import { DialogProps } from "@mui/material";
import configureStore from "./store";

export type TStore = ReturnType<typeof configureStore>;

export type NotificationVariant = 'success' | 'warning' | 'error' | 'info';

export type NotificationMessageVars = { [key: string]: any };

export type Notification = {
    show: boolean,
    message: string,
    variant: NotificationVariant,
    messageVars: NotificationMessageVars,
    autoHideDuration: number,
};

export type BackendErrorCode =
    "unreachable" |
    "unknown";

export type BackendError = {
    code: BackendErrorCode,
    details?: string,
};

export interface State {
    notification: Notification;
    backendError: BackendError;
}

declare global {
    interface Window {
        bundleVersion: string;
    }
}

export class LocalStorageSchema {
    selectedDashboard: number = 0;
    weatherCity: string = null;
    volume: number = 100;
    aspectRatioOffset: number = 1;
}

export type BuckGenericDialogProps = {
    show: boolean,
    close: () => void,
    onDone?: () => void,
    muiDialogProps?: Partial<DialogProps>,
};
