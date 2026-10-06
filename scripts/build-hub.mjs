import {cp,copyFile,mkdir,rm,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import path from "node:path";
import {build as viteBuild} from "vite";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const source=path.join(root,"apps","hub","public");
const dist=path.join(root,"dist","hub");
const vendor=path.join(dist,"vendor");
const callback=path.join(dist,"auth","callback");

await rm(dist,{recursive:true,force:true});
await mkdir(vendor,{recursive:true});
await mkdir(callback,{recursive:true});
await cp(source,dist,{recursive:true});
await copyFile(path.join(root,"packages","read-model","dist","browser.js"),path.join(vendor,"language-read-model.js"));
await copyFile(path.join(root,"packages","dashboard","dist","browser.js"),path.join(vendor,"language-dashboard.js"));
await copyFile(path.join(root,"packages","shell","dist","browser.js"),path.join(vendor,"language-shell.js"));

await copyFile(path.join(dist,"index.html"),path.join(callback,"index.html"));

await viteBuild({
  configFile:false,
  logLevel:"warn",
  build:{
    target:"es2022",
    outDir:vendor,
    emptyOutDir:false,
    sourcemap:false,
    minify:true,
    lib:{
      entry:path.join(root,"apps","hub","src","account-session.ts"),
      name:"ThiepnLanguagesAccountSessionBundle",
      formats:["iife"],
      fileName:()=>"account-session.js"
    },
    rollupOptions:{
      output:{inlineDynamicImports:true}
    }
  }
});

await writeFile(path.join(dist,"hub-build.json"),JSON.stringify({
  product:"thiepn-languages-hub",
  version:"0.12.0",
  shellContract:"p10-shell-v1",
  accountSessionContract:"first-party-sso-v1",
  canonicalOrigin:"https://languages.thiepn.dev",
  generatedAt:new Date().toISOString()
},null,2)+"\n");
console.log("Built dist/hub");
