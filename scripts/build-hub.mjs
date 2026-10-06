import {cp,copyFile,mkdir,rm,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import path from "node:path";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const source=path.join(root,"apps","hub","public");
const dist=path.join(root,"dist","hub");
const vendor=path.join(dist,"vendor");

await rm(dist,{recursive:true,force:true});
await mkdir(vendor,{recursive:true});
await cp(source,dist,{recursive:true});
await copyFile(path.join(root,"packages","read-model","dist","browser.js"),path.join(vendor,"language-read-model.js"));
await copyFile(path.join(root,"packages","dashboard","dist","browser.js"),path.join(vendor,"language-dashboard.js"));
await copyFile(path.join(root,"packages","shell","dist","browser.js"),path.join(vendor,"language-shell.js"));
await writeFile(path.join(dist,"hub-build.json"),JSON.stringify({
  product:"thiepn-languages-hub",
  version:"0.10.0",
  shellContract:"p10-shell-v1",
  generatedAt:new Date().toISOString()
},null,2)+"\n");
console.log("Built dist/hub");
