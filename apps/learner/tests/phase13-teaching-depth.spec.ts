import {test,expect,type Page} from "@playwright/test";
import raw from "../../../contracts/fixtures/phase02-source-lessons.json" with {type:"json"};
import {completePhase13Independent} from "./phase13-acceptance-helper";
const bundles=Object.fromEntries(raw.bundles.map(b=>[b.lesson.languageId,b]));
const labels={fr:"French",ja:"Japanese",zh:"Chinese"} as const;
type Lang=keyof typeof labels;

async function resume(page:Page,lang:Lang,index:number){
 await page.goto("/");
 if(lang!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(lang);
 const b=bundles[lang],key=b.lesson.id+"@"+b.lesson.contentVersion;
 await page.evaluate(({key,index})=>
  sessionStorage.setItem("thiepn-languages-phase03-preview-v1",JSON.stringify({version:1,positions:{[key]:index}})),{key,index});
 await page.reload();
 await page.getByRole("button",{name:"Continue "+labels[lang]}).click();
}
for(const lang of ["fr","ja","zh"] as const){
 test(lang+" completes two new independent transfers through the unchanged player and no grade",async({page})=>{
  await resume(page,lang,19);
  await expect(page.getByText("Activity 20 of 22")).toBeVisible();
  await completePhase13Independent(page,lang);
  await expect(page.getByText("Activity 22 of 22")).toBeVisible();
  await expect(page.getByRole("heading",{name:"What to remember"})).toBeFocused();
  await page.getByRole("button",{name:"Finish preview"}).click();
  await expect(page.getByText("22 of 22 activities reached")).toBeVisible();
  await expect(page.getByText("No learning grade or review progress was recorded.",{exact:false})).toBeVisible();
  const storage=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
  expect(storage).not.toContain("acceptedAnswers");
  expect(storage).not.toContain("submissions");
  expect(storage).not.toContain("grade");
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 });
}

test("French wrong role reading uses pinned source comparison and never reveals for credit",async({page})=>{
 await resume(page,"fr",20);
 const ex=bundles.fr.exercises.find(e=>e.id==="fr-p13-identity-role-reading");
 await expect(page.getByRole("heading",{name:ex.instruction})).toBeFocused();
 await page.getByRole("radio").nth(ex.options.indexOf("Je m’appelle Inès.")).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.getByText("Not quite — try again")).toBeVisible();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
 const compare=page.locator(".feedback .source-comparison");
 await compare.locator("summary").focus();
 await page.keyboard.press("Enter");
 await expect(compare).toContainText("Je m’appelle Inès.");
 await expect(compare).toContainText("Je suis étudiant.");
 await expect(compare).toContainText("My name is Inès.");
 await expect(compare).toContainText("I am a student.");
 await expect(page.getByText("Expected:",{exact:false})).toHaveCount(0);
 await page.getByRole("button",{name:"Try again"}).click();
 await page.getByRole("radio").nth(ex.options.indexOf("Je suis étudiant.")).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.getByText("Answer accepted")).toBeVisible();
});

test("Japanese three-situation timeline remains usable on a short touch viewport",async({page})=>{
 await page.setViewportSize({width:320,height:420});
 await resume(page,"ja",20);
 const ex=bundles.ja.exercises.find(e=>e.id==="ja-p13-social-timeline");
 for(const id of ex.acceptedAnswers[0].split(",").map(Number))
  await page.getByRole("button",{name:"Add "+ex.tokens[id]}).click();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.getByText("Answer accepted")).toBeVisible();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeInViewport();
 await expect(page.getByRole("button",{name:"Previous"})).toBeInViewport();
 await expect(page.getByRole("navigation",{name:"Mobile primary"})).toBeVisible();
 const over=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(over).toBeLessThanOrEqual(1);
});

test("Mandarin plural Pinyin rejects unmarked spelling and retains edit on retry",async({page})=>{
 await resume(page,"zh",19);
 const input=page.getByRole("textbox",{name:"Your answer"});
 await input.fill("ni men");
 await input.press("Enter");
 await expect(page.getByText("Not quite — try again")).toBeVisible();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
 const comparison=page.locator(".feedback .source-comparison");
 await comparison.locator("summary").click();
 await expect(comparison).toContainText("你好");
 await expect(comparison).toContainText("你们");
 await page.getByRole("button",{name:"Try again"}).click();
 await expect(input).toBeFocused();
 await expect(input).toHaveValue("ni men");
 await input.fill("nǐmen");
 await input.press("Enter");
 await expect(page.getByText("Answer accepted")).toBeVisible();
});
