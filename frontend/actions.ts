import {BackendError, NotificationMessageVars, NotificationVariant} from "./types";

export enum Action {
    SHOW_NOTIFICATION = 'SHOW_NOTIFICATION',
    HIDE_NOTIFICATION = 'HIDE_NOTIFICATION',
    SET_BACKEND_ERROR = 'SET_BACKEND_ERROR',
}

export const showNotification = (message: string, variant: NotificationVariant = 'success', vars: NotificationMessageVars = {},
                                 autoHideDuration = 5000) => ({
    type: Action.SHOW_NOTIFICATION,
    message,
    variant,
    vars,
    autoHideDuration,
});

export const hideNotification = () => ({
    type: Action.HIDE_NOTIFICATION,
});

export const setBackendError = (error: BackendError) => ({
    type: Action.SET_BACKEND_ERROR,
    error,
});

export const clearBackendError = () => ({
    type: Action.SET_BACKEND_ERROR,
    error: null,
});
