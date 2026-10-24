import {test,expect} from "@playwright/test";
import raw from "../../../contracts/fixtures/phase02-source-lessons.json" with {type:"json"};
const lessons=Object.fromEntries(raw.bundles.map(bundle=>[bundle.lesson.languageId,bundle]));
for(const language of ["fr","ja","zh"] as const){
 test(language+" opens source-linked independent practice using the original player",async({page})=>{
  await page.goto("/");
  if(language!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(language);
  await page.getByRole("button",{name:"Course",exact:true}).click();
  const bundle=lessons[language];
  const slug=language==="fr"?"independent-etre":language==="ja"?"shop-afternoon":"plural-pinyin";
  const exercise=bundle.exercises.find(x=>x.id===language+"-p13-"+slug);
  await page.getByRole("button",{name:"Practice: "+exercise.instruction}).click();
  await expect(page.getByRole("heading",{name:exercise.instruction})).toBeFocused();
  await expect(page.getByText("Activity 20 of 22")).toBeVisible();
  await expect(page.getByText("Practice feedback only — no review grade is recorded.")).toBeVisible();
  const store=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
  expect(store).not.toContain("acceptedAnswers");
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 });
}
test("Chinese lists two original source owners with independent source practice",async({page})=>{
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
 const region=page.getByRole("region",{name:"Original source practice"});
 await expect(region).toContainText("你");
 await expect(region).toContainText("好");
 await expect(region).toContainText("Editorial review pending");
 expect(await region.getByRole("button",{name:/^Practice:/}).count()).toBeGreaterThanOrEqual(10);
});
test("a rejected source switch preserves unfinished authored writing",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 const writing=lessons.fr.exercises.find(x=>x.id==="fr-p09-context-composition");
 await page.getByRole("button",{name:"Practice: "+writing.instruction}).click();
 await page.getByRole("textbox",{name:"Your response"}).fill("My unpublished writing");
 await page.getByRole("button",{name:"← Course"}).click();
 page.once("dialog",dialog=>dialog.dismiss());
 const other=lessons.fr.exercises.find(x=>x.id==="fr-p13-independent-etre");
 await page.getByRole("button",{name:"Practice: "+other.instruction}).click();
 await expect(page.getByRole("heading",{name:"Course"})).toBeVisible();
 await page.getByRole("button",{name:"Continue lesson"}).click();
 await expect(page.getByRole("textbox",{name:"Your response"})).toHaveValue("My unpublished writing");
});
test("a 320px device can launch source practice without page overflow",async({page})=>{
 await page.setViewportSize({width:320,height:420});
 await page.goto("/");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 const first=page.getByRole("region",{name:"Original source practice"}).getByRole("button",{name:/^Practice:/}).first();
 await expect(first).toBeVisible();
 await first.click();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
