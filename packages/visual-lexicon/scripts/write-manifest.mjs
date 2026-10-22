import {writeFile} from "node:fs/promises";
import {VISUAL_CONCEPTS} from "../dist/catalog.js";
import {JAPANESE_VISUAL_BINDINGS} from "../dist/japanese.js";
import {CHINESE_VISUAL_BINDINGS} from "../dist/chinese.js";
import {FRENCH_VISUAL_BINDINGS} from "../dist/french.js";
const manifest={schema:"thiepn-visual-lexicon-v1",version:"0.2.0",concepts:VISUAL_CONCEPTS,
 bindings:[...JAPANESE_VISUAL_BINDINGS,...CHINESE_VISUAL_BINDINGS,...FRENCH_VISUAL_BINDINGS]};
if(manifest.concepts.length!==103||manifest.bindings.length!==130)throw Error("Visual catalog mismatch");
await writeFile(new URL("../dist/visual-catalog.json",import.meta.url),JSON.stringify(manifest,null,2)+"\n","utf8");
