import {test,expect} from "@playwright/test";
for(const lang of [
 {id:"fr",title:"Meeting someone: name or role?",guided:"Je m’appelle Inès.",other:"Bonsoir, monsieur."},
 {id:"ja",title:"First meeting and asking for help",guided:"はじめまして。",other:"すみません。"},
 {id:"zh",title:"Speaker, teacher and correction",guided:"我是学生。",other:"不是"}
] as const){
 test("original-source editorial intake uses existing player for "+lang.id,async({page})=>{
  await page.goto("/");
  if(lang.id!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(lang.id);
  await page.getByRole("button",{name:"Course",exact:true}).click();
  await expect(page.locator(".course-sequence li")).toHaveCount(4);
  await page.getByRole("button",{name:"Preview editorial draft: "+lang.title}).click();
  await expect(page.getByRole("heading",{name:lang.title})).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await expect(page.getByRole("heading",{name:"Use the source in context"})).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await page.getByRole("radio",{name:lang.other,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.getByText("Not quite",{exact:false}).or(page.locator(".feedback.incorrect"))).toBeVisible();
  await page.getByRole("button",{name:"Try again"}).click();
  await page.getByRole("radio",{name:lang.guided,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await page.getByRole("button",{name:"Continue"}).click();
  await expect(page.getByRole("heading",{name:/Which original|Which source/})).toBeVisible();
  await page.getByRole("button",{name:"← Course"}).click();
  await expect(page.locator(".course-sequence li")).toHaveCount(4);
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 });
}
test("source-authoring preview writing remains ungraded and unsaved on reload at 320px",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.goto("/");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 await page.getByRole("button",{name:"Preview editorial draft: Meeting someone: name or role?"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("radio",{name:"Je m’appelle Inès.",exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("radio",{name:"Je suis professeur.",exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 const written=page.getByRole("textbox",{name:"Your response"});
 await written.fill("Bonsoir. Je m’appelle Aya. Je suis professeur.");
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 await page.reload();
 await expect(page.getByRole("heading",{name:"Home"})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
});
