import {build, context} from "esbuild"
import progress from "@olton/esbuild-plugin-progress"
import { replace } from "esbuild-plugin-replace";
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

function buildIndex(){
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
        'src/modules/scroll.js',
        'src/modules/init.js',
    ];

    const indexContent = [...source_files, 'src/modules/export.js'].reduce((content, file) => {
        return content + fs.readFileSync(file, 'utf8').toString() + "\n\n";
    }, "");

    fs.writeFileSync('output/index.js', indexContent, {encoding: 'utf8', flag: 'w+'});
}


const buildIndexPlugin = {
    name: 'buildIndex',
    setup(build) {
        build.onStart(() => {
            console.log('Building index.js...');
            buildIndex()
        });
    }
}

const options = {
    entryPoints: ['output/index.js'],
    bundle: true,
    sourcemap: false,
    minify: false,
    banner: {js: banner},
    outfile: 'dist/dom.js',
    format: 'esm',
    plugins: [
        progress({
            text: 'Building...',
            succeedText: `Built successfully in %s ms!`
        }),
        replace({
            '__BUILD_TIME__': new Date().toLocaleString(),
            '__VERSION__': pkg.version,
        })
    ],
}

if (production) {
    buildIndex()
    await build({
        ...options,
    })
} else {
    buildIndex()
    const ctx = await context({
        ...options,
    })
    
    await Promise.all([
        ctx.watch(),
    ])
}

