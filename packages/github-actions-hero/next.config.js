const withTranspileModules = require("next-transpile-modules");

module.exports = withTranspileModules({
  // To force Next.js to transpile code from other workspace packages.
  // https://github.com/martpie/next-transpile-modules
  transpileModules: ["github-actions-interpreter"],
  // Enforce relative paths for integration tests.
  // https://github.com/zeit/next.js/issues/2581
  assetPrefix: "./",
});
