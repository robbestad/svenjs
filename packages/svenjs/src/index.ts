import { create } from "./create";
import { h } from "./h";
import { html } from "./html";
import { flushSync, render, renderToString, unmountRoot } from "./runtime";
import { createStore } from "./store";
import { FRAGMENT } from "./types";
import { jsx, jsxDEV, jsxs } from "./jsx-runtime";

export const version = "3.0.1";

export { create, createStore, flushSync, FRAGMENT as Fragment, h, html, jsx, jsxDEV, jsxs, render, renderToString, unmountRoot };
export type { Component, ComponentSpec, JSX, Key, Props, SvenComponent, VNode } from "./types";
export type { Store, StoreSpec } from "./store";

const Svenjs = {
  version,
  create,
  createStore,
  render,
  renderToString,
  flushSync,
  h,
  html,
  jsx,
  jsxs,
  jsxDEV,
  Fragment: FRAGMENT,
  unmountRoot,
};

export default Svenjs;
