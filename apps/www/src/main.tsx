import { hydrate } from "svenjs";
import { App } from "./app";
import { loadRoute } from "./lib/site";
import "./styles/app.css";

const url = location.pathname + location.search;
void loadRoute(location.pathname).then(() => {
  hydrate(<App initialUrl={url} />, document.getElementById("app"));
});
