import * as React from "react";
import * as ReactDOM from "react-dom";
import {colors, createMuiTheme, CssBaseline, MuiThemeProvider} from "@material-ui/core";


const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: colors.cyan,
        secondary: colors.pink,
    },
});


const App = () => {
    return (
        <MuiThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <div style={{padding: 20}}>
                admin
            </div>
        </MuiThemeProvider>
    );
}

ReactDOM.render(<App/>, document.getElementById("body"));
