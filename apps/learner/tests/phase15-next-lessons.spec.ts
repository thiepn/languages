import {test,expect,type Page} from "@playwright/test";
import nextRaw from "../../../contracts/fixtures/phase15-source-lessons.json" with {type:"json"};
import {framesFor} from "../src/lesson-model";
const map=Object.fromEntries(nextRaw.bundles.map(b=>[b.lesson.languageId,b]));
const names={fr:"French",ja:"Japanese",zh:"Chinese"} as const;
type Lang=keyof typeof names;
async function open(page:Page,lang:Lang){
 await page.goto("/");
 if(lang!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(lang);
 await page.getByRole("button",{name:"Course",exact:true}).click();
 await page.getByRole("button",{name:"Open "+map[lang].lesson.title}).click();
 await expect(page.getByRole("heading",{name:map[lang].lesson.title})).toBeVisible();
}
for(const lang of ["fr","ja","zh"] as const){
 test(lang+" completes new authored guided and independent lesson through same player",async({page})=>{
  await open(page,lang);
  const bundle=map[lang];
  const frames=framesFor(bundle);
  expect(frames).toHaveLength(14);
  for(let index=0;index<frames.length;index++){
   const frame=frames[index];
   if(frame.exercise){
    const ex=frame.exercise;
    if(ex.kind==="choice"||ex.kind==="reading"){
      await page.getByRole("radio").nth(ex.options.indexOf(ex.acceptedAnswers[0])).check();
    }else if(ex.kind==="ordering"){
      for(const i of ex.acceptedAnswers[0].split(",").map(Number))await page.getByRole("button",{name:"Add "+ex.tokens[i]}).click();
    }else if(ex.kind==="free-production"){
      await page.getByRole("textbox",{name:"Your response"}).fill(lang==="fr"?"Je suis professeur à Paris. Nous sommes à Lyon.":lang==="ja"?"すみません。ありがとうございます。どういたしまして。":"我，我的，我们。");
    }else await page.getByRole("textbox",{name:"Your answer"}).fill(ex.acceptedAnswers[0]);
    await page.getByRole("button",{name:ex.kind==="free-production"?"Review writing":"Check answer"}).click();
    await expect(page.getByText(ex.kind==="free-production"?"Ungraded practice":"Answer accepted")).toBeVisible();
   }
   await page.getByRole("button",{name:index===frames.length-1?"Finish preview":"Continue",exact:true}).click();
  }
  await expect(page.getByRole("heading",{name:"Preview complete"})).toBeVisible();
  await page.getByRole("button",{name:"Back to Course"}).click();
  await expect(page.getByRole("region",{name:"Original source practice"})).toBeVisible();
  const saved=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
  expect(saved).not.toContain("submissions");
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 });
}
test("new and original lessons retain distinct browser-tab checkpoints after interruption",async({page})=>{
 await open(page,"fr");
 for(let i=0;i<3;i++)await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByText("Activity 4 of 14")).toBeVisible();
 await page.reload();
 await page.getByRole("button",{name:"Course",exact:true}).click();
 await page.getByRole("button",{name:"Open Who are you? Using être"}).click();
 await expect(page.getByText("Activity 4 of 14")).toBeVisible();
 await page.getByRole("button",{name:"← Course"}).click();
 await page.getByRole("button",{name:"Open First French words and sounds"}).click();
 await expect(page.getByText("Activity 1 of 22")).toBeVisible();
 await page.getByRole("button",{name:"← Course"}).click();
 await page.getByRole("button",{name:"Open Who are you? Using être"}).click();
 await expect(page.getByText("Activity 4 of 14")).toBeVisible();
});
test("switching lessons with authored writing requires discard confirmation",async({page})=>{
 await open(page,"ja");
 const b=map.ja;
 const frames=framesFor(b);
 const writeIndex=frames.findIndex(f=>f.exercise?.kind==="free-production");
 for(let i=0;i<writeIndex;i++){
  const frame=frames[i];
  if(frame.exercise){
    const ex=frame.exercise;
    if(ex.kind==="choice"||ex.kind==="reading")await page.getByRole("radio").nth(ex.options.indexOf(ex.acceptedAnswers[0])).check();
    else if(ex.kind==="ordering")for(const k of ex.acceptedAnswers[0].split(",").map(Number))await page.getByRole("button",{name:"Add "+ex.tokens[k]}).click();
    else await page.getByRole("textbox",{name:"Your answer"}).fill(ex.acceptedAnswers[0]);
    await page.getByRole("button",{name:"Check answer"}).click();
  }
  await page.getByRole("button",{name:"Continue",exact:true}).click();
 }
 await page.getByRole("textbox",{name:"Your response"}).fill("未送信の文章");
 await page.getByRole("button",{name:"← Course"}).click();
 page.once("dialog",dialog=>dialog.dismiss());
 await page.getByRole("button",{name:"Open Greetings at different times"}).click();
 await expect(page.getByRole("heading",{name:"Course"})).toBeVisible();
 await page.getByRole("button",{name:"Continue lesson"}).click();
 await expect(page.getByRole("textbox",{name:"Your response"})).toHaveValue("未送信の文章");
});
test("next-lesson course navigation remains usable at 320px without lateral overflow",async({page})=>{
 await page.setViewportSize({width:320,height:420});
 await page.goto("/");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 const next=page.getByRole("button",{name:"Open Who are you? Using être"});
 await expect(next).toBeVisible();
 await next.click();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeInViewport();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
