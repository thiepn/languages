import {test,expect} from "@playwright/test";
const lessons=[
 {title:"Time-specific polite greetings",correct:"昼：こんにちは。",wrong:"夜：こんばんは。",cloze:"おはようございます",read:"夜：こんばんは。",situation:"夜：こんばんは。"},
 {title:"Arriving in the evening or going to bed",correct:"寝る前：おやすみなさい。",wrong:"昼：こんにちは。",cloze:"おやすみなさい",read:"夜：こんばんは。",situation:"夜：こんばんは。"},
 {title:"Asking for help and thanking",correct:"すみません。",wrong:"どういたしまして。",cloze:"ません",read:"どういたしまして。",situation:"ありがとうございます。"},
 {title:"Giving an item and responding politely",correct:"はい、どうぞ。",wrong:"どういたしまして。",cloze:"とうございます",read:"どういたしまして。",situation:"ありがとうございます。"},
 {title:"Opening a first introduction",correct:"ミナです。",wrong:"はじめまして。",cloze:"です",read:"よろしくお願いします。",situation:"よろしくお願いします。"},
 {title:"From meeting a classmate to requesting help",correct:"はじめまして。",wrong:"すみません。",cloze:"ません",read:"ありがとうございます。",situation:"ありがとうございます。"}
] as const;

for(const lesson of lessons){
 test("Phase 24 original Japanese source, grammar and transfer: "+lesson.title,async({page})=>{
  await page.goto("/");
  await page.getByRole("combobox",{name:"Study language"}).selectOption("ja");
  await page.getByRole("button",{name:"Course",exact:true}).click();
  await expect(page.locator(".course-sequence li")).toHaveCount(4);
  await page.getByRole("button",{name:"Preview editorial draft: "+lesson.title}).click();
  await expect(page.getByRole("heading",{name:lesson.title})).toBeVisible();
  for(let i=0;i<4;i++)await page.getByRole("button",{name:"Continue"}).click();
  await page.getByRole("radio",{name:lesson.wrong,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await page.getByRole("button",{name:"Try again"}).click();
  await page.getByRole("radio",{name:lesson.correct,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.correct")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await page.getByRole("textbox",{name:"Your answer"}).fill("架空の不正解");
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await page.getByRole("button",{name:"Try again"}).click();
  await page.getByRole("textbox",{name:"Your answer"}).fill(lesson.cloze);
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.correct")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await expect(page.locator(".reading-passage")).toBeVisible();
  await page.getByRole("radio",{name:lesson.read,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.correct")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await page.getByRole("radio",{name:lesson.situation,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.correct")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await page.getByRole("textbox",{name:"Your response"}).fill("こんにちは。よろしくお願いします。自分の言葉で書きます。");
  await page.getByRole("button",{name:"Review writing"}).click();
  await expect(page.getByText("Ungraded practice")).toBeVisible();
  await page.getByRole("button",{name:"← Course"}).click();
  await expect(page.getByRole("heading",{name:"Course"})).toBeVisible();
  await expect(page.locator(".course-sequence li")).toHaveCount(4);
  await expect(page.getByRole("heading",{name:"Greetings at different times"})).toBeVisible();
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
  const keys=await page.evaluate(()=>Array.from({length:sessionStorage.length},(_,i)=>sessionStorage.key(i)));
  expect(keys.some(k=>k?.includes("phase24-"))).toBe(false);
 });
}

test("narrow viewport Japanese first-contact response remains volatile and does not claim native review completion",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("ja");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 await page.getByRole("button",{name:"Preview editorial draft: Opening a first introduction"}).click();
 for(let i=0;i<4;i++)await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("radio",{name:"ミナです。",exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("textbox",{name:"Your answer"}).fill("です");
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("radio",{name:"よろしくお願いします。",exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("radio",{name:"よろしくお願いします。",exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("textbox",{name:"Your response"}).fill("はじめまして。私の名前です。");
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 await page.reload();
 await expect(page.getByRole("heading",{name:"Home"})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
});
