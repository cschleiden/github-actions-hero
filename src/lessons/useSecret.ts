import { Lesson } from "./lesson";

const DeploymentKey = "aGVsbG8hIHRoaXMgaXMgYSB2ZXJ5IHNlY3JldCB0b2tlbg==";

export const useSecret: Lesson = {
  title: `Use secrets`,

  description: `Often you need a token. For this lesson, assume a secret with the name \`DEPLOYMENT_KEY\` has been defined. Use it to deploy the project.`,

  workflow: `name: Checkout

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Build
      run: ./build.sh

    - name: Deploy
%      run: ./deploy --cloud-token=aGVsbG8hIHRoaXMgaXMgYSB2ZXJ5IHNlY3JldCB0b2tlbg==
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

      return job.steps.some((s) =>
        Object.keys(s.env).some((k) => s.env[k] === DeploymentKey)
      );
    }),
};
