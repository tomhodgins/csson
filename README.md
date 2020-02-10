# CSSON

A JSON superset with additional types from CSS

## About 

CSSON is a superset of [JSON](https://www.ecma-international.org/publications/standards/Ecma-404.htm) that is parsed according to [CSS syntax](https://drafts.csswg.org/css-syntax-3/).

Any JSON can be parsed as CSSON, though not every CSS Style Sheet can be parsed as CSSON.

Pros:

- CSSON syntax is more expressive and forgiving than JSON syntax, making it friendlier to use
- CSSON includes more types than JSON, allowing your environment to handle the pieces of information in a smarter way
- Comments

Cons:

- less built-in language support, compared to JSON or XML

## CSSON Objects

### JSON Types

- `<json-number>`
- `<json-string>`
- `<json-true>`
- `<json-false>`
- `<json-null>`
- `<json-array>`
- `<json-object>`

## CSS Types

- [`<css-ident>`](https://drafts.csswg.org/css-syntax-3/#ref-for-typedef-ident-token%E2%91%A0)
- [`<css-hash>`](https://drafts.csswg.org/css-syntax-3/#hash-token-diagram)
- [`<css-url>`](https://drafts.csswg.org/css-syntax-3/#url-token-diagram)
- [`<css-qualified-rule>`](https://drafts.csswg.org/css-syntax-3/#qualified-rule)

## CSSON Types

- `<csson-array>`
- `<csson-object>`

## It's JLJ (Just like JSON)

CSSON always attemps to parse a JSON type first, so `1` will always be a `<json-number>`, not a [`<css-number>`](https://drafts.csswg.org/css-syntax-3/#number-token-diagram).

### Converting CSS Types to JSON Types

- `<css-ident>` becomes a `<json-string>`

```css
ident
```

```json
"ident"
```

- `<css-hash>` becomes a `<json-string>`

```css
#hash
```

```json
"#hash"
```

- `<css-url>` becomes a `<json-string>`

```css
url(https://url.com)
```

```json
"https://url.com"
```

- `<css-qualified-rule>` becomes a `<json-object>`

```css
selector {
  property: value;
}
```

```json
{
  "selector": {
    "property": "value"
  }
}
```

## Rules

- maximum one value per slot where a value could go

```css
1      /* valid */
1 2 3  /* invalid */
```

```css
{
  number: 1;      /* valid */
  number: 1 2 3;  /* invalid */
}
```