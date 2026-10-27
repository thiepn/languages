import {test,expect} from "@playwright/test";
const candidates=[
 {title:"Greetings across the day",guided:"Salut, Inès. Moi, c’est Malik.",wrong:"Bonsoir, monsieur.",cloze:"m’appelle",independent:"Bonsoir, monsieur."},
 {title:"Introductions and departures",guided:"Je m’appelle Inès.",wrong:"Bonsoir, monsieur.",cloze:"revoir",independent:"Au revoir, à demain."},
 {title:"Être with a speaker and a group",guided:"Nous sommes à Lyon.",wrong:"Je suis professeur.",cloze:"sommes",independent:"Elles sont étudiantes."},
 {title:"Places, people and agreement",guided:"Tu es étudiante ?",wrong:"Il est à Paris.",cloze:"es",independent:"Elle est française."},
 {title:"First mentions and known objects",guided:"Voici des stylos.",wrong:"C’est un livre.",cloze:"un",independent:"Le livre est sur la table."},
 {title:"Feminine, elision and plural reference",guided:"L’école est ouverte.",wrong:"Une table est ici.",cloze:"école",independent:"Regarde : les stylos sont sur la table."}
] as const;
for(const example of candidates){
 test("Phase 23 French source-backed teaching, correction and independent writing: "+example.title,async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:"Course",exact:true}).click();
  await expect(page.locator(".course-sequence li")).toHaveCount(4);
  await page.getByRole("button",{name:"Preview editorial draft: "+example.title}).click();
  await expect(page.getByRole("heading",{name:example.title})).toBeVisible();
  for(let i=0;i<4;i++)await page.getByRole("button",{name:"Continue"}).click();
  await page.getByRole("radio",{name:example.wrong,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await page.getByRole("button",{name:"Try again"}).click();
  await page.getByRole("radio",{name:example.guided,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.correct")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await page.getByRole("textbox",{name:"Your answer"}).fill("incorrect form");
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await page.getByRole("button",{name:"Try again"}).click();
  await page.getByRole("textbox",{name:"Your answer"}).fill(example.cloze);
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.correct")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await expect(page.locator(".reading-passage")).toBeVisible();
  await page.getByRole("radio",{name:example.independent,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.correct")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await page.getByRole("radio",{name:example.independent,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.correct")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
  await page.getByRole("textbox",{name:"Your response"}).fill("Original French dialogue written for the changed audience.");
  await page.getByRole("button",{name:"Review writing"}).click();
  await expect(page.getByText("Ungraded practice")).toBeVisible();
  await page.getByRole("button",{name:"← Course"}).click();
  await expect(page.getByRole("heading",{name:"Course"})).toBeVisible();
  await expect(page.locator(".course-sequence li")).toHaveCount(4);
  await expect(page.getByRole("heading",{name:"First French words and sounds"})).toBeVisible();
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
  expect(await page.evaluate(()=>JSON.stringify(Object.fromEntries(Array.from({length:sessionStorage.length},(_,i)=>[sessionStorage.key(i),sessionStorage.getItem(sessionStorage.key(i)!)]))).includes("phase23-"))).toBe(false);
 });
}
test("320px French article transfer and draft preservation guard are independent of original lesson checkpoints",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.goto("/");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 await page.getByRole("button",{name:"Preview editorial draft: First mentions and known objects"}).click();
 for(let i=0;i<4;i++)await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("radio",{name:"Voici des stylos.",exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("textbox",{name:"Your answer"}).fill("un");
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("radio",{name:"Le livre est sur la table.",exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("radio",{name:"Le livre est sur la table.",exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("textbox",{name:"Your response"}).fill("C’est un livre. Le livre est sur la table.");
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 await page.reload();
 await expect(page.getByRole("heading",{name:"Home"})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
});
