import {
  assertStrictEquals,
  assertThrows,
} from "./deps.ts";
import { format } from "../mod.ts";

const { test } = Deno;

test("format(obj) should format basic type", () => {
  const str = format({ type: "text/html" });
  assertStrictEquals(str, "text/html");
});

test("format(obj) should format type with suffix", () => {
  const str = format({ type: "image/svg+xml" });
  assertStrictEquals(str, "image/svg+xml");
});

test("format(obj) should format type with parameter", () => {
  const str = format({
    type: "text/html",
    parameters: { charset: "utf-8" },
  });
  assertStrictEquals(str, "text/html; charset=utf-8");
});

test("format(obj) should format type with parameter that needs quotes", () => {
  const str = format({
    type: "text/html",
    parameters: { foo: 'bar or "baz"' },
  });
  assertStrictEquals(str, 'text/html; foo="bar or \\"baz\\""');
});

test("format(obj) should format type with parameter with empty value", () => {
  const str = format({
    type: "text/html",
    parameters: { foo: "" },
  });
  assertStrictEquals(str, 'text/html; foo=""');
});

test("format(obj) should format type with multiple parameters", () => {
  const str = format({
    type: "text/html",
    parameters: { charset: "utf-8", foo: "bar", bar: "baz" },
  });
  assertStrictEquals(str, "text/html; bar=baz; charset=utf-8; foo=bar");
});

test("format(obj) should reject invalid type", () => {
  const obj = { type: "text/", parameters: { "foo": "bar" } };
  assertThrows(format.bind(null, obj), TypeError, "invalid type");
});

test("format(obj) should reject invalid type with LWS", () => {
  const obj = { type: " text/html", parameters: { "foo": "bar" } };
  assertThrows(format.bind(null, obj), TypeError, "invalid type");
});

test("format(obj) should reject invalid parameter name", () => {
  const obj = { type: "image/svg", parameters: { "foo/": "bar" } };
  assertThrows(format.bind(null, obj), TypeError, "invalid parameter name");
});

test("format(obj) should reject invalid parameter value", () => {
  const obj = { type: "image/svg", parameters: { "foo": "bar\u0000" } };
  assertThrows(format.bind(null, obj), TypeError, "invalid parameter value");
});
