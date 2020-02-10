#!/usr/bin/env node
const fs = require('fs')
const CSSON = require('../index.cjs.js')

const file = process.argv.slice(2)[0]
let data

try {
  data = fs.readFileSync(file).toString()
} catch (error) {
  data = file
}

// CSSON -> JSON
console.log(
  JSON.stringify(
    CSSON.parse(data),
    null,
    2
  )
)