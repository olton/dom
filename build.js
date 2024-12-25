import {build, context} from "esbuild"
import progress from "@olton/esbuild-plugin-progress"
import {replace} from "esbuild-plugin-replace"
import pkg from "./package.json" assert {type: "json"}

const production = process.env.MODE === "production"
const banner = `
/*!
 * Dom - a simple, lightweight, and fast JavaScript library for work with Dom Elements.
 * Version: ${pkg.version}
 * Build time: ${new Date().toLocaleString()}
 * Licensed under MIT
 * Copyright ${new Date().getFullYear()} by Serhii Pimenov (https://pimenov.com.ua)
 * Repository: ${pkg.repository.url}
 */ 
`

const options = {
    entryPoints: ["./src/index.js"],
    bundle: true,
    minify: production,
    sourcemap: false,
    format: "esm",
    banner: {
        js: banner
    }
}

if (production) {
    await build({
        ...options,
        outfile: "./dist/dom.js",
        plugins: [
            progress(),
            replace({
                '__BUILD_TIME__': new Date().toLocaleString(),
                '__VERSION__': pkg.version,
                '__REGISTER_GLOBAL__': false,
            })
        ],
    })
    await build({
        ...options,
        outfile: "./lib/dom.js",
        format: "iife",
        globalName: "Spark",
        plugins: [
            progress(),
            replace({
                '__BUILD_TIME__': new Date().toLocaleString(),
                '__VERSION__': pkg.version,
                '__REGISTER_GLOBAL__': true,
            })
        ],
    })
} else {
    let ctxDist = await context({
        ...options,
        outfile: "./dist/dom.js",
        plugins: [
            progress(),
            replace({
                '__BUILD_TIME__': new Date().toLocaleString(),
                '__VERSION__': pkg.version,
                '__REGISTER_GLOBAL__': false,
            })
        ],
    })
    let ctxLib = await context({
        ...options,
        outfile: "./lib/dom.js",
        format: "iife",
        globalName: "Spark",
        plugins: [
            progress(),
            replace({
                '__BUILD_TIME__': new Date().toLocaleString(),
                '__VERSION__': pkg.version,
                '__REGISTER_GLOBAL__': true,
            })
        ],
    })
    await Promise.all([
        ctxDist.watch(),
        ctxLib.watch()
    ])
}