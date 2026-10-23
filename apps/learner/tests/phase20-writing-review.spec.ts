import {test,expect} from "@playwright/test";
import {APPLICATION_PATHS,APPLICATION_REVIEWS} from "../src/application-paths";
for(const languageId of ["fr","ja","zh"] as const){
 test(languageId+" source-backed draft comparison, revision, and explicit learner checks",async({page})=>{
  await page.goto("/");
  if(languageId!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(languageId);
  await page.getByRole("button",{name:"Course",exact:true}).click();
  const path=APPLICATION_PATHS.find(p=>p.languageId===languageId)!;
  await page.getByRole("button",{name:"Open application task 3 of "+path.title}).click();
  const first=languageId==="fr"?"C’est un livre.":languageId==="ja"?"はじめまして。":"我是学生。";
  const revised=languageId==="fr"?"C’est un livre. Le livre est sur la table.":languageId==="ja"?"はじめまして。ミナです。よろしくお願いします。":"我是学生。他是老师。";
  await page.getByRole("textbox",{name:"Your response"}).fill(first);
  await page.getByRole("button",{name:"Review writing"}).click();
  await expect(page.getByText("Ungraded practice")).toBeVisible();
  await expect(page.getByRole("button",{name:"Finish application"})).toHaveCount(0);
  await page.getByRole("button",{name:"Review sources before finishing"}).click();
  const panel=page.getByRole("region",{name:"Source-backed writing review"});
  await expect(panel.locator(".applied-draft-comparison blockquote").first()).toHaveText(first);
  await expect(panel.getByRole("checkbox")).toHaveCount(3);
  await expect(panel.getByRole("button",{name:"Finish application"})).toBeDisabled();
  for(const [i,criterion]of APPLICATION_REVIEWS[path.id].criteria.entries())
   await expect(panel.locator(".review-criterion blockquote").nth(i)).toHaveText(criterion.quote);
  await panel.getByRole("button",{name:"Revise against sources"}).click();
  await page.getByRole("textbox",{name:"Your response"}).fill(revised);
  await page.getByRole("button",{name:"Review writing"}).click();
  await expect(panel.locator(".applied-draft-comparison blockquote").last()).toHaveText(revised);
  for(const checkbox of await panel.getByRole("checkbox").all())await checkbox.check();
  await expect(panel.getByRole("button",{name:"Finish application"})).toBeEnabled();
  await panel.getByRole("button",{name:"Finish application"}).click();
  await expect(page.getByRole("heading",{name:"Course"})).toBeVisible();
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 });
}
test("320px rejected navigation retains unsent revision and source self-review",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 const path=APPLICATION_PATHS.find(p=>p.id==="zh-negative-or-also")!;
 await page.getByRole("button",{name:"Open application task 3 of "+path.title}).click();
 await page.getByRole("textbox",{name:"Your response"}).fill("他是老师。");
 await page.getByRole("button",{name:"Review writing"}).click();
 await page.getByRole("button",{name:"Review sources before finishing"}).click();
 const panel=page.getByRole("region",{name:"Source-backed writing review"});
 await panel.getByRole("checkbox").first().check();
 await panel.getByRole("button",{name:"Revise against sources"}).click();
 await page.getByRole("textbox",{name:"Your response"}).fill("他是老师。我是学生。");
 await page.getByRole("button",{name:"← Course"}).click();
 page.once("dialog",dialog=>dialog.dismiss());
 await page.getByRole("button",{name:"Open application task 1 of "+path.title}).click();
 await page.getByRole("button",{name:"Continue lesson"}).click();
 await expect(page.getByRole("textbox",{name:"Your response"})).toHaveValue("他是老师。我是学生。");
 await expect(panel.getByRole("checkbox").first()).toBeChecked();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
