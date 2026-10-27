import {test,expect} from "@playwright/test";

test("French wrong-register feedback is specific and accessible without granting passage",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"Start French lesson"}).click();
 for(let i=0;i<3;i++)await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByRole("radio",{name:"Salut, madame."}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 const message=page.locator(".feedback.incorrect");
 await expect(message).toContainText("formal encounter");
 await expect(message).toBeFocused();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
 await page.getByRole("button",{name:"Try again"}).click();
 await expect(page.getByRole("radio").first()).toBeFocused();
 await page.getByRole("radio",{name:"Bonjour, madame."}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.getByText("Answer accepted")).toBeVisible();
});

test("Japanese composition Enter does not prematurely submit during IME conversion",async({page})=>{
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("ja");
 await page.getByRole("button",{name:"Start lesson"}).click();
 for(let i=0;i<3;i++)await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByRole("radio",{name:"おはようございます。"}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 const input=page.getByRole("textbox",{name:"Your answer"});
 await input.fill("おはようございます。");
 await input.dispatchEvent("compositionstart",{data:"おはようございます"});
 await input.press("Enter");
 await expect(page.getByText("Answer accepted")).toHaveCount(0);
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeDisabled();
 await input.dispatchEvent("compositionend",{data:"おはようございます。"});
 await input.press("Enter");
 await expect(page.getByText("Answer accepted")).toBeVisible();
 await expect(page.locator(".feedback.correct")).toBeFocused();
});

test("Chinese independent contextual reading and versioned resume do not store response text",async({page})=>{
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
 await page.getByRole("button",{name:"Start lesson"}).click();
 for(let i=0;i<3;i++)await page.getByRole("button",{name:"Continue",exact:true}).click();
 const first=page.getByRole("radio",{name:"你好",exact:true});
 await first.check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByRole("textbox",{name:"Your answer"}).fill("你好");
 await page.reload();
 await page.getByRole("button",{name:"Continue Chinese"}).click();
 await expect(page.getByRole("textbox",{name:"Your answer"})).toHaveValue("");
 const storage=await page.evaluate(()=>sessionStorage.getItem("thiepn-languages-phase03-preview-v1"));
 expect(storage).not.toContain("你好");
 expect(storage).not.toContain("acceptedAnswers");
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
});

test("short mobile viewport preserves lesson actions and keyboard access",async({page})=>{
 await page.setViewportSize({width:320,height:420});
 await page.goto("/");
 await page.getByRole("button",{name:"Start French lesson"}).click();
 await expect(page.getByRole("button",{name:"Continue",exact:true})).toBeInViewport();
 await expect(page.getByRole("button",{name:"Previous"})).toBeInViewport();
 await expect(page.getByRole("navigation",{name:"Mobile primary"})).toBeVisible();
 const horizontal=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(horizontal).toBeLessThanOrEqual(1);
 await page.getByRole("button",{name:"Continue",exact:true}).focus();
 await page.keyboard.press("Enter");
 await expect(page.getByRole("heading",{name:"Understand the pattern"})).toBeFocused();
});
