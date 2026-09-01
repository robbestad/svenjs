import type { SvenComponent } from "svenjs";

type MissionApi = Pick<typeof import("svenjs"), "create" | "createStore" | "html">;

export function createMissionControl(api: MissionApi): SvenComponent<{ standalone?: boolean }>;
