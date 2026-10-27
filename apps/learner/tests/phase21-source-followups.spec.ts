import {test,expect} from "@playwright/test";

import {APPLICATION_PATHS} from "../src/application-paths";
import {LESSON_FOLLOW_UPS,APPLICATION_FOLLOW_UPS} from "../src/source-followups";

for(const followUp of LESSON_FOLLOW_UPS){
 test("source correction and independent revision: "+followUp.ownerId,async({page})=>{
  await page.goto("/");
  if(followUp.languageId!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(followUp.languageId);
  await page.getByRole("button",{name:"Course",exact:true}).click();
  const sequenceIndex=LESSON_FOLLOW_UPS.filter(item=>item.languageId===followUp.languageId).findIndex(item=>item.ownerId===followUp.ownerId);
  await page.locator(".course-sequence button").nth(sequenceIndex).click();
  await page.getByRole("button",{name:"← Course"}).click();
  await page.locator(".source-practice button").filter({hasText:"Ungraded writing"}).first().click();
  const first="Original attempt for "+followUp.languageId;
  const next="Rewritten response in the changed situation for "+followUp.languageId;
  await page.getByRole("textbox",{name:"Your response"}).fill(first);
  await page.getByRole("button",{name:"Review writing"}).click();
  await page.getByRole("button",{name:"Explore source correction"}).click();
  const panel=page.getByRole("region",{name:"Source-guided correction"});
  await expect(panel.getByText(followUp.newSituation)).toBeVisible();
  await expect(panel.getByRole("button",{name:"Revise in this situation"})).toBeDisabled();
  await panel.getByRole("button",{name:followUp.focuses[0].label}).click();
  await expect(panel.getByText(followUp.focuses[0].quote,{exact:true})).toBeVisible();
  await panel.getByRole("button",{name:"Revise in this situation"}).click();
  await expect(panel.getByText("Write your revised response above, then select Review writing.")).toBeVisible();
  await page.getByRole("textbox",{name:"Your response"}).fill(next);
  await page.getByRole("button",{name:"Review writing"}).click();
  await expect(panel.locator(".repair-drafts blockquote").first()).toHaveText(first);
  await expect(panel.locator(".repair-drafts blockquote").last()).toHaveText(next);
  await expect(panel.getByText("No automatic correctness or proficiency decision is made.")).toBeVisible();
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 });
}
for(const followUp of APPLICATION_FOLLOW_UPS){
 test("application correction and preserved self-review: "+followUp.ownerId,async({page})=>{
  await page.goto("/");
  if(followUp.languageId!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(followUp.languageId);
  await page.getByRole("button",{name:"Course",exact:true}).click();
  const path=APPLICATION_PATHS.find(p=>p.id===followUp.ownerId)!;
  await page.getByRole("button",{name:"Open application task 3 of "+path.title}).click();
  await page.getByRole("textbox",{name:"Your response"}).fill("First response");
  await page.getByRole("button",{name:"Review writing"}).click();
  await page.getByRole("button",{name:"Explore source correction"}).click();
  const panel=page.getByRole("region",{name:"Source-guided correction"});
  await panel.getByRole("button",{name:followUp.focuses[1].label}).click();
  await expect(panel.getByText(followUp.focuses[1].quote,{exact:true})).toBeVisible();
  await panel.getByRole("button",{name:"Revise in this situation"}).click();
  await page.getByRole("textbox",{name:"Your response"}).fill("Second response using the different context");
  await page.getByRole("button",{name:"Review writing"}).click();
  await expect(panel.locator(".repair-drafts blockquote").last()).toHaveText("Second response using the different context");
  const review=page.getByRole("region",{name:"Source-backed writing review"});
  await expect(review.getByRole("checkbox").first()).not.toBeChecked();
  await expect(review.getByRole("button",{name:"Finish application"})).toBeDisabled();
 });
}
test("320px correction remains readable and volatile under reload",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.goto("/");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 await page.locator(".source-practice button").filter({hasText:"Ungraded writing"}).first().click();
 await page.getByRole("textbox",{name:"Your response"}).fill("Initial draft");
 await page.getByRole("button",{name:"Review writing"}).click();
 await page.getByRole("button",{name:"Explore source correction"}).click();
 const panel=page.getByRole("region",{name:"Source-guided correction"});
 await panel.getByRole("button",{name:LESSON_FOLLOW_UPS[0].focuses[0].label}).click();
 await panel.getByRole("button",{name:"Revise in this situation"}).click();
 await page.getByRole("textbox",{name:"Your response"}).fill("Unsubmitted revised draft");
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 await page.reload();
 await expect(page.getByRole("region",{name:"Source-guided correction"})).toHaveCount(0);
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
});
