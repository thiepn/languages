import {test,expect,type Page} from "@playwright/test";
import raw from "../../../contracts/fixtures/phase02-source-lessons.json" with {type:"json"};

const byLang=Object.fromEntries(raw.bundles.map(b=>[b.lesson.languageId,b]));
async function reachCloze(page:Page,lang:string){
 await page.goto("/");
 if(lang!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(lang);
 await page.getByRole("button",{name:lang==="fr"?"Start French lesson":"Start lesson"}).click();
 for(let i=0;i<7;i++){
  const next=page.getByRole("button",{name:"Continue",exact:true});
  if(await next.isEnabled()){await next.click();continue;}
  const prompt=await page.locator(".activity h2").innerText();
  const ex=byLang[lang].exercises.find(e=>e.instruction===prompt);
  if(!ex)throw Error("Missing exercise "+prompt);
  if(ex.kind==="choice"||ex.kind==="reading"){
   const inputs=await page.getByRole("radio").all();
   const opts=await Promise.all(inputs.map(x=>x.inputValue()));
   await inputs[opts.indexOf(ex.acceptedAnswers[0])].check();
  }else await page.getByRole("textbox",{name:"Your answer"}).fill(ex.acceptedAnswers[0]);
  await page.getByRole("button",{name:"Check answer"}).click();
  await next.click();
 }
}
for(const lang of ["fr","ja","zh"]){
 test(lang+" expanded exercises are keyboard-accessible and source-checked",async({page})=>{
  await reachCloze(page,lang);
  const [cloze,order,reading]=byLang[lang].exercises.filter(e=>["cloze","ordering","reading"].includes(e.kind));
  await expect(page.getByRole("heading",{name:cloze.instruction})).toBeFocused();
  await page.getByRole("textbox",{name:"Your answer"}).fill(cloze.acceptedAnswers[0]);
  await page.getByRole("textbox",{name:"Your answer"}).press("Enter");
  await expect(page.getByText("Answer accepted")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.getByRole("heading",{name:order.instruction})).toBeFocused();
  await expect(page.getByRole("button",{name:"Check answer"})).toBeDisabled();
  const ids=order.acceptedAnswers[0].split(",").map(Number);
  await page.getByRole("button",{name:"Add "+order.tokens[ids[0]]}).click();
  await page.getByRole("button",{name:"Undo last"}).click();
  for(const i of ids)await page.getByRole("button",{name:"Add "+order.tokens[i]}).click();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.getByText("Answer accepted")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.getByRole("heading",{name:reading.instruction})).toBeFocused();
  await expect(page.getByText(reading.question)).toBeVisible();
  await expect(page.locator(".passage-text")).toContainText(reading.passage.split("\n")[0]);
  await page.getByRole("radio").nth(reading.options.indexOf(reading.acceptedAnswers[0])).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.getByText("Answer accepted")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  const storage=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
  expect(storage).not.toContain("acceptedAnswers");
  expect(storage).not.toContain("correct");
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 });
}
test("incorrect ordering cannot advance; explicit reveal is not credit",async({page})=>{
 await reachCloze(page,"zh");
 const order=byLang.zh.exercises.find(e=>e.kind==="ordering");
 await page.getByRole("textbox",{name:"Your answer"}).fill("好吃");
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 for(const i of [0,1,2])await page.getByRole("button",{name:"Add "+order.tokens[i]}).click();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.getByText("Not quite — try again")).toBeVisible();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
 await page.getByRole("button",{name:"Show answer"}).click();
 await expect(page.getByText("Answer revealed — not credited")).toBeVisible();
 await expect(page.getByText("你 好 ！",{exact:false})).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByRole("heading",{name:/Read the original-source meanings/})).toBeFocused();
});
test("mobile interruption loses answer draft but restores exact cloze position",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await reachCloze(page,"ja");
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeInViewport();
 await expect(page.getByRole("navigation",{name:"Mobile primary"})).toBeVisible();
 await page.getByRole("textbox",{name:"Your answer"}).fill("こんばんは");
 await page.reload();
 await page.getByRole("button",{name:"Continue Japanese"}).click();
 await expect(page.getByRole("heading",{name:/Complete the evening greeting/})).toBeFocused();
 await expect(page.getByRole("textbox",{name:"Your answer"})).toHaveValue("");
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
 const storage=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
 expect(storage).not.toContain("こんばんは");
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
