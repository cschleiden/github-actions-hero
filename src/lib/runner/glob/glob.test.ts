import { filterPaths, match } from "./glob";

describe("glob", () => {
  it("branches and tags", () => {
    expect(match("feature/*", "feature/my-branch")).toBeTruthy();
    expect(match("feature/*", "feature/your-branch")).toBeTruthy();

    expect(match("feature/**", "feature/your-branch/my-branch")).toBeTruthy();

    expect(match("master", "master")).toBeTruthy();
    expect(
      match("releases/mona-the-octocat", "releases/mona-the-octocat")
    ).toBeTruthy();

    expect(match("'*'", "master")).toBeTruthy();
    expect(match("'*'", "master/foo")).toBeFalsy();
    expect(match("'*'", "releases")).toBeTruthy();

    expect(match("'**'", "all/the/branches")).toBeTruthy();
    expect(match("'**'", "every/tag")).toBeTruthy();

    expect(match("'*feature'", "mona-feature")).toBeTruthy();
    expect(match("'*feature'", "feature")).toBeTruthy();
    expect(match("'*feature'", "ver-10-feature")).toBeTruthy();

    expect(match("v2*", "v2")).toBeTruthy();
    expect(match("v2*", "v2.0")).toBeTruthy();
    expect(match("v2*", "v2.9")).toBeTruthy();

    expect(match("[0-9]{1,2}", "12")).toBeTruthy();

    expect(match("v[12].[0-9]+.[0-9]+", "v1.10.1")).toBeTruthy();
    expect(match("v[12].[0-9]+.[0-9]+", "v2.0.0")).toBeTruthy();
  });

  it("file paths", () => {
    expect(match("'*'", "README.md")).toBeTruthy();
    expect(match("'*'", "server.rb")).toBeTruthy();

    // Not supported for now.
    // expect(match("'*.jsx?'", "page.js")).toBeTruthy();
    // expect(match("'*.jsx?'", "page.jsx")).toBeTruthy();

    expect(match("'**'", "all/the/files.md")).toBeTruthy();

    expect(match("'*.js'", "app.js")).toBeTruthy();
    expect(match("'*.js'", "src/app.js")).toBeFalsy();

    expect(match("'**.js'", "app.js")).toBeTruthy();
    expect(match("'**.js'", "src/app.js")).toBeTruthy();

    expect(match("'docs/*'", "docs/README.md")).toBeTruthy();
    expect(match("'docs/*'", "docs/file.txt")).toBeTruthy();

    expect(match("'docs/**'", "docs/file.txt")).toBeTruthy();
    expect(match("'docs/**'", "docs/file/file.txt")).toBeTruthy();

    expect(match("'docs/**/*.md'", "docs/file/file.md")).toBeTruthy();
    expect(match("'docs/**/*.md'", "docs/file/file.txt")).toBeFalsy();

    expect(match("'**/docs/**'", "/docs/hello.md")).toBeTruthy();
    expect(match("'**/docs/**'", "dir/docs/my-file.txt")).toBeTruthy();
    expect(match("'**/docs/**'", "space/docs/plan/space.doc")).toBeTruthy();

    expect(match("'**/README.md'", "README.md")).toBeTruthy();
    expect(match("'**/README.md'", "js/README.md")).toBeTruthy();

    expect(match("'**/*src/**'", "a/src/app.js")).toBeTruthy();
    expect(match("'**/*src/**'", "my-src/code/js/app.js")).toBeTruthy();

    expect(match("'**/*-post.md'", "my-post.md")).toBeTruthy();
    expect(match("'**/*-post.md'", "path/their-post.md")).toBeTruthy();

    expect(match("'**/migrate-*.sql'", "migrate-10909.sql")).toBeTruthy();
    expect(match("'**/migrate-*.sql'", "db/migrate-v1.0.sql")).toBeTruthy();
    expect(match("'**/migrate-*.sql'", "db/sept/migrate-v1.sql")).toBeTruthy();

    expect(match("'*.md'", "hello.md")).toBeTruthy();
    expect(match("'*.md'", "README.md")).toBeTruthy();
  });

  it("filter paths", () => {
    expect(
      filterPaths(
        ["'sub-project/**'", "'!sub-project/docs/**'"],
        "sub-project/index.js"
      )
    ).toBeTruthy();

    expect(
      filterPaths(
        ["'sub-project/**'", "'!sub-project/docs/**'"],
        "sub-project/src/index.js"
      )
    ).toBeTruthy();

    expect(
      filterPaths(
        ["'sub-project/**'", "'!sub-project/docs/**'"],
        "sub-project/docs/readme.md"
      )
    ).toBeFalsy();
  });
});
