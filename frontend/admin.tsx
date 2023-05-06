import { colors, createMuiTheme, CssBaseline, ThemeProvider } from "@mui/material";
import * as React from "react";
import * as ReactDOM from "react-dom";


const darkTheme = createMuiTheme({
    palette: {
        mode: 'dark',
        primary: colors.cyan,
        secondary: colors.pink,
    },
});


const App = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <div style={{padding: 20}}>
                admin
            </div>
        </ThemeProvider>
    );
}

ReactDOM.render(<App/>, document.getElementById("body"));
