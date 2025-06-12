import { roadmapData } from "@/app/roadmap/data/roadmapData";
import { Module } from "@/app/roadmap/types";

export type AgentStatus = Module["status"];

export function updateAgentStatus(moduleName: string, status: AgentStatus, progress?: number, error?: string) {
  // Find the module in roadmapData
  const module = roadmapData.modules.find((m) => m.name === moduleName);
  if (!module) return false;
  module.status = status;
  if (typeof progress === "number") module.progress = progress;
  if (error && "error" in module) (module as any).error = error;
  // Optionally: log update, trigger UI refresh, notify dashboard, etc.
  return true;
} 