import { IExpressionContext } from "../expressions/evaluator";
import { Conclusion, RuntimeJob, State } from "../runtimeModel";
import { Job } from "../workflow";
import { _ev, _evIf, _executeSteps } from "./runner";

function _executeJob(
  jobId: string,
  jobDef: Job,
  level: number,
  jobCtx: IExpressionContext
): RuntimeJob {
  let conclusion = Conclusion.Success;

  // Should we run this job?
  if (!!jobDef.if) {
    if (!_evIf(jobDef.if, jobCtx)) {
      conclusion = Conclusion.Skipped;
    }
  }

  return {
    id: jobId,
    runnerLabel: Array.isArray(jobDef["runs-on"])
      ? jobDef["runs-on"]
      : [jobDef["runs-on"]],
    name: _ev(jobDef.name, jobCtx) || jobId,
    steps: _executeSteps(jobDef.steps, jobCtx),
    state: State.Done,
    conclusion,
    level,
    dependsOn: Array.isArray(jobDef.needs) ? jobDef.needs : [jobDef.needs],
  };
}

export function executeJob(
  jobId: string,
  jobDef: Job,
  level: number,
  jobCtx: IExpressionContext
): RuntimeJob[] {
  if (!jobDef.strategy?.matrix) {
    return [_executeJob(jobId, jobDef, level, jobCtx)];
  }

  // Matrix job
  const keys = Object.keys(jobDef.strategy.matrix);
  const idx = keys.map((k) => ({
    key: k,
    idx: 0,
  }));

  let jobs: RuntimeJob[] = [];
  while (true) {
    // Generate job
    const name = `${_ev(jobDef.name, jobCtx) || jobId} (${idx
      .map((x) => jobDef.strategy.matrix[x.key][x.idx])
      .join(", ")})`;

    // TODO: Add ctx

    jobs.push(
      _executeJob(
        `${jobId}-${name}`,
        {
          ...jobDef,
          name,
        },
        level,
        {
          ...jobCtx,
          contexts: {
            ...jobCtx.contexts,
            matrix: {
              ...idx.reduce((m, x) => {
                m[x.key] = jobDef.strategy.matrix[x.key][x.idx];
                return m;
              }, {}),
            },
          },
        }
      )
    );

    //
    let advanced = false;
    for (let i = idx.length - 1; i >= 0; --i) {
      const it = idx[i];

      if (
        it.idx + 1 <
        ((Array.isArray(jobDef.strategy.matrix[it.key])
          ? jobDef.strategy.matrix[it.key]
          : [jobDef.strategy.matrix[it.key]]) as any[]).length
      ) {
        ++it.idx;
        advanced = true;
        break;
      } else {
        it.idx = 0;
      }
    }
    if (!advanced) {
      break;
    }
  }

  return jobs;
}
