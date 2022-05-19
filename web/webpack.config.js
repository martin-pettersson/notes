import CopyWebpackPlugin from "copy-webpack-plugin";
import colors from "./configuration/colors.json" assert { type: "json" };
import dataLayer from "./configuration/dataLayer.json" assert { type: "json" };
import typography from "./configuration/typography.json" assert { type: "json" };
import webpack from "webpack";
import { join, resolve } from "path";

const { DefinePlugin } = webpack;

export default (_, { mode }) => ({
    mode: "development",
    entry: [
        resolve(process.cwd(), "src/application.ts"),
        resolve(process.cwd(), "resources/sass/application.scss")
    ],
    output: {
        path: join(process.cwd(), "public"),
        filename: "application.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        projectReferences: true
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.s?[ac]ss$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "application.css"
                        }
                    },
                    "extract-loader",
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                includePaths: [
                                    resolve(process.cwd(), "resources/sass")
                                ]
                            },
                            additionalData: `
                                $fonts: (\n${createFontMap(typography.fonts)}\n);
                                ${createVariables(colors)}
                            `
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: {
            "@notes/web": resolve(process.cwd(), "src"),

            // This is required to tree shake @moonwalkingbits/apollo-configuration.
            "fs/promises": false
        },
        extensions: [
            ".tsx",
            ".ts",
            ".json",
            ".sass",
            ".scss",

            // This is required for the dev-server to work.
            ".js"
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "resources/svg"
                }
            ]
        }),
        new DefinePlugin({
            CONFIGURATION: JSON.stringify({dataLayer, typography, colors})
        })
    ],
    devtool: mode !== "production" ? "source-map" : false,
    optimization: {
        // This is required for @moonwalkingbits/apollo-container to work since it operates on parameter names.
        minimize: false
    },
    devServer: {
        static: {
            directory: join(process.cwd(), "public")
        },
        hot: false,
        liveReload: false,
        historyApiFallback: true
    },
    experiments: {
        topLevelAwait: true
    },
    performance: {
        hints: false
    }
});

/**
 * Produce a SASS map of font definitions.
 *
 * @param {Object} fontDefinitions Arbitrary font definitions.
 * @return {string} String representation of a SASS map.
 */
function createFontMap(fontDefinitions) {
    return Object.entries(fontDefinitions)
        .map(([ name, font ]) => `"${name}": (\n${createFontDefinition(font)}\n)`)
        .join(",\n");
}


/**
 * Produce a SASS map representing a font definition.
 *
 * @param {Object} definition Arbitrary font definition.
 * @return {string} String representing a SASS map.
 */
function createFontDefinition(definition) {
    const properties = [];

    for (const [ name, value ] of Object.entries(definition)) {
        // NOTE Some font properties are generated at runtime.
        if (['sources', 'unicodeRange'].includes(name)) {
            continue;
        }

        if (name === 'family') {
            properties.push(`"${name}": (${value.map(v => `${v}`).join(", ")})`);

            continue;
        }

        properties.push(`"${name}": ${value}`);
    }

    return properties.join(",\n");
}

/**
 * Produce SASS variables from the given object.
 *
 * @param {Object} variables Arbitrary variables.
 * @return {string}
 */
function createVariables(variables) {
    return Object.entries(variables)
        .map(([ name, value ]) => createVariable(name, value))
        .join("\n");
}

/**
 * Produce a SASS variable from the given name/value pair.
 *
 * @param {string} name Variable identifier.
 * @param {*} value Arbitrary variable value.
 * @return {string} String representation of a SASS variable.
 */
function createVariable(name, value) {
    return `$${name}: ${createValue(value)};`;
}

/**
 * Produce a SASS variable value.
 *
 * @param {*} value Arbitrary value.
 * @returns {string|number} String representing a SASS variable value.
 */
function createValue(value) {
    switch (typeof value) {
        case "number":
            return value;
        case "string":
            return value.match(/^(#|\S+\()/) ? value : `"${value}"`;
        case "object":
            const values = Object.entries(value)
                .map(([ key, value ]) => `"${key}": ${createValue(value)}`)
                .join(",\n");

            return `(\n${values}\n)`;
        default:
            String(value);
    }
}
