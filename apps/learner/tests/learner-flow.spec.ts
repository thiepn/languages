import {test,expect} from "@playwright/test";

test("French enters the actual shared lesson and checks a bounded answer",async({page})=>{
  await page.goto("/");
  await expect(page.getByRole("heading",{name:"Home"})).toBeVisible();
  await page.getByRole("button",{name:"Start French lesson"}).click();
  await expect(page.getByRole("heading",{name:"First French words and sounds"})).toBeVisible();
  await expect(page.getByText("Bonjour ! Je m’appelle Inès.")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Understand the pattern"})).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Which greeting is suited to an unfamiliar teacher?"})).toBeVisible();
  await page.getByRole("radio",{name:/Bonjour, madame/}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.getByText("Answer accepted")).toBeVisible();
  await expect(page.getByText("Practice feedback only — no review grade is recorded.")).toHaveCount(0);
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await page.getByRole("textbox",{name:"Your answer"}).fill("appelle");
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.getByText("Answer accepted")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await page.getByRole("textbox",{name:"Your response"}).fill("Bonjour, je m’appelle Sam. Au revoir.");
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.getByText("Ungraded practice")).toBeVisible();
  await page.getByRole("button",{name:"Finish preview"}).click();
  await expect(page.getByRole("heading",{name:"Preview complete"})).toBeVisible();
  await expect(page.getByText(/No learning grade or review progress was recorded/)).toBeVisible();
});

test("Japanese and Chinese use the same navigation and step player",async({page})=>{
  await page.goto("/");
  await page.getByRole("combobox",{name:"Study language"}).selectOption("ja");
  await expect(page.getByRole("heading",{name:"Course"})).toBeVisible();
  await page.getByRole("button",{name:"Start lesson"}).click();
  await expect(page.getByRole("heading",{name:"Greetings at different times"})).toBeVisible();
  await expect(page.getByText("朝：おはようございます。")).toBeVisible();
  await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
  await page.getByRole("button",{name:"Start lesson"}).click();
  await expect(page.getByRole("heading",{name:"你好: characters in a greeting"})).toBeVisible();
  await expect(page.getByText("nǐ hǎo")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Understand the pattern"})).toBeVisible();
});

test("demo continuation survives a refresh without persisting any answers",async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:"Start French lesson"}).click();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  const checkpoint=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
  expect(checkpoint).toContain('"version":1');
  expect(checkpoint).not.toContain("Bonjour");
  expect(checkpoint).not.toContain("accountId");
  await page.reload();
  await expect(page.getByRole("heading",{name:"Home"})).toBeVisible();
  await page.getByRole("button",{name:"Continue French"}).click();
  await expect(page.getByRole("heading",{name:"Understand the pattern"})).toBeVisible();
  await page.getByRole("button",{name:"Profile"}).last().click();
  await expect(page.getByText("Not connected in preview")).toBeVisible();
  await page.getByRole("button",{name:"Clear demo continuation"}).click();
  const after=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
  expect(after===null||after.includes('"positions":{}')).toBeTruthy();
});

test("Review refuses to fabricate due cards or learner grades",async({page})=>{
  await page.goto("/");
  const reviewButtons=page.getByRole("button",{name:"Review",exact:true});
  await reviewButtons.first().click();
  await expect(page.getByRole("heading",{name:"Scheduled reviews unavailable"})).toBeVisible();
  await expect(page.getByText(/retain review authority/)).toBeVisible();
  expect(await page.getByRole("button",{name:/grade|mark mastered|review now/i}).count()).toBe(0);
});

test("small viewport keeps primary actions and navigation accessible",async({page})=>{
  await page.setViewportSize({width:360,height:690});
  await page.goto("/");
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.getByRole("button",{name:"Start French lesson"}).click();
  await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeInViewport();
  await expect(page.getByRole("button",{name:"Previous"})).toBeVisible();
  await expect(page.getByRole("navigation",{name:"Mobile primary"})).toBeVisible();
  const overflowLesson=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflowLesson).toBeLessThanOrEqual(1);
});
