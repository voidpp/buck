import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);

const root = createRoot(document.getElementById("body"));
root.render(<App />);
