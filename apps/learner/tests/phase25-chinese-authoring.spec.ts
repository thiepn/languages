import {test,expect} from "@playwright/test";
const lessons=[
 {title:"Greeting one person or addressing a group",guided:"你好",wrong:"我",cloze:"你好",read:"你们",situation:"你们",tone:"nǐ hǎo"},
 {title:"Introducing the speaker and the study group",guided:"我们",wrong:"我",cloze:"是",read:"我是学生。",situation:"我是学生。",tone:"wǒmen"},
 {title:"Possession and identifying a teacher",guided:"我的",wrong:"我是学生。",cloze:"我的",read:"他是老师。",situation:"他是老师。",tone:"wǒ de"},
 {title:"Identity, negation and also",guided:"不是",wrong:"也是",cloze:"不是",read:"也是",situation:"也是",tone:"bú shì"},
 {title:"Greeting and asking about tea",guided:"你好",wrong:"好吃",cloze:"吗",read:"你喜欢喝茶吗？",situation:"你喜欢喝茶吗？",tone:"Nǐ xǐhuan hē chá ma?"},
 {title:"Greeting and describing a tasty apple",guided:"好吃",wrong:"你好",cloze:"好吃",read:"这个苹果很好吃。",situation:"这个苹果很好吃。",tone:"Zhège píngguǒ hěn hǎochī."}
] as const;
for(const lesson of lessons){
 test("Phase 25 Chinese original source, tone-marked Pinyin and independent transfer: "+lesson.title,async({page})=>{
  await page.goto("/");
  await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
  await page.getByRole("button",{name:"Course",exact:true}).click();
  await expect(page.locator(".course-sequence li")).toHaveCount(4);
  await page.getByRole("button",{name:"Preview editorial draft: "+lesson.title}).click();
  await expect(page.getByRole("heading",{name:lesson.title})).toBeVisible();
  for(let i=0;i<4;i++)await page.getByRole("button",{name:"Continue"}).click();
  await page.getByRole("radio",{name:lesson.wrong,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await page.getByRole("button",{name:"Try again"}).click();
  await page.getByRole("radio",{name:lesson.guided,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.correct")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await page.getByRole("textbox",{name:"Your answer"}).fill("未证实");
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await page.getByRole("button",{name:"Try again"}).click();
  await page.getByRole("textbox",{name:"Your answer"}).fill(lesson.cloze);
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.correct")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await expect(page.locator(".reading-passage")).toBeVisible();
  await expect(page.locator(".reading-passage .reading")).toBeVisible();
  await page.getByRole("radio",{name:lesson.read,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.correct")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await page.getByRole("radio",{name:lesson.situation,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.correct")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  const tone=page.getByRole("textbox",{name:"Your answer"});
  await tone.fill(lesson.tone.normalize("NFD").replace(/[\u0300-\u036f]/gu,""));
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await page.getByRole("button",{name:"Try again"}).click();
  await tone.fill(lesson.tone);
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.correct")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await page.getByRole("textbox",{name:"Your response"}).fill("你好。我是学生。自编对话，先问候再介绍自己。");
  await page.getByRole("button",{name:"Review writing"}).click();
  await expect(page.getByText("Ungraded practice")).toBeVisible();
  await page.getByRole("button",{name:"← Course"}).click();
  await expect(page.getByRole("heading",{name:"Course"})).toBeVisible();
  await expect(page.locator(".course-sequence li")).toHaveCount(4);
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
  const keys=await page.evaluate(()=>Array.from({length:sessionStorage.length},(_,i)=>sessionStorage.key(i)));
  expect(keys.some(k=>k?.includes("phase25-"))).toBe(false);
 });
}
test("320px Chinese self/other identity lesson remains in-memory and does not issue a proficiency grade",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 await page.getByRole("button",{name:"Preview editorial draft: Possession and identifying a teacher"}).click();
 for(let i=0;i<4;i++)await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("radio",{name:"我的",exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("textbox",{name:"Your answer"}).fill("的");
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("radio",{name:"他是老师。",exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("radio",{name:"他是老师。",exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("textbox",{name:"Your answer"}).fill("wǒ de");
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("textbox",{name:"Your response"}).fill("我的。我是学生。他是老师。");
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 await page.reload();
 await expect(page.getByRole("heading",{name:"Home"})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
});
