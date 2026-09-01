import htm from "htm";
import { h } from "./h";

/** Tagged template that builds the same vnodes as JSX. Works in a script tag — no compiler. */
export const html = htm.bind(h);
