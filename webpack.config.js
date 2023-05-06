// const {execSync} = require('child_process');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const path = require('path');

// const externals = JSON.parse(execSync('inv typescript.umd.print-webpack-externals'));

module.exports = {
    mode: "development",
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            'apollo-client': path.resolve(__dirname, 'node_modules/apollo-client'),
            'react-intl': path.resolve(__dirname, 'node_modules/react-intl'),
            '@apollo/react-common': path.resolve(__dirname, 'node_modules/@apollo/react-common'),
            '@apollo/react-hooks': path.resolve(__dirname, 'node_modules/@apollo/react-hooks'),
        },
    },
    entry: {
        rpiKiosk: "./frontend/rpiKiosk.tsx",
        admin: "./frontend/admin.tsx",
        index: "./frontend/index.tsx",
    },
    output: {
        filename: "[name]-bundle.js",
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {loader: "ts-loader"},
                ],
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
                exclude: [
                    /node_modules\/@dvrt\/graphql-widgets/,
                ],
            },
        ],
    },
    /*
    * TODO: apollo related libs:
    *  due some build error (i guess) the apollo libs has broken umd builds (apollo-client/bundle.umd.js > global.unknown)
    * */
    // externals: externals,
    watchOptions: {
        ignored: '**/__generated__/*.ts',
    },
    plugins: [
        new LiveReloadPlugin({}),
        new DuplicatePackageCheckerPlugin(),
    ],
};
