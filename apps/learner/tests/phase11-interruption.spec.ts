import {test,expect,type Page} from "@playwright/test";
import raw from "../../../contracts/fixtures/phase02-source-lessons.json" with {type:"json"};
const catalog=Object.fromEntries(raw.bundles.map(bundle=>[bundle.lesson.languageId,bundle]));
const names={fr:"French",ja:"Japanese",zh:"Chinese"} as const;
type Lang=keyof typeof names;

async function enterWriting(page:Page,lang:Lang){
  await page.goto("/");
  if(lang!=="fr")await page.getByRole("combobox",{name:"Study language"}).selectOption(lang);
  const b=catalog[lang],key=b.lesson.id+"@"+b.lesson.contentVersion;
  await page.evaluate(({key})=>{
    sessionStorage.setItem("thiepn-languages-phase03-preview-v1",JSON.stringify({version:1,positions:{[key]:18}}));
  },{key});
  await page.reload();
  await page.getByRole("button",{name:"Continue "+names[lang]}).click();
}

for(const lang of ["fr","ja","zh"] as const){
  test(lang+" cancelled language switch preserves private writing without storage",async({page})=>{
    await enterWriting(page,lang);
    const draft=lang==="fr"?"Bonsoir, madame. Je m’appelle Inès.":
      lang==="ja"?"朝：おはようございます。夜：こんばんは。":
      "你好。你喜欢喝茶吗？";
    const field=page.getByRole("textbox",{name:"Your response"});
    await field.fill(draft);
    const alternate=lang==="ja"?"zh":"ja";
    let dialogText="";
    page.once("dialog",async dialog=>{dialogText=dialog.message();await dialog.dismiss();});
    await page.getByRole("combobox",{name:"Study language"}).selectOption(alternate);
    expect(dialogText).toContain("Discard unsent writing?");
    await expect(page.getByRole("combobox",{name:"Study language"})).toHaveValue(lang);
    await expect(field).toHaveValue(draft);
    await expect(page.getByRole("heading",{name:catalog[lang].lesson.title})).toBeVisible();

    let accepted="";
    page.once("dialog",async dialog=>{accepted=dialog.message();await dialog.accept();});
    await page.getByRole("combobox",{name:"Study language"}).selectOption(alternate);
    expect(accepted).toContain("Discard unsent writing?");
    await expect(page.getByRole("combobox",{name:"Study language"})).toHaveValue(alternate);
    await page.getByRole("combobox",{name:"Study language"}).selectOption(lang);
    await page.getByRole("button",{name:"Continue lesson"}).click();
    await expect(page.getByRole("textbox",{name:"Your response"})).toHaveValue("");
    const checkpoint=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
    expect(checkpoint).not.toContain(draft);
    expect(await page.evaluate(()=>localStorage.length)).toBe(0);
  });
}

test("clear preview only discards an unsent writing draft with explicit consent",async({page})=>{
  await enterWriting(page,"zh");
  await page.getByRole("textbox",{name:"Your response"}).fill("你好。你喜欢喝茶吗？");
  await page.getByRole("button",{name:"Profile",exact:true}).first().click();
  await expect(page.getByRole("heading",{name:"Profile"})).toBeVisible();
  let cancelled=0;
  page.once("dialog",async dialog=>{cancelled++;await dialog.dismiss();});
  await page.getByRole("button",{name:"Clear demo continuation"}).click();
  expect(cancelled).toBe(1);
  await expect(page.getByRole("combobox",{name:"Study language"})).toHaveValue("zh");
  page.once("dialog",async dialog=>{await dialog.accept();});
  await page.getByRole("button",{name:"Clear demo continuation"}).click();
  await expect(page.getByRole("combobox",{name:"Study language"})).toHaveValue("fr");
  await expect(page.getByText("Demo activity positions only, stored in this browser tab")).toBeVisible();
});

test("submitted ungraded writing changes language without a loss prompt",async({page})=>{
  await enterWriting(page,"fr");
  await page.getByRole("textbox",{name:"Your response"}).fill("Bonjour. Je m’appelle Inès.");
  await page.getByRole("button",{name:"Review writing"}).click();
  await expect(page.getByText("Ungraded practice")).toBeVisible();
  let dialogs=0;
  page.on("dialog",async dialog=>{dialogs++;await dialog.dismiss();});
  await page.getByRole("combobox",{name:"Study language"}).selectOption("ja");
  await expect(page.getByRole("combobox",{name:"Study language"})).toHaveValue("ja");
  expect(dialogs).toBe(0);
});
