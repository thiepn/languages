import {test,expect} from "@playwright/test";
import {APPLICATION_PATHS,resolveApplicationStep} from "../src/application-paths";
import all from "../../../contracts/fixtures/phase18-next-source-lessons.json" with {type:"json"};
import first from "../../../contracts/fixtures/phase17-cross-source-lessons.json" with {type:"json"};
const bundles=[...all.bundles,...first.bundles];
for(const lang of ["fr","ja","zh"] as const){
 test(lang+" original independent scenario navigation and ungraded revision",async({page})=>{
  await page.goto("/");
  if(lang!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(lang);
  await page.getByRole("button",{name:"Course",exact:true}).click();
  const path=APPLICATION_PATHS.find(p=>p.languageId===lang)!;
  await page.getByRole("button",{name:"Start application"}).first().click();
  for(const [index,step]of path.steps.entries()){
   const found=resolveApplicationStep(bundles,step)!;
   const ex=found.exercise;
   await expect(page.getByText("Application task "+(index+1)+" of 3:",{exact:false})).toBeVisible();
   if(ex.kind==="choice"||ex.kind==="reading")await page.getByRole("radio").nth(ex.options.indexOf(ex.acceptedAnswers[0])).check();
   else if(ex.kind==="ordering")for(const i of ex.acceptedAnswers[0].split(",").map(Number))await page.getByRole("button",{name:"Add "+ex.tokens[i]}).click();
   else if(ex.kind==="free-production")await page.getByRole("textbox",{name:"Your response"}).fill(lang==="fr"?"C’est un livre. Le livre est sur la table.":lang==="ja"?"はじめまして。ミナです。よろしくお願いします。":"我是学生。他是老师。");
   else await page.getByRole("textbox",{name:"Your answer"}).fill(ex.acceptedAnswers[0]);
   await page.getByRole("button",{name:ex.kind==="free-production"?"Review writing":"Check answer"}).click();
   await expect(page.getByText(ex.kind==="free-production"?"Ungraded practice":"Answer accepted")).toBeVisible();
   await page.getByRole("button",{name:index===2?"Return to Course":"Next application task"}).click();
  }
  await expect(page.getByRole("heading",{name:"Course"})).toBeVisible();
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 });
}
test("320px writing-confirmation protects an unsent application draft",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 const path=APPLICATION_PATHS.find(p=>p.id==="zh-negative-or-also")!;
 await page.getByRole("button",{name:"Open application task 3 of "+path.title}).click();
 await page.getByRole("textbox",{name:"Your response"}).fill("我是学生。");
 await page.getByRole("button",{name:"← Course"}).click();
 page.once("dialog",d=>d.dismiss());
 await page.getByRole("button",{name:"Open application task 1 of "+path.title}).click();
 await page.getByRole("button",{name:"Continue lesson"}).click();
 await expect(page.getByRole("textbox",{name:"Your response"})).toHaveValue("我是学生。");
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
