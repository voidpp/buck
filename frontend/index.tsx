import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./index/App";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);

ReactDOM.render(<App/>, document.getElementById("body"));
