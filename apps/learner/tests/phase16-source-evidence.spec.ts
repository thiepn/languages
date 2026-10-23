import {test,expect,type Page} from "@playwright/test";
import firstRaw from "../../../contracts/fixtures/phase02-source-lessons.json" with {type:"json"};
import secondRaw from "../../../contracts/fixtures/phase15-source-lessons.json" with {type:"json"};
const first=Object.fromEntries(firstRaw.bundles.map(b=>[b.lesson.languageId,b]));
const second=Object.fromEntries(secondRaw.bundles.map(b=>[b.lesson.languageId,b]));
for(const lang of ["fr","ja","zh"]){
 test(lang+" course exposes original and source-grounded next lesson",async({page})=>{
  await page.goto("/");
  if(lang!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(lang);
  await page.getByRole("button",{name:"Course",exact:true}).click();
  await expect(page.getByRole("button",{name:"Open "+first[lang].lesson.title})).toBeVisible();
  await page.getByRole("button",{name:"Open "+second[lang].lesson.title}).click();
  await expect(page.getByRole("heading",{name:second[lang].lesson.title})).toBeVisible();
  await page.getByRole("button",{name:"← Course"}).click();
  await expect(page.getByRole("heading",{name:second[lang].lesson.sources[0].originalEntityId})).toBeVisible();
 });
}
test("incorrect French subject form offers distinct original contrast and prevents next activity",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 await page.getByRole("button",{name:"Open Who are you? Using être"}).click();
 for(let i=0;i<4;i++)await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByRole("radio").first().check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.getByText("Sommes belongs to nous, not vous.")).toBeVisible();
 await page.getByText("Compare source contexts").click();
 await expect(page.getByText("Nous sommes à Lyon.")).toBeVisible();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
});
test("Chinese 好 original source-specific practice stays accessible at 320px",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 await expect(page.getByRole("heading",{name:"好",exact:true})).toBeVisible();
 await page.getByRole("button",{name:/Practice: Compose a short two-person scene/}).click();
 await expect(page.getByRole("textbox",{name:"Your response"})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
