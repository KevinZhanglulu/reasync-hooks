import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "src/index.ts",
    output: [
      // ES
      {
        file: pkg.module,
        format: "es"
      },
      // UMD Development
      {
        file: pkg.unpkg,
        format: "umd",
        name: "ReactReduxAsyncHooks",
        indent: false,
        globals: {
          react: "React",
          "react-redux": "ReactRedux"
        }
      },
      // UMD Production
      {
        file: pkg.unpkg.replace(".js", ".min.js"),
        format: "umd",
        name: "ReactReduxAsyncHooks",
        indent: false,
        globals: {
          react: "React",
          "react-redux": "ReactRedux"
        }
      }
    ],
    external: [
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      typescript({
        typescript: require("typescript")
      }),
      terser({
        include: [/^.+\.min\.js$/],
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  },
  {
    input: "src/index.ts",
    output: [
      //CommonJS
      {
        file: pkg.main,
        format: "cjs"
      }
    ],
    external: [
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      typescript({
        typescript: require("typescript"),
        tsconfigOverride: {
          compilerOptions: { declaration: true }
        }
      })
    ]
  }
];
