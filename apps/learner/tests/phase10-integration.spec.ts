import {test,expect,type Page} from "@playwright/test";
import raw from "../../../contracts/fixtures/phase02-source-lessons.json" with {type:"json"};

const languageNames={fr:"French",ja:"Japanese",zh:"Chinese"} as const;
type Language=keyof typeof languageNames;
const bundles=Object.fromEntries(raw.bundles.map(bundle=>[bundle.lesson.languageId,bundle]));

async function restore(page:Page,language:Language,index:number){
  await page.goto("/");
  if(language!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(language);
  const bundle=bundles[language],key=bundle.lesson.id+"@"+bundle.lesson.contentVersion;
  await page.evaluate(({key,index})=>
    sessionStorage.setItem("thiepn-languages-phase03-preview-v1",JSON.stringify({version:1,positions:{[key]:index}})),{key,index});
  await page.reload();
  await page.getByRole("button",{name:"Continue "+languageNames[language]}).click();
}

for(const language of ["fr","ja","zh"] as const){
  test(language+" integrates ungraded writing review and accurate activity progress",async({page})=>{
    await page.goto("/");
    if(language!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(language);
    await page.getByRole("button",{name:language==="fr"?"Start French lesson":"Start lesson"}).click();
    await expect(page.getByText("Activity 1 of 20")).toBeVisible();
    await expect(page.locator("#lesson-progress")).toHaveJSProperty("value",0);
    await restore(page,language,18);
    await expect(page.getByText("Activity 19 of 20")).toBeVisible();
    await expect(page.locator("#lesson-progress")).toHaveJSProperty("value",18);
    const response=page.getByRole("textbox",{name:"Your response"});
    await response.fill(language==="fr"?"Bonsoir, madame. Je m’appelle Inès. Au revoir.":
      language==="ja"?"朝：おはようございます。昼：こんにちは。":
      "你好。你喜欢喝茶吗？这个苹果很好吃。");
    await expect(page.getByRole("button",{name:"Review writing"})).toBeEnabled();
    await expect(page.getByRole("button",{name:"Check answer"})).toHaveCount(0);
    await page.getByRole("button",{name:"Review writing"}).click();
    await expect(page.getByText("Ungraded practice")).toBeVisible();
    await page.getByRole("button",{name:"Continue",exact:true}).click();
    await expect(page.getByText("Activity 20 of 20")).toBeVisible();
    await page.getByRole("button",{name:"Finish preview"}).click();
    await expect(page.getByText("20 of 20 activities reached")).toBeVisible();
    await expect(page.getByText("No learning grade or review progress was recorded.",{exact:false})).toBeVisible();
    const stored=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
    expect(stored).not.toContain("Ungraded practice");
    expect(stored).not.toContain("responseText");
    expect(stored).not.toContain("grade");
    expect(await page.evaluate(()=>localStorage.length)).toBe(0);
  });
}

test("versioned recovery rejects malformed and stale progress without granting completion",async({page})=>{
  await page.goto("/");
  const lesson=bundles.fr.lesson;
  await page.evaluate(id=>sessionStorage.setItem("thiepn-languages-phase03-preview-v1",
    JSON.stringify({version:1,positions:{[id+"@unpublished-other-version"]:20,"not-a-source-id":20}})),lesson.id);
  await page.reload();
  await page.getByRole("button",{name:"Start French lesson"}).click();
  await expect(page.getByText("Activity 1 of 20")).toBeVisible();
  await expect(page.getByRole("heading",{name:"Read these expressions"})).toBeFocused();
  await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeEnabled();
});
