import CSSON from '../index.js'

function CSSONEqualsJSON(string) {
  return JSON.stringify(JSON.parse(string), null, 2) === JSON.stringify(CSSON.parse(string), null, 2)
}

const tests = [
  // Function testing
  [
    CSSON.parse() === undefined,
    'No input should return undefined'
  ],
  [
    CSSON.parse('') === undefined,
    'Empty input with no CSSON should return undefined'
  ],

  // CSSON Features
  [
    JSON.stringify(
      CSSON.parse('/* css */ /* comments */ 1 /* ignored */')
    ) === '1',
    'CSS comments ignored'
  ],
  [
    CSSON.parse(1).type === '<json-number>'
    && CSSON.parse(1).value === 1,
    '1 is a <json-number> type with a value of 1'
  ],
  [
    CSSON.parse('a').type === '<css-ident>'
    && CSSON.parse('a').value === 'a',
    'a is a <css-ident> type with a value of a'
  ],
  [
    CSSON.parse('"a"').type === '<json-string>'
    && CSSON.parse('"a"').value === 'a',
    '"a" is a <json-string> type with a value of a'
  ],
  [
    CSSON.parse('true').type === '<json-true>'
    && CSSON.parse('true').value === true,
    'true is a <json-true> type with a value of true'
  ],
  [
    CSSON.parse('false').type === '<json-false>'
    && CSSON.parse('false').value === false,
    'false is a <json-false> type with a value of false'
  ],
  [
    CSSON.parse('null').type === '<json-null>'
    && CSSON.parse('null').value === null,
    'null is a <json-null> type with a value of null'
  ],
  [
    CSSON.parse('[1, 2, 3]').type === '<json-array>'
    && CSSON.parse('[1, 2, 3]').value.length === 3,
    '[1, 2, 3] is a <json-array> type with a length of 3'
  ],
  [
    CSSON.parse('[#one, url(two), three]').type === '<csson-array>'
    && CSSON.parse('[#one, url(two), three]').value.length === 3,
    '[#one, url(two), three] is a <csson-array> type with a length of 3'
  ],
  [
    CSSON.parse('{"a": 1, "b": 2, "c": 3}').type === '<json-object>'
    && Object.entries(CSSON.parse('{"a": 1, "b": 2, "c": 3}').value).length === 3,
    '{"a": 1, "b": 2, "c": 3} is a <json-object> type with 3 properties'
  ],
  [
    CSSON.parse('{a: one, b: #two, c: url(three)}').type === '<csson-object>'
    && Object.entries(CSSON.parse('{a: one, b: #two, c: url(three)}').value).length === 3,
    '{a: one, b: #two, c: url(three)} is a <csson-object> type with 3 properties'
  ],
  [
    CSSON.parse('a {b: c; d: e;}').type === '<css-qualified-rule>'
    && Object.entries(CSSON.parse('a {b: c; d: e;}').value).length === 2,
    'a {b: c; d: e;} is a <css-qualified-rule> type with 2 properties'
  ],
  [
    CSSON.parse('[[[3]]]').value[0][0][0] === 3,
    '[[[3]]] is a deeply-nested <json-number> 3 inside 3 <json-array>'
  ],
  [
    CSSON.stringify(CSSON.parse(1)) === '1',
    `1 stringifies to '1'`
  ],
  [
    CSSON.stringify(CSSON.parse('a')) === 'a',
    `a stringifies to 'a'`
  ],
  [
    CSSON.stringify(CSSON.parse('"a"')) === '"a"',
    `"a" stringifies to '"a"'`
  ],
  [
    CSSON.stringify(CSSON.parse('true')) === 'true',
    `true stringifies to 'true'`
  ],
  [
    CSSON.stringify(CSSON.parse('false')) === 'false',
    `false stringifies to 'false'`
  ],
  [
    CSSON.stringify(CSSON.parse('null')) === 'null',
    `null stringifies to 'null'`
  ],
  [
    CSSON.stringify(CSSON.parse('[1,2,3]')) === '[1,2,3]',
    `[1,2,3] stringifies to '[1,2,3]'`
  ],
  [
    CSSON.stringify(CSSON.parse('[#one,url(two),three]')) === '[#one,url(two),three]',
    `[#one,url(two),three] stringifies to '[#one,url(two),three]'`
  ],
  [
    CSSON.stringify(CSSON.parse('{a:1,b:2}')) === '{a:1,b:2}',
    `{a:1,b:2} stringifies to '{a:1,b:2}'`
  ],
  [
    CSSON.stringify(CSSON.parse('{a:#one,b:url(two)}')) === '{a:#one,b:url(two)}',
    `{a:#one,b:url(two)} stringifies to '{a:#one,b:url(two)}'`
  ],
  [
    CSSON.stringify(CSSON.parse('a{b:c;d:e}')) === 'a{b:c;d:e}',
    `a{b:c;d:e} stringifies to 'a{b:c;d:e}'`
  ],

  // Testing JSON
  [
    JSON.stringify(JSON.parse(`[{"a": "a()"}]`)) === JSON.stringify(CSSON.parse(`[{"a": "a()"}]`)),
    'JSON array parses as CSSON'
  ],
  [
    JSON.stringify(JSON.parse(`{"a": {"b": "b()"}}`)) === JSON.stringify(CSSON.parse(`{"a": {"b": "b()"}}`)),
    'JSON object parses as CSSON'
  ]
]

// Run tests
tests.forEach(([test, message]) =>
  console.log(test, message)
)