import {
  assertStrictEq,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { parse } from "../mod.ts";

const { test } = Deno;

const invalidTypes = [
  " ",
  "null",
  "undefined",
  "/",
  "text / plain",
  "text/;plain",
  'text/"plain"',
  "text/p£ain",
  "text/(plain)",
  "text/@plain",
  "text/plain,wrong",
];

test("parse(string) should parse basic type", () => {
  const type = parse("text/html");
  assertStrictEq(type.type, "text/html");
});

test("parse(string) should parse with suffix", () => {
  const type = parse("image/svg+xml");
  assertStrictEq(type.type, "image/svg+xml");
});

test("parse(string) should parse basic type with surrounding OWS", () => {
  const type = parse(" text/html ");
  assertStrictEq(type.type, "text/html");
});

test("parse(string) should parse parameters", () => {
  const type = parse("text/html; charset=utf-8; foo=bar");
  assertStrictEq(type.type, "text/html");
  assertEquals(type.parameters, {
    charset: "utf-8",
    foo: "bar",
  });
});

test("parse(string) should parse parameters with extra LWS", () => {
  const type = parse("text/html ; charset=utf-8 ; foo=bar");
  assertStrictEq(type.type, "text/html");
  assertEquals(type.parameters, {
    charset: "utf-8",
    foo: "bar",
  });
});

test("parse(string) should lower-case type", () => {
  const type = parse("IMAGE/SVG+XML");
  assertStrictEq(type.type, "image/svg+xml");
});

test("parse(string) should lower-case parameter names", () => {
  const type = parse("text/html; Charset=UTF-8");
  assertStrictEq(type.type, "text/html");
  assertEquals(type.parameters, {
    charset: "UTF-8",
  });
});

test("parse(string) should unquote parameter values", () => {
  const type = parse('text/html; charset="UTF-8"');
  assertStrictEq(type.type, "text/html");
  assertEquals(type.parameters, {
    charset: "UTF-8",
  });
});

test("parse(string) should unquote parameter values with escapes", () => {
  const type = parse('text/html; charset = "UT\\F-\\\\\\"8\\""');
  assertStrictEq(type.type, "text/html");
  assertEquals(type.parameters, {
    charset: 'UTF-\\"8"',
  });
});

test("parse(string) should handle balanced quotes", () => {
  const type = parse(
    'text/html; param="charset=\\"utf-8\\"; foo=bar"; bar=foo',
  );
  assertStrictEq(type.type, "text/html");
  assertEquals(type.parameters, {
    param: 'charset="utf-8"; foo=bar',
    bar: "foo",
  });
});

invalidTypes.forEach(function (type) {
  test("parse(string) should throw on invalid media type " + type, () => {
    assertThrows(parse.bind(null, type), TypeError, "invalid media type");
  });
});

test("parse(string) should throw on invalid parameter format", () => {
  assertThrows(
    parse.bind(null, 'text/plain; foo="bar'),
    TypeError,
    "invalid parameter format",
  );
  assertThrows(
    parse.bind(null, "text/plain; profile=http://localhost; foo=bar"),
    TypeError,
    "invalid parameter format",
  );
  assertThrows(
    parse.bind(null, "text/plain; profile=http://localhost"),
    TypeError,
    "invalid parameter format",
  );
});
