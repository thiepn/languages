import {test,expect} from "@playwright/test";
import {APPLICATION_PATHS,APPLICATION_REVIEWS} from "../src/application-paths";
for(const lang of ["fr","ja","zh"] as const){
 test(lang+" changed-context writing resets stale source checks",async({page})=>{
  await page.goto("/");
  if(lang!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(lang);
  await page.getByRole("button",{name:"Course",exact:true}).click();
  const path=APPLICATION_PATHS.find(p=>p.languageId===lang)!;
  await page.getByRole("button",{name:"Open application task 3 of "+path.title}).click();
  const situation=APPLICATION_REVIEWS[path.id].changedSituation;
  await expect(page.getByText(situation)).toHaveCount(0);
  const writing=page.getByRole("textbox",{name:"Your response"});
  const draft=lang==="fr"?"C’est un livre. Le livre est sur la table.":lang==="ja"?"はじめまして。ミナです。よろしくお願いします。":"我是学生。他是老师。";
  await writing.fill(draft);
  await page.getByRole("button",{name:"Review writing"}).click();
  await page.getByRole("button",{name:"Review sources before finishing"}).click();
  await expect(page.getByText(situation)).toBeVisible();
  const review=page.getByRole("region",{name:"Source-backed writing review"});
  const boxes=review.getByRole("checkbox");
  await boxes.nth(0).check();
  await review.getByRole("button",{name:"Revise against sources"}).click();
  await expect(boxes.nth(0)).not.toBeChecked();
  await writing.fill(draft+" "+(lang==="fr"?"Voici des stylos.":lang==="ja"?"ありがとうございます。":"他不是老师。"));
  await page.getByRole("button",{name:"Review writing"}).click();
  for(let i=0;i<3;i++)await boxes.nth(i).check();
  await review.getByRole("button",{name:"Finish application"}).click();
  await expect(page.getByRole("heading",{name:"Course"})).toBeVisible();
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 });
}