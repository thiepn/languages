import {test,expect,type Page} from "@playwright/test";
import raw from "../../../contracts/fixtures/phase02-source-lessons.json" with {type:"json"};
import {framesFor} from "../src/lesson-model";
import type {LessonBundleV1} from "../../../packages/content-schema/src/lesson-v1";

const bundles=raw.bundles as unknown as LessonBundleV1[];
const lessons=Object.fromEntries(bundles.map(b=>[b.lesson.languageId,b])) as Record<string,LessonBundleV1>;
const languageNames:Record<string,string>={fr:"French",ja:"Japanese",zh:"Chinese"};

async function start(page:Page,lang:string){
 await page.goto("/");
 if(lang==="fr")await page.getByRole("button",{name:"Start French lesson"}).click();
 else{
  await page.getByRole("combobox",{name:"Study language"}).selectOption(lang);
  await page.getByRole("button",{name:"Start lesson"}).click();
 }
 await expect(page.getByRole("heading",{name:lessons[lang]!.lesson.title})).toBeVisible();
}

for(const lang of ["fr","ja","zh"]){
 test(languageNames[lang]+" — complete guided and independent teaching journey, no false grade",async({page})=>{
  await start(page,lang);
  const bundle=lessons[lang]!;
  const frames=framesFor(bundle);
  expect(frames).toHaveLength(20);
  for(const [index,frame] of frames.entries()){
   if(frame.type==="teaching"){
    if(frame.step?.type==="encounter")await expect(page.locator(".example-list .example").first()).toBeVisible();
    if(frame.step?.type==="explain")await expect(page.getByRole("heading",{name:frame.step.heading??"Understand the pattern"})).toBeVisible();
    if(frame.step?.type==="reflect")await expect(page.getByRole("heading",{name:"What to remember"})).toBeVisible();
   }else{
    const ex=frame.exercise!;
    await expect(page.getByRole("heading",{name:ex.instruction})).toBeVisible();
    if(ex.kind==="choice"||ex.kind==="reading"){
      const position=ex.options.indexOf(ex.acceptedAnswers[0]!);
      expect(position).toBeGreaterThanOrEqual(0);
      await page.getByRole("radio").nth(position).check();
    }else if(ex.kind==="ordering"){
      for(const tokenIndex of ex.acceptedAnswers[0]!.split(",").map(Number)){
        await page.getByRole("button",{name:"Add "+ex.tokens[tokenIndex]!}).click();
      }
    }else if(ex.kind==="typed"||ex.kind==="cloze"){
      await page.getByRole("textbox",{name:"Your answer"}).fill(ex.acceptedAnswers[0]!);
    }else await page.getByRole("textbox",{name:"Your response"}).fill(
      lang==="fr"?"Bonsoir, madame. Je m’appelle Léa. Au revoir.":
      lang==="ja"?"おはようございます。こんにちは。こんばんは。おやすみなさい。":
      "你好！这个苹果很好吃。");
    await page.getByRole("button",{name:"Check answer"}).click();
    await expect(page.getByText(ex.kind==="free-production"?"Ungraded practice":"Answer accepted")).toBeVisible();
   }
   await page.getByRole("button",{name:index===frames.length-1?"Finish preview":"Continue",exact:true}).click();
  }
  await expect(page.getByRole("heading",{name:"Preview complete"})).toBeVisible();
  await expect(page.getByText("No learning grade or review progress was recorded.",{exact:false})).toBeVisible();
  const checkpoint=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
  expect(checkpoint).toBeTruthy();
  expect(checkpoint).not.toContain("acceptedAnswers");
  expect(checkpoint).not.toContain("responseText");
  expect(checkpoint).not.toContain("accountId");
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 });
}

test("wrong answer requires retry or explicit uncredited reveal",async({page})=>{
 await start(page,"fr");
 for(let i=0;i<3;i++)await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByRole("heading",{name:"Which greeting is suited to an unfamiliar teacher?"})).toBeVisible();
 await page.getByRole("radio").first().check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.getByText("Not quite — try again")).toBeVisible();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
 await expect(page.getByText("Expected:",{exact:false})).toHaveCount(0);
 await page.getByRole("button",{name:"Try again"}).click();
 await expect(page.getByText("Not quite — try again")).toHaveCount(0);
 await page.getByRole("radio").first().check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Show answer"}).click();
 await expect(page.getByText("Answer revealed — not credited")).toBeVisible();
 await expect(page.getByText("Expected:",{exact:false})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByRole("heading",{name:"Complete: Je m’___ Inès."})).toBeVisible();
 await page.getByRole("textbox",{name:"Your answer"}).fill("appelle");
 await page.getByRole("textbox",{name:"Your answer"}).press("Enter");
 await expect(page.getByText("Answer accepted")).toBeVisible();
});

test("interruption restores exact frame while clearing unanswered drafts and feedback",async({page})=>{
 await start(page,"ja");
 for(let i=0;i<3;i++)await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByRole("heading",{name:"At 8 a.m. you meet your instructor. What do you say?"})).toBeVisible();
 await page.getByRole("radio").first().check();
 await page.reload();
 await page.getByRole("button",{name:"Continue Japanese"}).click();
 await expect(page.getByRole("heading",{name:"At 8 a.m. you meet your instructor. What do you say?"})).toBeVisible();
 await expect(page.getByRole("radio").first()).not.toBeChecked();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
 const s=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
 expect(s).not.toContain("おはよう");
 await page.getByRole("button",{name:"← Course"}).click();
 await expect(page.getByRole("heading",{name:"Course"})).toBeVisible();
 await page.getByRole("button",{name:"Continue lesson"}).click();
 await expect(page.getByRole("heading",{name:"At 8 a.m. you meet your instructor. What do you say?"})).toBeVisible();
});

test("review and profile never create or imply due cards, account access or sync",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"Review",exact:true}).first().click();
 await expect(page.getByRole("heading",{name:"Scheduled reviews unavailable"})).toBeVisible();
 await expect(page.getByText(/retain review authority/)).toBeVisible();
 await page.getByRole("button",{name:"Profile",exact:true}).last().click();
 await expect(page.getByText("Not connected in preview")).toBeVisible();
 await expect(page.getByText("Disabled")).toBeVisible();
 await page.getByRole("button",{name:"Clear demo continuation"}).click();
 const after=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
 expect(after===null||after.includes('"positions":{}')).toBeTruthy();
});

test("mobile navigation and lesson controls remain visible without page-level horizontal overflow",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await start(page,"zh");
 await expect(page.getByRole("navigation",{name:"Mobile primary"})).toBeVisible();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeInViewport();
 await expect(page.getByRole("button",{name:"Previous"})).toBeInViewport();
 await expect(page.getByText("nǐ hǎo")).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(overflow).toBeLessThanOrEqual(1);
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByRole("heading",{name:"Understand the pattern"})).toBeVisible();
});

test("native keyboard input and exact-tone check stay bounded",async({page})=>{
 await start(page,"zh");
 for(let i=0;i<3;i++)await page.getByRole("button",{name:"Continue",exact:true}).click();
 const choose=async(value:string)=>{
   const radios=page.getByRole("radio");
   const options=await radios.all();
   const values=await Promise.all(options.map(x=>x.inputValue()));
   expect(values).toContain(value);
   await radios.nth(values.indexOf(value)).check();
   await page.getByRole("button",{name:"Check answer"}).click();
   await expect(page.getByText("Answer accepted")).toBeVisible();
   await page.getByRole("button",{name:"Continue",exact:true}).click();
 };
 await choose("你好");
 await page.getByRole("textbox",{name:"Your answer"}).fill("你好");
 await page.getByRole("textbox",{name:"Your answer"}).press("Enter");
 await expect(page.getByText("Answer accepted")).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await choose("好吃");
 await expect(page.getByRole("heading",{name:"Write the tone-marked Hanyu Pinyin for 你好 (not the Hanzi)."})).toBeVisible();
 await page.getByRole("textbox",{name:"Your answer"}).fill("ni hao");
 await page.getByRole("textbox",{name:"Your answer"}).press("Enter");
 await expect(page.getByText("Not quite — try again")).toBeVisible();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
 await page.getByRole("button",{name:"Try again"}).click();
 await page.getByRole("textbox",{name:"Your answer"}).fill("nǐ hǎo");
 await page.getByRole("textbox",{name:"Your answer"}).press("Enter");
 await expect(page.getByText("Answer accepted")).toBeVisible();
});
