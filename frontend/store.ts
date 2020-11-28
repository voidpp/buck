import {applyMiddleware, createStore} from 'redux';
import thunkMiddleware, {ThunkMiddleware} from 'redux-thunk';
import rootReducer from './reducers';
import {createLogger} from "redux-logger";

const loggerMiddleware = createLogger();

export default function configureStore() {
    return createStore(rootReducer, {}, applyMiddleware(thunkMiddleware as ThunkMiddleware, loggerMiddleware));
}
