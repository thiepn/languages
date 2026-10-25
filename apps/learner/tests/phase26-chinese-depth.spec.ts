import {test,expect,type Page} from "@playwright/test";

const cases=[
 {title:"Reading a café greeting and tea request",guided:"你喜欢喝茶吗？",cloze:"吗",wrong:"好吃",repair:"你好",
  reading:"你好",wrongReading:"你好",contextAnswer:"你喜欢喝茶吗？",situation:"好吃",tone:"Nǐ xǐhuan hē chá ma?",
  feedback:"好吃 describes food as tasty."},
 {title:"Correcting a mistaken student or teacher identity",guided:"我是学生。",cloze:"是",wrong:"我是学生。",repair:"他是老师。",
  reading:"他是老师。",wrongReading:"他是老师。",contextAnswer:"我是学生。",situation:"不是",tone:"bú shì",
  feedback:"The source line 我是学生。 describes the speaker as a student."},
 {title:"Changing group, listener and shared role",guided:"我们",cloze:"我们",wrong:"你们",repair:"我们",
  reading:"你们",wrongReading:"我们",contextAnswer:"你们",situation:"也是",tone:"nǐmen",
  feedback:"你们 (nǐmen) points to the group being addressed"},
 {title:"Reading a fruit description beyond the greeting",guided:"这个苹果很好吃。",cloze:"好吃",wrong:"你好",repair:"这个苹果很好吃。",
  reading:"好吃",wrongReading:"好吃",contextAnswer:"这个苹果很好吃。",situation:"好吃",tone:"Zhège píngguǒ hěn hǎochī.",
  feedback:"你好 (nǐ hǎo) is a greeting to a person."}
] as const;
type StudyCase=typeof cases[number];
async function answerChoice(page:Page,value:string){
 await page.getByRole("radio",{name:value,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
}
async function practiceCase(page:Page,c:StudyCase){
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 await expect(page.locator(".course-sequence li")).toHaveCount(4);
 await page.getByRole("button",{name:"Preview editorial draft: "+c.title}).click();
 await expect(page.getByRole("heading",{name:c.title})).toBeVisible();
 for(let i=0;i<4;i++)await page.getByRole("button",{name:"Continue"}).click();
 await answerChoice(page,c.guided);
 await page.getByRole("textbox",{name:"Your answer"}).fill(c.cloze);
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("radio",{name:c.wrong,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toContainText(c.feedback);
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await page.getByRole("button",{name:"Try again"}).click();
 await answerChoice(page,c.repair);
 await expect(page.locator(".reading-passage")).toBeVisible();
 await expect(page.locator(".reading-passage .reading")).toBeVisible();
 await answerChoice(page,c.reading);
 await expect(page.locator(".reading-passage")).toContainText("New practice situation (not a source transcript):");
 await page.getByRole("radio",{name:c.wrongReading,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await answerChoice(page,c.contextAnswer);
 await answerChoice(page,c.situation);
 const pinyin=page.getByRole("textbox",{name:"Your answer"});
 await pinyin.fill(c.tone.normalize("NFD").replace(/[\u0300-\u036f]/gu,""));
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await pinyin.fill(c.tone);
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
 const original=page.getByRole("textbox",{name:"Your response"});
 await original.fill("我写了第一段对话。根据原文调整语境。");
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
 const revised=page.getByRole("textbox",{name:"Your response"});
 await revised.fill("我为另一位听者重新写对话。保留原文与自编内容的区别。");
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByRole("button",{name:"← Course"}).click();
 await expect(page.getByRole("heading",{name:"Course"})).toBeVisible();
 await expect(page.locator(".course-sequence li")).toHaveCount(4);
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 const keys=await page.evaluate(()=>Array.from({length:sessionStorage.length},(_,i)=>sessionStorage.key(i)));
 expect(keys.some(k=>k?.includes("phase26-"))).toBe(false);
}
for(const c of cases){
 test("Phase 26 source correction, contextual reading and independent Chinese transfer: "+c.title,async({page})=>{
  await practiceCase(page,c);
 });
}
test("320px learner-authored Chinese reading, corrected interpretation and ungraded redraft fit viewport",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await practiceCase(page,cases[1]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 await page.reload();
 await expect(page.getByRole("heading",{name:"Home"})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
});
