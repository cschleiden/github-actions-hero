import { Lesson } from "./lesson";

export const filterByPaths: Lesson = {
  title: `Filter by paths`,

  description: `In addition to filtering by activities and branches you can also run workflows when specific files are changed - or not - with the [\`paths\` and \`paths-ignore\`](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#onpushpull_requestpaths) properties.

For this lesson, a workflow to optimize images should be run whenever a \`push\` to the repository includes \`.jpg\` files in the \`photos\` directory and not, when pictures are pushed in other locations.`,

  workflow: `name: Optimize images

on:
  push:
    paths:
%    - '**'%

jobs:
  optimize-images:
    runs-on: ubuntu-latest
    steps:
    - run: echo "Success!"`,

  events: [
    {
      event: "push",
      files: ["banner.jpg"],
    },
    {
      event: "push",
      files: ["photos/1.jpg", "photos/2.jpg"],
    },
    {
      event: "push",
      files: ["other-folder/btn.jpg", "asset/logo.png"],
    },
  ],

  success: (r) => {
    return (
      r
        .filter(
          (x) =>
            x.event.event === "push" &&
            x.event.files.some((f) => f.indexOf("photos") !== -1)
        )
        .every((x) => x.jobs.length > 0) &&
      r
        .filter(
          (x) =>
            x.event.event === "push" &&
            x.event.files.every((f) => f.indexOf("photos") === -1)
        )
        .every((x) => x.jobs.length === 0)
    );
  },
};
