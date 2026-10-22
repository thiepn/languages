import {test,expect,type Page} from "@playwright/test";
import raw from "../../../contracts/fixtures/phase02-source-lessons.json" with {type:"json"};

const languages={fr:"French",ja:"Japanese",zh:"Chinese"} as const;
type Lang=keyof typeof languages;
const byLanguage=Object.fromEntries(raw.bundles.map(b=>[b.lesson.languageId,b]));

async function resumeAt(page:Page,lang:Lang,index:number){
 await page.goto("/");
 if(lang!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(lang);
 const bundle=byLanguage[lang];
 const key=bundle.lesson.id+"@"+bundle.lesson.contentVersion;
 await page.evaluate(({key,index})=>{
   sessionStorage.setItem("thiepn-languages-phase03-preview-v1",JSON.stringify({version:1,positions:{[key]:index}}));
 },{key,index});
 await page.reload();
 await page.getByRole("button",{name:"Continue "+languages[lang]}).click();
}

for(const lang of ["fr","ja","zh"] as const){
 test(lang+" original-source independent transfer completes using shared reducer",async({page})=>{
  await resumeAt(page,lang,15);
  const [cloze,ordering,reading]=byLanguage[lang].exercises.filter(e=>e.id.startsWith(lang+"-p08-"));
  await expect(page.getByRole("heading",{name:cloze.instruction})).toBeFocused();
  await page.getByRole("textbox",{name:"Your answer"}).fill(cloze.acceptedAnswers[0]);
  await page.getByRole("textbox",{name:"Your answer"}).press("Enter");
  await expect(page.getByText("Answer accepted")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.getByRole("heading",{name:ordering.instruction})).toBeFocused();
  const ids=ordering.acceptedAnswers[0].split(",").map(Number);
  for(const i of ids)await page.getByRole("button",{name:"Add "+ordering.tokens[i]}).click();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.getByText("Answer accepted")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.getByRole("heading",{name:reading.instruction})).toBeFocused();
  await expect(page.locator(".passage-text")).toContainText(reading.passage.split("\n")[0]);
  const selected=reading.options.indexOf(reading.acceptedAnswers[0]);
  await page.getByRole("radio").nth(selected).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.getByText("Answer accepted")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.getByRole("heading",{name:"What to remember"})).toBeVisible();
  await page.getByRole("button",{name:"Finish preview"}).click();
  await expect(page.getByRole("heading",{name:"Preview complete"})).toBeVisible();
  await expect(page.getByText("No learning grade or review progress was recorded.",{exact:false})).toBeVisible();
  const saved=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
  expect(saved).not.toContain("acceptedAnswers");
  expect(saved).not.toContain("responseText");
  expect(saved).not.toContain("correct");
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 });

 test(lang+" wrong reading answer gives opt-in source evidence before retry, not credit",async({page})=>{
  await resumeAt(page,lang,17);
  const ex=byLanguage[lang].exercises.find(e=>e.id===lang+"-p08-situated-reading");
  const wrong=ex.misconceptions[0].answer;
  await page.getByRole("radio").nth(ex.options.indexOf(wrong)).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeFocused();
  await expect(page.locator(".feedback.incorrect")).toContainText(ex.misconceptions[0].feedback);
  await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
  await expect(page.getByText("Expected:",{exact:false})).toHaveCount(0);
  const revealAid=page.getByText("Review source example");
  await revealAid.click();
  const aid=page.locator(".source-aid");
  await expect(aid).toContainText(ex.sourceAid.targetText);
  await expect(aid).toContainText(ex.sourceAid.meaning);
  await expect(aid).toContainText(ex.sourceAid.cue);
  await page.getByRole("button",{name:"Try again"}).click();
  await expect(page.getByRole("radio").first()).toBeFocused();
  await page.getByRole("radio").nth(ex.options.indexOf(ex.acceptedAnswers[0])).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.getByText("Answer accepted")).toBeVisible();
 });
}

test("new independent cloze discards unsent answer on reload and preserves frame position",async({page})=>{
 await resumeAt(page,"ja",15);
 await page.getByRole("textbox",{name:"Your answer"}).fill("おはようございます");
 await page.reload();
 await page.getByRole("button",{name:"Continue Japanese"}).click();
 await expect(page.getByRole("heading",{name:/You greet a teacher in the morning/})).toBeFocused();
 await expect(page.getByRole("textbox",{name:"Your answer"})).toHaveValue("");
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
 const saved=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
 expect(saved).not.toContain("おはようございます");
});

test("narrow mobile viewport keeps ordering controls and lesson navigation reachable",async({page})=>{
 await page.setViewportSize({width:320,height:420});
 await resumeAt(page,"zh",16);
 const ex=byLanguage.zh.exercises.find(e=>e.id==="zh-p08-situated-ordering");
 await expect(page.getByRole("button",{name:"Previous"})).toBeInViewport();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeInViewport();
 await expect(page.getByRole("navigation",{name:"Mobile primary"})).toBeVisible();
 for(const i of ex.acceptedAnswers[0].split(",").map(Number))
   await page.getByRole("button",{name:"Add "+ex.tokens[i]}).click();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.getByText("Answer accepted")).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(overflow).toBeLessThanOrEqual(1);
});
