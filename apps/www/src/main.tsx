import { hydrate } from "svenjs";
import { App } from "./app";
import "./styles/app.css";

hydrate(<App initialUrl={location.pathname} />, document.getElementById("app"));
