import { create, createStore, html } from "svenjs";
import { createMissionControl } from "../demos/mission-control/mission-control.js";
import { DemoNav } from "./demo-nav";

const MissionControl = createMissionControl({ create, createStore, html });

export const MissionControlPage = create({
  render() {
    return (
      <div>
        <DemoNav current="mission-control" />
        <MissionControl />
      </div>
    );
  },
});
