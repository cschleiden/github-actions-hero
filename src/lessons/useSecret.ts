import { StepType } from "github-actions-interpreter";
import { Lesson } from "./lesson";

const DeploymentKey = "aGVsbG8hIHRoaXMgaXMgYSB2ZXJ5IHNlY3JldCB0b2tlbg==";

export const useSecret: Lesson = {
  title: `Use secrets`,

  description: `[Secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) are encrypted environment variables that you create in a repository or organization. The secrets you create are then available to use in GitHub Actions workflows.

They are automatically masked in logs and are the safest way or providing keys or deployment tokens to your workflows. They can be accessed using the [\`secrets\`](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#contexts) context from an expression:

\`\`\`yaml
- run: echo $SECRET
  env:
    SECRET: \${{ secrets.MY_SECRET }}
\`\`\`

For this lesson, replace the hard-coded cloud token with a secret called \`DEPLOYMENT_KEY\``,

  workflow: `name: Checkout

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Build
      run: ./build.sh

    - name: Deploy
%      run: ./deploy --cloud-token=${DeploymentKey}
%
`,

  events: [
    {
      event: "push",
    },
  ],

  contexts: {
    secrets: {
      DEPLOYMENT_KEY: DeploymentKey,
    },
  },

  success: (r) =>
    r.some((x) => {
      const job = x.jobs.find((j) => j.name == "build");
      if (!job) {
        return false;
      }

      return job.steps.some((s) => {
        // Check for a set environment variable
        const envKey = Object.keys(s.env).find(
          (k) => s.env[k] === DeploymentKey
        );

        if (!envKey || !envKey.length) {
          return false;
        }

        // Check for a step using it
        return (
          s.stepType === StepType.Run && s.run.indexOf(`$${envKey[0]}`) >= 0
        );
      });
    }),
};
