import {test,expect,type Page} from "@playwright/test";
const samples=[
 {title:"Two visiting groups change the speaker",guided:"我",cloze:"我们",
  repair:"你们",reconstruct:"你们",turn:"我们",wrongA:"你们",wrongB:"我",
  reading:"你们",depth:"我",role:"我们",
  oldOrder:["我","我们","你们"],shift:"你们",
  newOrder:["你们","我","我们"],final:"我",situation:"你们",tone:"nǐmen"},
 {title:"A returning buyer and a new tea guest",guided:"你喜欢喝茶吗？",cloze:"吗",
  repair:"你好",reconstruct:"你喜欢喝茶吗？",turn:"这个苹果很好吃。",wrongA:"你好",wrongB:"你喜欢喝茶吗？",
  reading:"这个苹果很好吃。",depth:"这个苹果很好吃。",role:"你好",
  oldOrder:["你好","你喜欢喝茶吗？","这个苹果很好吃。"],shift:"这个苹果很好吃。",
  newOrder:["这个苹果很好吃。","你好","你喜欢喝茶吗？"],final:"你好",situation:"这个苹果很好吃。",tone:"Nǐ xǐhuan hē chá ma?"},
 {title:"A visitor corrects a mistaken school role",guided:"他是老师。",cloze:"是",
  repair:"他是老师。",reconstruct:"我是学生。",turn:"不是",wrongA:"他是老师。",wrongB:"我是学生。",
  reading:"我是学生。",depth:"我是学生。",role:"他是老师。",
  oldOrder:["我是学生。","他是老师。","不是"],shift:"他是老师。",
  newOrder:["他是老师。","不是","我是学生。"],final:"我是学生。",situation:"不是",tone:"Tā shì lǎoshī."},
 {title:"A colleague's shared role before a badge check",guided:"我的",cloze:"我的",
  repair:"不是",reconstruct:"我的",turn:"也是",wrongA:"不是",wrongB:"我的",
  reading:"不是",depth:"也是",role:"不是",
  oldOrder:["我的","不是","也是"],shift:"也是",
  newOrder:["也是","我的","不是"],final:"我的",situation:"也是",tone:"bú shì"}
] as const;
type C=typeof samples[number];
async function choice(page:Page,answer:string){
 await page.getByRole("radio",{name:answer,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
}
async function fill(page:Page,answer:string){
 await page.getByRole("textbox",{name:"Your answer"}).fill(answer);
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
}
async function failedChoice(page:Page,wrong:string,correct:string){
 await page.getByRole("radio",{name:wrong,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await page.getByRole("button",{name:"Try again"}).click();
 await choice(page,correct);
}
async function order(page:Page,turns:readonly string[]){
 for(const turn of turns)await page.getByRole("button",{name:"Add "+turn,exact:true}).click();
 await page.getByRole("button",{name:"Check answer"}).click();
}
async function journey(page:Page,c:C){
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 await expect(page.locator(".course-sequence li")).toHaveCount(4);
 await page.getByRole("button",{name:"Preview editorial draft: "+c.title}).click();
 await expect(page.getByRole("heading",{name:c.title})).toBeVisible();
 for(let i=0;i<4;i++)await page.getByRole("button",{name:"Continue"}).click();
 await choice(page,c.guided);
 await fill(page,c.cloze);
 await choice(page,c.repair);
 await fill(page,c.reconstruct);
 // Two independently authored misconception cases lead to separate source-specific repair,
 // and neither incorrect source answer can advance the original player.
 await failedChoice(page,c.wrongA,c.turn);
 await expect(page.locator(".reading-passage")).toBeVisible();
 await choice(page,c.reading);
 await expect(page.locator(".reading-passage")).toContainText("New practice situation (not a source transcript):");
 await choice(page,c.depth);
 await expect(page.locator(".reading-passage")).toContainText("New changed-role context (not an original source conversation):");
 await choice(page,c.role);
 await expect(page.locator(".order-activity")).toBeVisible();
 await order(page,c.oldOrder);
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
 await expect(page.locator(".reading-passage")).toContainText("New authored follow-up, not a source dialogue:");
 await choice(page,c.shift);
 // Previously correct Phase 28 source ordering is now the wrong answer in the new scenario.
 await expect(page.locator(".order-activity")).toBeVisible();
 await order(page,c.oldOrder);
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await expect(page.locator(".source-aid")).toBeVisible();
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await page.getByRole("button",{name:"Try again"}).click();
 await order(page,c.newOrder);
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
 await expect(page.locator(".reading-passage")).toContainText("Independent changed-intention scene (new writing, not original dialogue):");
 await choice(page,c.final);
 await choice(page,c.situation);
 const unaccented=c.tone.normalize("NFD").replace(/[\u0300-\u036f]/gu,"");
 await page.getByRole("textbox",{name:"Your answer"}).fill(unaccented);
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await fill(page,c.tone);
 for(let i=1;i<=5;i++){
  await page.getByRole("textbox",{name:"Your response"}).fill("第"+i+"篇练习：新人物、更换听者与不同提问。");
  await page.getByRole("button",{name:"Review writing"}).click();
  await expect(page.getByText("Ungraded practice")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
 }
 await page.getByRole("button",{name:"Finish preview"}).click();
 await expect(page.getByRole("heading",{name:"Preview complete"})).toBeVisible();
 await page.getByRole("button",{name:"Back to Course"}).click();
 await expect(page.locator(".course-sequence li")).toHaveCount(4);
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 const keys=await page.evaluate(()=>Array.from({length:sessionStorage.length},(_,i)=>sessionStorage.key(i)));
 expect(keys.some(k=>k?.includes("phase29-"))).toBe(false);
}
for(const c of samples){
 test("Phase 29 Chinese original-source misconceptions, changed sequence and five ungraded dialogues: "+c.title,async({page})=>{
  await journey(page,c);
 });
}
test("Phase 29 320px learner dialogue revision, ordering repair and canonical return maintain accessibility and volatile candidate state",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await journey(page,samples[1]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 await page.reload();
 await expect(page.getByRole("heading",{name:"Home"})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
});
