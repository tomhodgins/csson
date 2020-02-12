const parseCSS = require('./lib/parse-css/index.cjs.js')

class CSSONType {
  constructor() {
    if (this.constructor === CSSONType) {
      throw new Error(`Can't create abstract base class directly`)
    }
  }
  toJSON() { return this.value }
  toString() { return this.value }
}

class JSONNumber extends CSSONType {
  constructor(value) {
    super()

    this.type = '<json-number>'
    this.value = Number(value)
  }
}

class JSONTrue extends CSSONType {
  constructor() {
    super()

    this.type = '<json-true>'
    this.value = true
  }
}

class JSONFalse extends CSSONType {
  constructor() {
    super()

    this.type = '<json-false>'
    this.value = false
  }
}

class JSONNull extends CSSONType {
  constructor() {
    super()

    this.type = '<json-null>'
    this.value = null
  }
  toJSON() { return null }
}

class JSONString extends CSSONType {
  constructor(value) {
    super()

    this.type = '<json-string>'
    this.value = String(value)
  }
  //toJSON() { return this.value }
  toString() { return JSON.stringify(this.value) }
}

class CSSIdent extends CSSONType {
  constructor(value) {
    super()

    this.type = '<css-ident>'
    this.value = value
  }
}

class CSSHash extends CSSONType {
  constructor(value) {
    super()

    this.type = '<css-hash>'
    this.value = value
  }
  toJSON() { return `#${this.value}` }
  toString() { return `#${this.value}` }
}

class CSSUrl extends CSSONType {
  constructor(value) {
    super()

    this.type = '<css-url>'
    this.value = value
  }
  toString() { return `url(${this.value})` }
}

class JSONArray extends CSSONType {
  constructor(value) {
    super()

    this.type = '<json-array>'
    this.value = value
  }
  toString() { return JSON.stringify(this.value) }
}

class CSSONArray extends JSONArray {
  constructor(value) {
    super()

    this.type = '<csson-array>'
    this.value = value
  }
  toString() { return `[${this.value}]` }
}

class JSONObject extends CSSONType {
  constructor(value) {
    super()

    this.type = '<json-object>'
    this.value = value
  }
  toString() { return JSON.stringify(this.value) }
}

class CSSONObject extends JSONObject {
  constructor(value) {
    super()

    this.type = '<csson-object>'
    this.value = value
  }
  toString() {
    return `{${
      Object.entries(this.value)
        .map(([key, value]) => `${key}:${value}`)
        .join(',')
    }}`
  }
}

class CSSQualifiedRule extends CSSONType {
  constructor(name, properties) {
    super()

    this.type = '<css-qualified-rule>'
    this.name = name
    this.value = properties
  }
  toJSON() {
    return JSON.parse(
      `{${JSON.stringify(this.name)}:${JSON.stringify(this.value)}}`
    )
  }
  toString() {
    return `${this.name}{${
      Object.entries(this.value)
        .map(([key, value]) => `${key}:${value}`)
        .join(';')
    }}`
  }
}

function parseCSSON(string = '') {
  // Try To Parse A Rule
  let rule

  try {
    rule = parseCSS.parseARule(String(string))
  } catch (error) {}

  // Try To Parse A Component Value
  let component

  try {
    component = parseCSS.parseAComponentValue(String(string))
  } catch (error) {}

  if (
    component
    && (
      rule === undefined
      || rule.prelude.length === 0
    )
  ) {
    // <json-number>
    if (component.tokenType === 'NUMBER') {
      return new JSONNumber(component.repr)
    }

    // <json-true>
    if (
      component.tokenType === 'IDENT'
      && component.value === 'true'
    ) {
      return new JSONTrue()
    }

    // <json-false>
    if (
      component.tokenType === 'IDENT'
      && component.value === 'false'
    ) {
      return new JSONFalse()
    }

    // <json-null>
    if (
      component.tokenType === 'IDENT'
      && component.value === 'null'
    ) {
      return new JSONNull()
    }

    // <css-ident>
    if (component.tokenType === 'IDENT') {
      return new CSSIdent(component.value)
    }

    // <json-string>
    if (component.tokenType === 'STRING') {
      return new JSONString(component.value)
    }

    // <css-url>
    if (component.tokenType === 'URL') {
      return new CSSUrl(component.value)
    }
    if (
      component.type === 'FUNCTION'
      && component.name === 'url'
    ) {
      return new CSSUrl(
        parseCSSON(
          stringifyTokens(component.value)
        ).value
      )
    }

    // <css-hash>
    if (component.tokenType === 'HASH') {
      return new CSSHash(component.value)
    }

    // <json-array> & <csson-array>
    if (
      component.type === 'BLOCK'
      && component.name === '['
    ) {
      let json

      try {
        json = JSON.parse(
          `[${stringifyTokens(component.value)}]`
        )
      } catch (error) {}

      // <json-array>
      if (json) {
        return new JSONArray(
          component.value.reduce(
            (list, token) => {
              let json

              try {
                json = JSON.parse(
                  token.toSource()
                )
              } catch (error) {}
  
              if (json !== undefined) {
                list.push(json)
              }
  
              return list
            },
            []
          )
        )
      }

      // <csson-array>
      if (json === undefined) {
        return new CSSONArray(
          component.value.reduce(
            (list, token) => {
              const object = parseCSSON(token.toSource())

              if (object !== undefined) {
                list.push(object)
              }

              return list
            },
            []
          )
        )
      }
    }

    // <json-object>
    if (
      component.type === 'BLOCK'
      && component.name === '{'
    ) {
      let json

      try {
        json = JSON.parse(
          `{${stringifyTokens(component.value)}}`
        )
      } catch (error) {}

      // <json-object>
      if (json !== undefined) {
        return new JSONObject(
          parseCSS.parseAListOfDeclarations(
            parseCSS.parseACommaSeparatedListOfComponentValues(
              stringifyTokens(component.value)
            ).map(property => property.map(token =>
              token.tokenType === 'STRING'
                ? token.value
                : token.toSource()
              ).join('')
            ).join(';')
          ).reduce(
            (obj, prop) => {
              obj[prop.name] = JSON.parse(
                stringifyTokens(prop.value)
              )

              return obj
            },
            {}
          )
        )
      }

      // <csson-object>
      if (json === undefined) {
        return new CSSONObject(
          parseCSS.parseAListOfDeclarations(
            parseCSS.parseACommaSeparatedListOfComponentValues(
              stringifyTokens(component.value)
            ).map(prop => prop.map(tok => tok.toSource()).join('')).join(';')
          ).reduce(
            (obj, prop) => {
              obj[prop.name] = parseCSSON(
                prop.value.map(tok => tok.toSource()).join('')
              )

              return obj
            },
            {}
          )
        )
      }
    }

  } else if (rule !== undefined) {
    // <css-qualified-rule>
    return new CSSQualifiedRule(
      rule.prelude.map(tok => tok.toSource()).join('').trim(),
      parseCSS.parseAListOfDeclarations(
        rule.value.value
      ).reduce(
        (obj, prop) => {
          obj[prop.name] = parseCSSON(
            prop.value.map(tok => tok.toSource()).join('')
          )

          return obj
        },
        {}
      )
    )
  }
}

function stringifyCSSON(csson = '') {
  return String(csson.toString())
}

function stringifyTokens(tokens = []) {
  return tokens.map(token => token.toSource()).join('')
}

module.exports = {
  parse: parseCSSON,
  decode: parseCSSON,
  stringify: stringifyCSSON,
  encode: stringifyCSSON
}