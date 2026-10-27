import {test,expect} from "@playwright/test";

test("keyboard focus follows visible teaching and exercise headings",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"Start French lesson"}).focus();
 await page.keyboard.press("Enter");
 await expect(page.getByRole("heading",{name:"Read these expressions"})).toBeFocused();
 await page.getByRole("button",{name:"Continue",exact:true}).focus();
 await page.keyboard.press("Enter");
 await expect(page.getByRole("heading",{name:"Understand the pattern"})).toBeFocused();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByRole("heading",{name:"Choose by context"})).toBeFocused();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByRole("heading",{name:"Which greeting is suited to an unfamiliar teacher?"})).toBeFocused();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
});

test("reducer gates wrong answers, then preserves volatile success on back navigation",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"Start French lesson"}).click();
 for(let i=0;i<3;i++)await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByRole("radio").first().check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.getByText("Not quite — try again")).toBeVisible();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
 await page.getByRole("button",{name:"Try again"}).click();
 await expect(page.getByRole("radio").first()).not.toBeChecked();
 await page.getByRole("radio",{name:/Bonjour, madame/}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByRole("button",{name:"Previous"}).click();
 await expect(page.getByText("Answer accepted")).toBeVisible();
 await page.reload();
 await page.getByRole("button",{name:"Continue French"}).click();
 await expect(page.getByText("Answer accepted")).toHaveCount(0);
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
});

test("revealed answers remain uncredited in memory and omitted from storage",async({page})=>{
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("ja");
 await page.getByRole("button",{name:"Start lesson"}).click();
 for(let i=0;i<3;i++)await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByRole("radio").last().check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Show answer"}).click();
 await expect(page.getByText("Answer revealed — not credited")).toBeVisible();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByRole("button",{name:"Previous"}).click();
 await expect(page.getByText("Answer revealed — not credited")).toBeVisible();
 const stored=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
 expect(stored).not.toContain("revealed");
 expect(stored).not.toContain("おはよう");
});

test("switching between languages never copies answers or feedback",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"Start French lesson"}).click();
 for(let i=0;i<3;i++)await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByRole("radio",{name:/Bonjour, madame/}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
 await page.getByRole("button",{name:"Start lesson"}).click();
 await expect(page.getByRole("heading",{name:"Read these expressions"})).toBeVisible();
 await page.getByRole("combobox",{name:"Study language"}).selectOption("fr");
 await page.getByRole("button",{name:"Continue lesson"}).click();
 await expect(page.getByRole("heading",{name:"Which greeting is suited to an unfamiliar teacher?"})).toBeVisible();
 await expect(page.getByText("Answer accepted")).toHaveCount(0);
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
});

test("mobile lesson actions remain visible in reduced viewport during input",async({page})=>{
 await page.setViewportSize({width:360,height:640});
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
 await page.getByRole("button",{name:"Start lesson"}).click();
 for(let i=0;i<3;i++)await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByRole("radio",{name:"你好",exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByRole("textbox",{name:"Your answer"}).focus();
 await page.setViewportSize({width:360,height:420});
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeInViewport();
 await expect(page.getByRole("navigation",{name:"Mobile primary"})).toBeVisible();
 await expect(page.getByRole("button",{name:"Previous"})).toBeInViewport();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
