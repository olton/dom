import {build, context} from "esbuild"
import progress from "@olton/esbuild-plugin-progress"
import fs from "node:fs"
import pkg from "./package.json" with {type: "json"}

const production = process.env.NODE_ENV === 'production'

const banner = `
/*!
 * DOM - Work with HTML elements (@olton/dom, https://metroui.org.ua)
 * Version: ${pkg.version}
 * Build date: ${new Date().toLocaleString()}
 * Copyright 2012-${new Date().getFullYear()} by Serhii Pimenov
 * Licensed under MIT
 */
`

const source_files = [
    'src/modules/mode.js',
    'src/modules/helpers.js',

    'src/modules/core.js',
    'src/modules/interval.js',
    'src/modules/contains.js',
    'src/modules/script.js',
    'src/modules/prop.js',
    'src/modules/each.js',
    'src/modules/data.js',
    'src/modules/utils.js',
    'src/modules/events.js',
    'src/modules/ajax.js',
    'src/modules/css.js',
    'src/modules/classes.js',
    'src/modules/parser.js',
    'src/modules/size.js',
    'src/modules/position.js',
    'src/modules/attr.js',
    'src/modules/bind.js',
    'src/modules/manipulation.js',
    'src/modules/animation.js',
    'src/modules/visibility.js',
    'src/modules/effects.js',
    'src/modules/init.js',
];

let lib = ``, ind = ``

;[...source_files, 'src/modules/populate.js'].forEach(file => {
    lib += fs.readFileSync(file, 'utf8').toString() + "\n\n";
})

;[...source_files, 'src/modules/export.js'].forEach(file => {
    ind += fs.readFileSync(file, 'utf8').toString() + "\n\n";
})

lib = lib.replace(/version = ".+"/g, `version = "${pkg.version}"`)
lib = lib.replace(/build_time = ".+"/g, `build_time = "${new Date().toLocaleString()}"`)
ind = ind.replace(/version = ".+"/g, `version = "${pkg.version}"`)
ind = ind.replace(/build_time = ".+"/g, `build_time = "${new Date().toLocaleString()}"`)

fs.writeFileSync('output/lib.js', lib, {encoding: 'utf8', flag: 'w+'});
fs.writeFileSync('output/index.js', ind, {encoding: 'utf8', flag: 'w+'});

const defaults = {
    bundle: true,
    sourcemap: false,
    minify: false,
    banner: {js: banner},
}

await build({
    ...defaults,
    entryPoints: ['output/index.js'],
    outfile: 'dist/dom.js',
    format: 'esm',
    plugins: [
        progress({
            text: 'Building...',
            succeedText: `Built successfully in %s ms!`
        }),
    ],
})

await build({
    ...defaults,
    entryPoints: ['output/lib.js'],
    outfile: 'lib/dom.js',
    format: 'iife',
    minify: production,
    plugins: [
        progress({
            text: 'Building lib...',
            succeedText: `Lib built successfully in %s ms!`
        }),
    ],
})
