import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(duration);
dayjs.extend(relativeTime);

ReactDOM.render(<App/>, document.getElementById("body"));
