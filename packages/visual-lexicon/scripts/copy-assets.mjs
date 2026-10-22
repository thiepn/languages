/** Explicit local-only consumer export. Run after pnpm --filter @thiepn/visual-lexicon build. */
import {createHash} from "node:crypto";
import {copyFile,mkdir,readFile,writeFile} from "node:fs/promises";
import {resolve,join} from "node:path";
import {fileURLToPath} from "node:url";
import {VISUAL_CONCEPTS} from "../dist/catalog.js";
const dest=process.argv[2]==="--"?process.argv[3]:process.argv[2];
if(!dest||dest.startsWith("-"))throw Error("Usage: node scripts/copy-assets.mjs <app-static-directory>/visual-lexicon");
const target=resolve(dest);
const images=await Promise.all(VISUAL_CONCEPTS.map(async image=>{
 if(!/^[a-z0-9-]+\.svg$/.test(image.asset))throw Error("Invalid asset name: "+image.asset);
 const original=new URL("../assets/"+image.asset,import.meta.url);
 const bytes=await readFile(original);
 const blob=createHash("sha1").update("blob "+bytes.length+"\0").update(bytes).digest("hex");
 if(blob!==image.origin.blobSha)throw Error("Original SVG integrity mismatch: "+image.asset);
 return {asset:image.asset,original,bytes};
}));
const manifest=await readFile(new URL("../dist/visual-catalog.json",import.meta.url));
const parsed=JSON.parse(manifest.toString("utf8"));
if(parsed.schema!=="thiepn-visual-lexicon-v1"||parsed.concepts.length!==103||parsed.bindings.length!==115)
 throw Error("Visual manifest missing or incomplete");
await mkdir(join(target,"assets"),{recursive:true});
for(const item of images)await copyFile(fileURLToPath(item.original),join(target,"assets",item.asset));
await writeFile(join(target,"visual-catalog.json"),manifest);
console.log("Copied "+images.length+" verified local SVGs to "+target);
