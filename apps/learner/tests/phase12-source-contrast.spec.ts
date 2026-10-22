import {test,expect,type Page} from "@playwright/test";
import raw from "../../../contracts/fixtures/phase02-source-lessons.json" with {type:"json"};

const labels={fr:"French",ja:"Japanese",zh:"Chinese"} as const;
type Lang=keyof typeof labels;
const catalog=Object.fromEntries(raw.bundles.map(b=>[b.lesson.languageId,b]));

async function visit(page:Page,lang:Lang,frame:number){
  await page.goto("/");
  if(lang!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(lang);
  const b=catalog[lang],key=b.lesson.id+"@"+b.lesson.contentVersion;
  await page.evaluate(({key,frame})=>{
    sessionStorage.setItem("thiepn-languages-phase03-preview-v1",JSON.stringify({version:1,positions:{[key]:frame}}));
  },{key,frame});
  await page.reload();
  await page.getByRole("button",{name:"Continue "+labels[lang]}).click();
}

for(const lang of ["fr","ja","zh"] as const){
 test(lang+" source comparison guides a wrong contextual choice without awarding credit",async({page})=>{
  await visit(page,lang,3);
  const ex=catalog[lang].exercises.find(e=>e.id===
    (lang==="fr"?"fr-a1-01-choice":lang==="ja"?"ja-a1-choice":"zh-ni-hao-choice"));
  const wrong=ex.options.find(option=>!ex.acceptedAnswers.includes(option));
  await page.getByRole("radio").nth(ex.options.indexOf(wrong)).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.getByText("Not quite — try again")).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
  await expect(page.getByText("Expected:",{exact:false})).toHaveCount(0);
  const details=page.locator(".feedback .source-comparison");
  await expect(details.locator("summary")).toBeVisible();
  await details.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(details).toHaveAttribute("open","");
  await expect(details).toContainText(ex.sourceComparison.first.targetText);
  await expect(details).toContainText(ex.sourceComparison.first.meaning);
  await expect(details).toContainText(ex.sourceComparison.second.targetText);
  await expect(details).toContainText(ex.sourceComparison.second.meaning);
  await expect(details).toContainText(ex.sourceComparison.cue);
  await expect(details.locator("blockquote")).toHaveCount(2);
  const text=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
  expect(text).not.toContain(ex.sourceComparison.cue);
  expect(text).not.toContain(wrong);
  await page.getByRole("button",{name:"Try again"}).click();
  await page.getByRole("radio").nth(ex.options.indexOf(ex.acceptedAnswers[0])).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.getByText("Answer accepted")).toBeVisible();
 });
 test(lang+" independent composition offers two source contexts without revealing expected answers",async({page})=>{
  await visit(page,lang,18);
  const e=catalog[lang].exercises.find(ex=>ex.id===lang+"-p09-context-composition");
  await expect(page.getByRole("heading",{name:e.instruction})).toBeFocused();
  const details=page.locator(".writing-references .source-comparison");
  await expect(details.locator("summary")).toBeVisible();
  await details.locator("summary").click();
  await expect(details.locator("blockquote")).toHaveCount(2);
  await expect(details).toContainText(e.sourceComparison.first.targetText);
  await expect(details).toContainText(e.sourceComparison.second.targetText);
  const draft=lang==="fr"?"Bonjour, madame. Je m’appelle Inès. Bonsoir, monsieur. Au revoir.":
    lang==="ja"?"朝：おはようございます。夜：こんばんは。寝る前：おやすみなさい。":
    "你好。你喜欢喝茶吗？这个苹果很好吃。";
  const field=page.getByRole("textbox",{name:"Your response"});
  await field.fill(draft);
  await page.getByRole("button",{name:"Review writing"}).click();
  await expect(page.getByText("Ungraded practice")).toBeVisible();
  await expect(page.getByText("Answer accepted")).toHaveCount(0);
  await page.getByRole("button",{name:"Revise writing"}).click();
  await expect(field).toHaveValue(draft);
  await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
  const checkpoint=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
  expect(checkpoint).not.toContain(draft);
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 });
}

test("narrow mobile comparison stacks original expressions and keeps lesson actions visible",async({page})=>{
  await page.setViewportSize({width:320,height:420});
  await visit(page,"zh",3);
  const e=catalog.zh.exercises.find(ex=>ex.id==="zh-ni-hao-choice");
  await page.getByRole("radio").nth(e.options.indexOf("好吃")).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  const details=page.locator(".feedback .source-comparison");
  await details.locator("summary").click();
  await expect(details.locator("blockquote")).toHaveCount(2);
  await expect(page.getByRole("button",{name:"Previous"})).toBeInViewport();
  await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeInViewport();
  await expect(page.getByRole("navigation",{name:"Mobile primary"})).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
