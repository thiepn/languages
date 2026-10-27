import {expect,type Page} from "@playwright/test";
import raw from "../../../contracts/fixtures/phase02-source-lessons.json" with {type:"json"};
import type {LessonBundleV1} from "../../../packages/content-schema/src/lesson-v1";

/** Acceptance-only helper. Production scoring stays in the one original evaluator. */
export async function completePhase13Independent(page:Page,languageId:"fr"|"ja"|"zh"){
 const bundle=(raw.bundles as unknown as LessonBundleV1[]).find(b=>b.lesson.languageId===languageId);
 if(!bundle)throw Error("Missing original fixture");
 const tasks=bundle.exercises.filter(e=>e.id.startsWith(languageId+"-p13-"));
 expect(tasks).toHaveLength(2);
 for(const exercise of tasks){
  await expect(page.getByRole("heading",{name:exercise.instruction})).toBeFocused();
  if(exercise.kind==="typed"||exercise.kind==="cloze"){
   await page.getByRole("textbox",{name:"Your answer"}).fill(exercise.acceptedAnswers[0]!);
  }else if(exercise.kind==="ordering"){
   for(const index of exercise.acceptedAnswers[0].split(",").map(Number))
     await page.getByRole("button",{name:"Add "+exercise.tokens[index]!}).click();
  }else if(exercise.kind==="reading"||exercise.kind==="choice"){
   await page.getByRole("radio").nth(exercise.options.indexOf(exercise.acceptedAnswers[0])).check();
  }else throw Error("Unexpected exercise kind");
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.getByText("Answer accepted")).toBeVisible();
  await page.getByRole("button",{name:"Continue",exact:true}).click();
 }
}
