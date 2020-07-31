const { fixBabelImports, override } = require("customize-cra");

module.exports = override(
  fixBabelImports(
    "@material-ui/core",
    {
      libraryName: "@material-ui/core",
      libraryDirectory: "esm",
      camel2DashComponentName: false,
    },
    "core"
  ),
  fixBabelImports(
    "@material-ui/icons",
    {
      libraryName: "@material-ui/icons",
      libraryDirectory: "esm",
      camel2DashComponentName: false,
    },
    "icons"
  ),
  fixBabelImports(
    "@material-ui/lab",
    {
      libraryName: "@material-ui/lab",
      libraryDirectory: "esm",
      camel2DashComponentName: false,
    },
    "lab"
  )
);
