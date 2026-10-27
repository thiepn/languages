import {test,expect,type Page} from "@playwright/test";
const cases=[
 {title:"Reconstructing a new group orientation",
  guided:"我",cloze:"我们",repairWrong:"我们",repair:"你们",
  reconWrong:"我们",recon:"你们",reading:"你们",depthRead:"我",roleRead:"我们",
  tokens:["你们","我","我们"],expected:["我","我们","你们"],wrongOrder:["你们","我们","我"],
  shifted:"你们",situation:"你们",tone:"nǐmen",
  error:"我们 (wǒmen) refers to a group including the speaker."},
 {title:"Sequencing a tea question and a fruit description",
  guided:"你喜欢喝茶吗？",cloze:"吗",repairWrong:"你喜欢喝茶吗？",repair:"你好",
  reconWrong:"这个苹果很好吃。",recon:"你喜欢喝茶吗？",reading:"这个苹果很好吃。",depthRead:"这个苹果很好吃。",roleRead:"你好",
  tokens:["这个苹果很好吃。","你好","你喜欢喝茶吗？"],
  expected:["你好","你喜欢喝茶吗？","这个苹果很好吃。"],
  wrongOrder:["你好","这个苹果很好吃。","你喜欢喝茶吗？"],
  shifted:"这个苹果很好吃。",situation:"这个苹果很好吃。",tone:"Nǐ xǐhuan hē chá ma?",
  error:"The tea sentence asks about a drink"},
 {title:"Ordering identity statements before a role correction",
  guided:"他是老师。",cloze:"是",repairWrong:"我是学生。",repair:"他是老师。",
  reconWrong:"他是老师。",recon:"我是学生。",reading:"我是学生。",depthRead:"我是学生。",roleRead:"他是老师。",
  tokens:["不是","他是老师。","我是学生。"],
  expected:["我是学生。","他是老师。","不是"],wrongOrder:["他是老师。","我是学生。","不是"],
  shifted:"他是老师。",situation:"不是",tone:"Tā shì lǎoshī.",
  error:"我是学生。 describes the speaker as a student."},
 {title:"Separating badge ownership, denial and shared identity",
  guided:"我的",cloze:"我的",repairWrong:"我的",repair:"不是",
  reconWrong:"不是",recon:"我的",reading:"不是",depthRead:"也是",roleRead:"不是",
  tokens:["不是","也是","我的"],
  expected:["我的","不是","也是"],wrongOrder:["我的","也是","不是"],
  shifted:"也是",situation:"也是",tone:"bú shì",
  error:"我的 identifies possession of an item."}
] as const;
type C=typeof cases[number];
async function choose(page:Page,answer:string){
 await page.getByRole("radio",{name:answer,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
}
async function typed(page:Page,answer:string){
 await page.getByRole("textbox",{name:"Your answer"}).fill(answer);
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
}
async function failedChoice(page:Page,wrong:string,correct:string,feedback?:string){
 await page.getByRole("radio",{name:wrong,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 if(feedback)await expect(page.locator(".feedback.incorrect")).toContainText(feedback);
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await page.getByRole("button",{name:"Try again"}).click();
 await choose(page,correct);
}
async function selectOrder(page:Page,tokens:readonly string[]){
 for(const quote of tokens)await page.getByRole("button",{name:"Add "+quote,exact:true}).click();
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
 await choose(page,c.guided);
 await typed(page,c.cloze);
 await failedChoice(page,c.repairWrong,c.repair,c.error);
 await page.getByRole("textbox",{name:"Your answer"}).fill(c.reconWrong);
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await expect(page.locator(".source-aid")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await typed(page,c.recon);
 await expect(page.locator(".reading-passage")).toBeVisible();
 await choose(page,c.reading);
 await expect(page.locator(".reading-passage")).toContainText("New practice situation (not a source transcript):");
 await choose(page,c.depthRead);
 await expect(page.locator(".reading-passage")).toContainText("New changed-role context (not an original source conversation):");
 await choose(page,c.roleRead);
 await expect(page.locator(".order-activity")).toBeVisible();
 await selectOrder(page,c.wrongOrder);
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await expect(page.locator(".source-aid")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await selectOrder(page,c.expected);
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
 await expect(page.locator(".reading-passage")).toContainText("New authored follow-up, not a source dialogue:");
 await choose(page,c.shifted);
 await choose(page,c.situation);
 await page.getByRole("textbox",{name:"Your answer"}).fill(c.tone.normalize("NFD").replace(/[\u0300-\u036f]/gu,""));
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await typed(page,c.tone);
 for(let i=1;i<=4;i++){
  await page.getByRole("textbox",{name:"Your response"}).fill("第"+i+"段独立中文对话：调整角色、听者与问题情境。");
  await page.getByRole("button",{name:"Review writing"}).click();
  await expect(page.getByText("Ungraded practice")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
 }
 await page.getByRole("button",{name:"Finish preview"}).click();
 await expect(page.getByText("Preview complete")).toBeVisible();
 await page.getByRole("button",{name:"Back to Course"}).click();
 await expect(page.getByRole("heading",{name:"Course"})).toBeVisible();
 await expect(page.locator(".course-sequence li")).toHaveCount(4);
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 const keys=await page.evaluate(()=>Array.from({length:sessionStorage.length},(_,i)=>sessionStorage.key(i)));
 expect(keys.some(k=>k?.includes("phase28-"))).toBe(false);
}
for(const c of cases){
 test("Phase 28 ordered original Chinese snippets, wrong-source repair and fourth independent dialogue: "+c.title,async({page})=>{
  await journey(page,c);
 });
}
test("Phase 28 320px source-order reconstruction and four independently authored dialogues remain legible and ephemeral",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await journey(page,cases[1]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 await page.reload();
 await expect(page.getByRole("heading",{name:"Home"})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
});
