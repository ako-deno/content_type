# content_type

[![tag](https://img.shields.io/github/tag/ako-deno/content_type.svg)](https://github.com/ako-deno/content_type/tags)
![content_type-ci](https://github.com/ako-deno/content_type/workflows/content_type-ci/badge.svg)
[![HitCount](http://hits.dwyl.com/ako-deno/content_type.svg)](http://hits.dwyl.com/ako-deno/content_type)

Create and parse HTTP Content-Type header according to RFC 7231 for Deno, compatible with Browser. Based on `https://github.com/jshttp/content-type`.

## API
```js
import { format, parse, ContentType, Parameters }  from "https://deno.land/x/content_type/mod.ts";
```

### parse(str: string): ContentType

```js
let obj = parse('image/svg+xml; charset=utf-8');
```

Parse a `Content-Type` header. This will return an object with the following
properties (examples are shown for the string `'image/svg+xml; charset=utf-8'`):

 - `type`: The media type (the type and subtype, always lower case).
   Example: `'image/svg+xml'`

 - `parameters`: An object of the parameters in the media type (name of parameter
   always lower case). Example: `{charset: 'utf-8'}`

Throws a `TypeError` if the string is missing or invalid.

### format(obj: ContentType): string

```js
let str = format({
  type: 'image/svg+xml',
  parameters: { charset: 'utf-8' }
});
```

Format an object into a `Content-Type` header. This will return a string of the
content type for the given object with the following properties (examples are
shown that produce the string `'image/svg+xml; charset=utf-8'`):

 - `type`: The media type (will be lower-cased). Example: `'image/svg+xml'`

 - `parameters`: An object of the parameters in the media type (name of the
   parameter will be lower-cased). Example: `{charset: 'utf-8'}`

Throws a `TypeError` if the object contains an invalid type or parameter names.

### ContentType && Parameters

```js
type Parameters = { [key: string]: string };

interface ContentType {
  type: string;
  parameters?: Parameters;
}
```

# License

[MIT](./LICENSE)
