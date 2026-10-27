import {test,expect,type Page} from "@playwright/test";
const cases=[
 {title:"Switching who speaks for a study group",guided:"我们",cloze:"我们",
  repairWrong:"我们",repair:"你们",reconstructWrong:"我们",reconstruct:"你们",
  reading:"你们",contextRead:"我",roleWrong:"你们",role:"我们",situation:"你们",tone:"wǒmen",
  correction:"我们 (wǒmen) includes the speaker's group."},
 {title:"Identifying a speaker, teacher and shared identity",guided:"他是老师。",cloze:"是",
  repairWrong:"我是学生。",repair:"他是老师。",reconstructWrong:"他是老师。",reconstruct:"我是学生。",
  reading:"我是学生。",contextRead:"我是学生。",roleWrong:"我是学生。",role:"他是老师。",situation:"也是",tone:"Tā shì lǎoshī.",
  correction:"我是学生。 is first-person student identity."},
 {title:"Reconstructing a drink question versus a food statement",guided:"你喜欢喝茶吗？",cloze:"吗",
  repairWrong:"这个苹果很好吃。",repair:"你喜欢喝茶吗？",reconstructWrong:"这个苹果很好吃。",reconstruct:"你喜欢喝茶吗？",
  reading:"这个苹果很好吃。",contextRead:"这个苹果很好吃。",roleWrong:"你喜欢喝茶吗？",role:"你好",situation:"这个苹果很好吃。",tone:"Nǐ xǐhuan hē chá ma?",
  correction:"这个苹果很好吃。 reports that an apple is tasty"},
 {title:"Ownership, denial and additional identity",guided:"我的",cloze:"我的",
  repairWrong:"不是",repair:"我的",reconstructWrong:"不是",reconstruct:"也是",
  reading:"不是",contextRead:"不是",roleWrong:"我的",role:"不是",situation:"也是",tone:"bú shì",
  correction:"不是 negates an identity claim."}
] as const;
type Scenario=typeof cases[number];

async function choose(page:Page,text:string){
 await page.getByRole("radio",{name:text,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
}
async function typed(page:Page,value:string){
 await page.getByRole("textbox",{name:"Your answer"}).fill(value);
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
}
async function incorrectChoice(page:Page,wrong:string,correct:string,detail?:string){
 await page.getByRole("radio",{name:wrong,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 if(detail)await expect(page.locator(".feedback.incorrect")).toContainText(detail);
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await page.getByRole("button",{name:"Try again"}).click();
 await choose(page,correct);
}
async function journey(page:Page,c:Scenario){
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 await expect(page.locator(".course-sequence li")).toHaveCount(4);
 await page.getByRole("button",{name:"Preview editorial draft: "+c.title}).click();
 await expect(page.getByRole("heading",{name:c.title})).toBeVisible();
 for(let i=0;i<4;i++)await page.getByRole("button",{name:"Continue"}).click();
 await choose(page,c.guided);
 await typed(page,c.cloze);
 await incorrectChoice(page,c.repairWrong,c.repair,c.correction);
 await page.getByRole("textbox",{name:"Your answer"}).fill(c.reconstructWrong);
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await expect(page.locator(".source-aid")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await typed(page,c.reconstruct);
 await expect(page.locator(".reading-passage")).toBeVisible();
 await choose(page,c.reading);
 await expect(page.locator(".reading-passage")).toContainText("New practice situation (not a source transcript):");
 await choose(page,c.contextRead);
 await expect(page.locator(".reading-passage")).toContainText("New changed-role context (not an original source conversation):");
 await incorrectChoice(page,c.roleWrong,c.role);
 await choose(page,c.situation);
 const plain=c.tone.normalize("NFD").replace(/[\u0300-\u036f]/gu,"");
 await page.getByRole("textbox",{name:"Your answer"}).fill(plain);
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await typed(page,c.tone);
 const independent=page.getByRole("textbox",{name:"Your response"});
 for(let i=1;i<=3;i++){
  await independent.fill("第"+i+"段独立对话：你好。我是学生。另有不同角色与语境。");
  await page.getByRole("button",{name:"Review writing"}).click();
  await expect(page.getByText("Ungraded practice")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
 }
 // The final authored reflection frame precedes the volatile preview-complete state.
 await page.getByRole("button",{name:"Finish preview"}).click();
 await expect(page.getByText("Preview complete")).toBeVisible();
 await page.getByRole("button",{name:"Back to Course"}).click();
 await expect(page.getByRole("heading",{name:"Course"})).toBeVisible();
 await expect(page.locator(".course-sequence li")).toHaveCount(4);
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 const keys=await page.evaluate(()=>Array.from({length:sessionStorage.length},(_,i)=>sessionStorage.key(i)));
 expect(keys.some(k=>k?.includes("phase27-"))).toBe(false);
}
for(const c of cases){
 test("Phase 27 Chinese exact-source reconstruction, role switch and third independent writing: "+c.title,async({page})=>{
  await journey(page,c);
 });
}
test("Phase 27 320px source identity and third independent dialogue have no horizontal clipping or retained candidate history",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await journey(page,cases[2]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 await page.reload();
 await expect(page.getByRole("heading",{name:"Home"})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
});
