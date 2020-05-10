import { Lesson } from "./lesson";

export const filterByAction: Lesson = {
  title: `Filter by activity`,

  description: `Many events on GitHub can be further scoped down to certain activities. For example, you might want to run a workflow whenever an issue is \`created\`, but not when it's \`pinned\`, or a label is added (\`labeled\`), or it's \`transferred\`.

Events that support narrowing down the activities, accept a [\`types\`](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#onevent_nametypes) property.

Run the following workflow whenever one of the \`issues\` is \`opened\` or \`labeled\` but not when it's \`closed\``,

  workflow: `name: Issues

on:
  issues:
%    %

jobs:
  label-issues:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Success!"`,

  events: [
    {
      event: "issues",
      action: "opened",
    },
    {
      event: "issues",
      action: "labeled",
    },
    {
      event: "issues",
      action: "closed",
    },
  ],

  success: (r) => {
    return r.every(
      (x) =>
        x.event.event === "issues" &&
        ((["opened", "labeled"].includes(x.event.action) &&
          x.jobs.length > 0) ||
          (x.event.action === "closed" && x.jobs.length === 0))
    );
  },
};
