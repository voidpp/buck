import {combineReducers} from 'redux';
import {Action, setBackendError} from './actions';
import {BackendError, Notification, State} from './types';

const emptyNotification: Notification = {show: false, message: '', variant: 'success', messageVars: {}, autoHideDuration: 5000};

function notification(state: Notification = emptyNotification, action: any): Notification {
    switch (action.type) {
        case Action.SHOW_NOTIFICATION:
            return {
                message: action.message,
                variant: action.variant,
                show: true,
                messageVars: action.vars,
                autoHideDuration: action.autoHideDuration,
            };
        case Action.HIDE_NOTIFICATION:
            return Object.assign({}, state, {show: false});
        default:
            return state;
    }
}

function backendError(state: BackendError = null, action: ReturnType<typeof setBackendError>): BackendError {
    if (action.type === Action.SET_BACKEND_ERROR) {
        return action.error;
    }

    return state;
}

const rootReducer = combineReducers<State>({
    notification,
    backendError,
});

export default rootReducer;
