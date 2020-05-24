import { Lesson } from "./lesson";

export const runShellScript: Lesson = {
  title: `Execute shell scripts`,

  description: `So far our workflows have just \`echo\`'d \`"Success!\`. That's great but doesn't provide that much value. Often you want build some code, or deploy a service. With [\`run\`](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsrun) steps you can execute arbitrary shell commands.

As an example, let's have our workflow execute the \`./scriptDeploy.sh\` shell script.`,

  workflow: `name: Deploy

on: [push]

jobs:
  execute:
    runs-on: ubuntu-latest
    steps:
%    %

`,

  events: [
    {
      event: "push",
    },
  ],

  success: `./scriptDeploy.sh`,
};
