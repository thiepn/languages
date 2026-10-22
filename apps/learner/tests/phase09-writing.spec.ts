import {test,expect,type Page} from "@playwright/test";
import raw from "../../../contracts/fixtures/phase02-source-lessons.json" with {type:"json"};

const bundles=Object.fromEntries(raw.bundles.map(b=>[b.lesson.languageId,b]));
const labels={fr:"French",ja:"Japanese",zh:"Chinese"} as const;
type Lang=keyof typeof labels;
async function resumeWriting(page:Page,lang:Lang){
 await page.goto("/");
 if(lang!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(lang);
 const bundle=bundles[lang];
 const key=bundle.lesson.id+"@"+bundle.lesson.contentVersion;
 await page.evaluate((checkpoint)=>{
  sessionStorage.setItem("thiepn-languages-phase03-preview-v1",JSON.stringify({version:1,positions:{[checkpoint]:18}}));
 },key);
 await page.reload();
 await page.getByRole("button",{name:"Continue "+labels[lang]}).click();
}

const original={
 fr:"Bonjour, madame. Je m’appelle Inès. Au revoir.",
 ja:"朝：おはようございます。昼：こんにちは。",
 zh:"你好。你喜欢喝茶吗？"
};
for(const lang of ["fr","ja","zh"] as const){
 test(lang+" independent source-based writing can be revised, revisited, and finished without credit",async({page})=>{
  await resumeWriting(page,lang);
  const ex=bundles[lang].exercises.find(e=>e.id===lang+"-p09-context-composition");
  await expect(page.getByRole("heading",{name:ex.instruction})).toBeFocused();
  await expect(page.getByText("Writing criteria")).toBeVisible();
  await page.getByText("Writing criteria").click();
  for(const criterion of ex.rubric)await expect(page.locator(".writing-references")).toContainText(criterion);
  await page.getByText("Original source example").click();
  await expect(page.locator(".writing-references")).toContainText(ex.sourceAid.targetText);
  await expect(page.locator(".writing-references")).toContainText(ex.sourceAid.meaning);
  const textbox=page.getByRole("textbox",{name:"Your response"});
  await textbox.fill(original[lang]);
  await expect(page.getByText(/Unsubmitted writing stays on this page/)).toBeVisible();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.getByText("Ungraded practice")).toBeVisible();
  await expect(page.getByRole("button",{name:"Revise writing"})).toBeVisible();
  await page.getByRole("button",{name:"Revise writing"}).click();
  await expect(textbox).toBeFocused();
  await expect(textbox).toHaveValue(original[lang]);
  await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
  const updated=original[lang]+(lang==="zh"?" 这个苹果很好吃。":lang==="ja"?"夜：こんばんは。寝る前：おやすみなさい。":" Bonsoir, monsieur. Au revoir, à demain.");
  await textbox.fill(updated);
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.getByText("Ungraded practice")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.getByRole("heading",{name:"What to remember"})).toBeFocused();
  await page.getByRole("button",{name:"Previous"}).click();
  await expect(textbox).toHaveValue(updated);
  await expect(page.getByText("Ungraded practice")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await page.getByRole("button",{name:"Finish preview"}).click();
  await expect(page.getByRole("heading",{name:"Preview complete"})).toBeVisible();
  await expect(page.getByText("No learning grade or review progress was recorded.",{exact:false})).toBeVisible();
  const position=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
  expect(position).not.toContain(original[lang]);
  expect(position).not.toContain("submissions");
  expect(position).not.toContain("ungraded");
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 });
}
test("unsent writing survives course navigation but not reload or language switches",async({page})=>{
 await resumeWriting(page,"ja");
 const typed="朝：おはようございます。 夜：こんばんは。";
 const textbox=page.getByRole("textbox",{name:"Your response"});
 await textbox.fill(typed);
 await page.getByRole("button",{name:"← Course"}).click();
 await page.getByRole("button",{name:"Continue lesson"}).click();
 await expect(textbox).toHaveValue(typed);
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
 await page.reload();
 await page.getByRole("button",{name:"Continue Japanese"}).click();
 await expect(textbox).toHaveValue("");
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
 const checkpoint=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
 expect(checkpoint).not.toContain(typed);
 await page.getByRole("combobox",{name:"Study language"}).selectOption("fr");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("ja");
 await page.getByRole("button",{name:"Continue lesson"}).click();
 await expect(textbox).toHaveValue("");
});
test("IME-composition on ungraded textarea never submits on Enter, ordinary Enter inserts newline",async({page})=>{
 await resumeWriting(page,"zh");
 const textbox=page.getByRole("textbox",{name:"Your response"});
 await textbox.fill("你好。");
 await textbox.dispatchEvent("compositionstart",{data:"你好"});
 await textbox.press("Enter");
 await expect(page.getByText("Ungraded practice")).toHaveCount(0);
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
 await textbox.dispatchEvent("compositionend",{data:"你好"});
 await textbox.press("Enter");
 await expect(textbox).toHaveValue("你好。\n");
 await expect(page.getByText("Ungraded practice")).toHaveCount(0);
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
});
test("320×420 mobile writing remains editable with lesson actions visible",async({page})=>{
 await page.setViewportSize({width:320,height:420});
 await resumeWriting(page,"fr");
 const textbox=page.getByRole("textbox",{name:"Your response"});
 await textbox.fill("Bonjour, madame. Je m’appelle Inès.");
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeInViewport();
 await expect(page.getByRole("button",{name:"Previous"})).toBeInViewport();
 await expect(page.getByRole("navigation",{name:"Mobile primary"})).toBeVisible();
 const extra=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(extra).toBeLessThanOrEqual(1);
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Revise writing"}).click();
 await expect(textbox).toBeFocused();
});
