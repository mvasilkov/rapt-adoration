#!/usr/bin/env node

const fs = require('fs')

const chalk = require('chalk')
const glob = require('glob')
const ssri = require('ssri')
const write = require('write-json-file')

require('yargs')
    .scriptName('rapt')
    .command('create', 'Write the Lock.rapt file', _yargs => {
    }, async _argv => {
        if (fs.existsSync('Lock.rapt')) {
            console.log('File exists, not overwriting')
            return
        }

        const rapt = {}
        const things = glob.sync('*', { nodir: true })

        for (let n = 0; n < things.length; ++n) {
            const a = things[n]
            const b = await ssri.fromStream(fs.createReadStream(a), { algorithms: ['sha256'] })

            console.log(a, chalk.green(b.toString()))
            rapt[a] = b
        }

        console.log('Writing the Lock.rapt file')
        write.sync('Lock.rapt', rapt, { sortKeys: true })
    })
    .demandCommand()
    .help()
    .argv
