import {test,expect} from "@playwright/test";
import bridgeRaw from "../../../contracts/fixtures/phase17-cross-source-lessons.json" with {type:"json"};
import {framesFor} from "../src/lesson-model";
for(const lang of ["fr","ja","zh"]){
 test(lang+" cross-source transfer completes through original state machine",async({page})=>{
  await page.goto("/");
  if(lang!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(lang);
  await page.getByRole("button",{name:"Course",exact:true}).click();
  const b=bridgeRaw.bundles.find(b=>b.lesson.languageId===lang);
  await page.getByRole("button",{name:"Open "+b.lesson.title}).click();
  const frames=framesFor(b);
  expect(frames).toHaveLength(11);
  for(const [i,frame] of frames.entries()){
   if(frame.exercise){
    const ex=frame.exercise;
    if(ex.kind==="choice"||ex.kind==="reading")await page.getByRole("radio").nth(ex.options.indexOf(ex.acceptedAnswers[0])).check();
    else if(ex.kind==="ordering")for(const n of ex.acceptedAnswers[0].split(",").map(Number))await page.getByRole("button",{name:"Add "+ex.tokens[n]}).click();
    else if(ex.kind==="free-production")await page.getByRole("textbox",{name:"Your response"}).fill(lang==="fr"?"Bonsoir, monsieur. Je m’appelle Léa. Je suis professeur. Au revoir.":lang==="ja"?"こんにちは。すみません。ありがとうございます。どういたしまして。":"你好，我是学生。这个苹果很好吃。");
    else await page.getByRole("textbox",{name:"Your answer"}).fill(ex.acceptedAnswers[0]);
    await page.getByRole("button",{name:ex.kind==="free-production"?"Review writing":"Check answer"}).click();
    await expect(page.getByText(ex.kind==="free-production"?"Ungraded practice":"Answer accepted")).toBeVisible();
   }
   await page.getByRole("button",{name:i===frames.length-1?"Finish preview":"Continue",exact:true}).click();
  }
  await expect(page.getByRole("heading",{name:"Preview complete"})).toBeVisible();
  await page.getByRole("button",{name:"Back to Course"}).click();
  for(const src of b.lesson.sources)await expect(page.getByRole("heading",{name:src.originalEntityId,exact:true})).toBeVisible();
  const key=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
  expect(key).not.toContain("answer");
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 });
}
test("bridge keeps unfinished Chinese writing when lesson switching is declined at 320px",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 const b=bridgeRaw.bundles.find(b=>b.lesson.languageId==="zh");
 await page.getByRole("button",{name:"Open "+b.lesson.title}).click();
 const frames=framesFor(b);
 for(const frame of frames.slice(0,frames.findIndex(f=>f.exercise?.kind==="free-production"))){
  if(frame.exercise){
   const ex=frame.exercise;
   if(ex.kind==="choice"||ex.kind==="reading")await page.getByRole("radio").nth(ex.options.indexOf(ex.acceptedAnswers[0])).check();
   else if(ex.kind==="ordering")for(const i of ex.acceptedAnswers[0].split(",").map(Number))await page.getByRole("button",{name:"Add "+ex.tokens[i]}).click();
   else await page.getByRole("textbox",{name:"Your answer"}).fill(ex.acceptedAnswers[0]);
   await page.getByRole("button",{name:"Check answer"}).click();
  }
  await page.getByRole("button",{name:"Continue",exact:true}).click();
 }
 await page.getByRole("textbox",{name:"Your response"}).fill("你好，我是学生。");
 await page.getByRole("button",{name:"← Course"}).click();
 page.once("dialog",dialog=>dialog.dismiss());
 await page.getByRole("button",{name:"Open 你好: characters in a greeting"}).click();
 await page.getByRole("button",{name:"Continue lesson"}).click();
 await expect(page.getByRole("textbox",{name:"Your response"})).toHaveValue("你好，我是学生。");
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
