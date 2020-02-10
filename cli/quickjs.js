import {open} from 'std'
import CSSON from '../index.js'

const file = scriptArgs[1]
let data

try {
  data = open(file, ['r']).readAsString()
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