import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default {
	input: "src/index.js", // or index.ts if using TS
	output: [
		{
			file: "dist/index.js",
			format: "cjs",
			exports: "named",
		},
		{
			file: "dist/index.esm.js",
			format: "esm",
		},
	],
	plugins: [
		peerDepsExternal(),
		resolve(),
		commonjs(),
		babel({ presets: ["@babel/preset-react"] }),
	],
};
