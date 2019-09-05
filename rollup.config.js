import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";

export default [
  //CommonJS
  {
    input: "src/index.ts",
    output: {
      file: pkg.main,
      format: "cjs"
    },
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
  },
  // ES
  {
    input: "src/index.ts",
    output: {
      file: pkg.module,
      format: "es"
    },
    external: [
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      typescript({
        typescript: require("typescript")
      })
    ]
  },
  // UMD Development
  {
    input: "src/index.ts",
    output: {
      file: pkg.unpkg,
      format: "umd",
      name: "ReactReduxAsyncHooks",
      indent: false,
      globals: {
        react: "React",
        "react-redux": "ReactRedux"
      }
    },
    external: [
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      typescript({
        typescript: require("typescript")
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development")
      })
    ]
  },
  // UMD Production
  {
    input: "src/index.ts",
    output: {
      file: pkg.unpkg.replace(".js", ".min.js"),
      format: "umd",
      name: "ReactReduxAsyncHooks",
      indent: false,
      globals: {
        react: "React",
        "react-redux": "ReactRedux"
      }
    },
    external: [
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      typescript({
        typescript: require("typescript")
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      })
    ]
  }
];
