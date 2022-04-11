import { reactive } from "vue";
import { SolveProgress } from "@/lib/solver/base/SolveProgress";

const logs = reactive<SolveProgress[][]>([]);

function log(progress: SolveProgress) {
  logs[logs.length - 1].push(progress);
}

function startGroup() {
  logs.push([]);
}

export function useLogs() {
  return {
    logs,
    startGroup,
    log,
  }
}