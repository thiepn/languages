import {defineConfig} from "vite";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";

const appDir=fileURLToPath(new URL(".",import.meta.url));
export default defineConfig({
  root: appDir,
  base: "./",
  publicDir: false,
  server: {host:"127.0.0.1",port:5179,strictPort:true,fs:{allow:[resolve(appDir,"../..")]}},
  build: {outDir:resolve(appDir,"../../dist/learner-preview"),emptyOutDir:true,sourcemap:false,target:"es2022"}
});
