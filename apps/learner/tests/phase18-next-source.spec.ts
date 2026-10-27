import {test,expect} from "@playwright/test";
import raw from "../../../contracts/fixtures/phase18-next-source-lessons.json" with {type:"json"};
import {framesFor} from "../src/lesson-model";
for(const lang of ["fr","ja","zh"] as const){
 test(lang+" new original source lesson retains real guided to ungraded independent journey",async({page})=>{
  await page.goto("/");
  if(lang!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(lang);
  await page.getByRole("button",{name:"Course",exact:true}).click();
  const b=raw.bundles.find(x=>x.lesson.languageId===lang)!;
  await page.getByRole("button",{name:"Open "+b.lesson.title}).click();
  await expect(page.getByRole("heading",{name:b.lesson.title})).toBeVisible();
  const frames=framesFor(b);
  expect(frames).toHaveLength(11);
  for(const [index,frame]of frames.entries()){
   if(frame.exercise){
    const e=frame.exercise;
    if(e.kind==="choice"||e.kind==="reading")await page.getByRole("radio").nth(e.options.indexOf(e.acceptedAnswers[0])).check();
    else if(e.kind==="ordering")for(const n of e.acceptedAnswers[0].split(",").map(Number))await page.getByRole("button",{name:"Add "+e.tokens[n]}).click();
    else if(e.kind==="free-production")await page.getByRole("textbox",{name:"Your response"}).fill(lang==="fr"?"Un livre et une table. Le livre est sur la table.":lang==="ja"?"はじめまして。ミナです。よろしくお願いします。":"他是老师。");
    else await page.getByRole("textbox",{name:"Your answer"}).fill(e.acceptedAnswers[0]);
    await page.getByRole("button",{name:e.kind==="free-production"?"Review writing":"Check answer"}).click();
    await expect(page.getByText(e.kind==="free-production"?"Ungraded practice":"Answer accepted")).toBeVisible();
   }
   await page.getByRole("button",{name:index===frames.length-1?"Finish preview":"Continue",exact:true}).click();
  }
  await expect(page.getByRole("heading",{name:"Preview complete"})).toBeVisible();
  await page.getByRole("button",{name:"Back to Course"}).click();
  await expect(page.getByRole("heading",{name:b.lesson.sources[0].originalEntityId,exact:true})).toBeVisible();
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 });
}
test("320px Chinese original 是 preserves unsent writing on rejected switch to a different lesson",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 const b=raw.bundles.find(x=>x.lesson.languageId==="zh")!;
 await page.getByRole("button",{name:"Open "+b.lesson.title}).click();
 const f=framesFor(b),writeIndex=f.findIndex(x=>x.exercise?.kind==="free-production");
 for(const frame of f.slice(0,writeIndex)){
  if(frame.exercise){
   const e=frame.exercise;
   if(e.kind==="choice"||e.kind==="reading")await page.getByRole("radio").nth(e.options.indexOf(e.acceptedAnswers[0])).check();
   else if(e.kind==="ordering")for(const n of e.acceptedAnswers[0].split(",").map(Number))await page.getByRole("button",{name:"Add "+e.tokens[n]}).click();
   else await page.getByRole("textbox",{name:"Your answer"}).fill(e.acceptedAnswers[0]);
   await page.getByRole("button",{name:"Check answer"}).click();
  }
  await page.getByRole("button",{name:"Continue",exact:true}).click();
 }
 await page.getByRole("textbox",{name:"Your response"}).fill("他是老师。");
 await page.getByRole("button",{name:"← Course"}).click();
 page.once("dialog",d=>d.dismiss());
 await page.getByRole("button",{name:"Open Greeting and first-person identity"}).click();
 await page.getByRole("button",{name:"Continue lesson"}).click();
 await expect(page.getByRole("textbox",{name:"Your response"})).toHaveValue("他是老师。");
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
