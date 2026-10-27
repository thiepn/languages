import {test,expect,type Page} from "@playwright/test";
const samples=[
 {title:"A delegate checks the meeting record",guided:"我",cloze:"我们",
  repair:"你们",reconstruct:"你们",turn:"我们",wrongA:"你们",wrongB:"我",
  reading:"你们",depth:"我",role:"我们",
  oldOrder:["我","我们","你们"],shift:"你们",
  newOrder:["你们","我","我们"],final:"我",situation:"你们",tone:"nǐmen",nextRepair:"你们",nextWrong:"我们",nextReading:"我",nextTone:"wǒmen"},
 {title:"The market clerk checks a third visitor",guided:"你喜欢喝茶吗？",cloze:"吗",
  repair:"你好",reconstruct:"你喜欢喝茶吗？",turn:"这个苹果很好吃。",wrongA:"你好",wrongB:"你喜欢喝茶吗？",
  reading:"这个苹果很好吃。",depth:"这个苹果很好吃。",role:"你好",
  oldOrder:["你好","你喜欢喝茶吗？","这个苹果很好吃。"],shift:"这个苹果很好吃。",
  newOrder:["这个苹果很好吃。","你好","你喜欢喝茶吗？"],final:"你好",situation:"这个苹果很好吃。",tone:"Nǐ xǐhuan hē chá ma?",nextRepair:"这个苹果很好吃。",nextWrong:"你喜欢喝茶吗？",nextReading:"你好",nextTone:"Zhège píngguǒ hěn hǎochī."},
 {title:"The teacher verifies a corrected school record",guided:"他是老师。",cloze:"是",
  repair:"他是老师。",reconstruct:"我是学生。",turn:"不是",wrongA:"他是老师。",wrongB:"我是学生。",
  reading:"我是学生。",depth:"我是学生。",role:"他是老师。",
  oldOrder:["我是学生。","他是老师。","不是"],shift:"他是老师。",
  newOrder:["他是老师。","不是","我是学生。"],final:"我是学生。",situation:"不是",tone:"Tā shì lǎoshī.",nextRepair:"不是",nextWrong:"他是老师。",nextReading:"我是学生。",nextTone:"bú shì"},
 {title:"A visitor disputes the reception role record",guided:"我的",cloze:"我的",
  repair:"不是",reconstruct:"我的",turn:"也是",wrongA:"不是",wrongB:"我的",
  reading:"不是",depth:"也是",role:"不是",
  oldOrder:["我的","不是","也是"],shift:"也是",
  newOrder:["也是","我的","不是"],final:"我的",situation:"也是",tone:"bú shì",nextRepair:"也是",nextWrong:"不是",nextReading:"我的",nextTone:"wǒ de"}
] as const;
const thirdContext={
 "A delegate checks the meeting record":{
  reading:"你们",wrong:"我们",source:"我们",wrongSource:"你们",
  order:["我","你们","我们"]},
 "The market clerk checks a third visitor":{
  reading:"你喜欢喝茶吗？",wrong:"你好",source:"这个苹果很好吃。",wrongSource:"你喜欢喝茶吗？",
  order:["你喜欢喝茶吗？","这个苹果很好吃。","你好"]},
 "The teacher verifies a corrected school record":{
  reading:"不是",wrong:"我是学生。",source:"我是学生。",wrongSource:"不是",
  order:["不是","我是学生。","他是老师。"]},
 "A visitor disputes the reception role record":{
  reading:"我的",wrong:"不是",source:"也是",wrongSource:"不是",
  order:["不是","也是","我的"]}
} as const;
const handoff={
 "A delegate checks the meeting record":{
  before:"我们",beforeWrong:"你们",after:"你们",afterWrong:"我们",
  order:["我们","我","你们"]},
 "The market clerk checks a third visitor":{
  before:"你好",beforeWrong:"你喜欢喝茶吗？",after:"你喜欢喝茶吗？",afterWrong:"你好",
  order:["你好","这个苹果很好吃。","你喜欢喝茶吗？"]},
 "The teacher verifies a corrected school record":{
  before:"不是",beforeWrong:"我是学生。",after:"我是学生。",afterWrong:"不是",
  order:["他是老师。","我是学生。","不是"]},
 "A visitor disputes the reception role record":{
  before:"我的",beforeWrong:"也是",after:"也是",afterWrong:"我的",
  order:["我的","也是","不是"]}
} as const;
const phase32={
 "A delegate checks the meeting record":{
   first:"我们",firstWrong:"你们",second:"你们",secondWrong:"我们",
   third:"我",thirdWrong:["我们","你们"],
   fifth:["我们","你们","我"]},
 "The market clerk checks a third visitor":{
   first:"这个苹果很好吃。",firstWrong:"你喜欢喝茶吗？",
   second:"你喜欢喝茶吗？",secondWrong:"这个苹果很好吃。",
   third:"你好",thirdWrong:["这个苹果很好吃。","你喜欢喝茶吗？"],
   fifth:["这个苹果很好吃。","你喜欢喝茶吗？","你好"]},
 "The teacher verifies a corrected school record":{
   first:"我是学生。",firstWrong:"不是",second:"不是",secondWrong:"我是学生。",
   third:"他是老师。",thirdWrong:["我是学生。","不是"],
   fifth:["我是学生。","不是","他是老师。"]},
 "A visitor disputes the reception role record":{
   first:"也是",firstWrong:"不是",second:"不是",secondWrong:"也是",
   third:"我的",thirdWrong:["也是","不是"],
   fifth:["也是","不是","我的"]}
} as const;
const clarification={
 "A delegate checks the meeting record":{
  first:"我们",wrong:["你们","我"],typed:"我们",other:["你们","我"],
  after:"你们",afterWrong:"我们"},
 "The market clerk checks a third visitor":{
  first:"你喜欢喝茶吗？",wrong:["你好","这个苹果很好吃。"],typed:"你喜欢喝茶吗？",other:["你好","这个苹果很好吃。"],
  after:"你好",afterWrong:"你喜欢喝茶吗？"},
 "The teacher verifies a corrected school record":{
  first:"不是",wrong:["我是学生。","他是老师。"],typed:"不是",other:["我是学生。","他是老师。"],
  after:"我是学生。",afterWrong:"不是"},
 "A visitor disputes the reception role record":{
  first:"我的",wrong:["也是","不是"],typed:"我的",other:["也是","不是"],
  after:"也是",afterWrong:"我的"}
} as const;
const counterfactual={
 "A delegate checks the meeting record":{
  third:"我",thirdWrong:["我们","你们"],back:"我们",backWrong:["我","你们"],
  typed:"你们",typedWrong:["我","我们"]},
 "The market clerk checks a third visitor":{
  third:"这个苹果很好吃。",thirdWrong:["你喜欢喝茶吗？","你好"],
  back:"你喜欢喝茶吗？",backWrong:["这个苹果很好吃。","你好"],
  typed:"你好",typedWrong:["你喜欢喝茶吗？","这个苹果很好吃。"]},
 "The teacher verifies a corrected school record":{
  third:"他是老师。",thirdWrong:["不是","我是学生。"],
  back:"不是",backWrong:["他是老师。","我是学生。"],
  typed:"我是学生。",typedWrong:["不是","他是老师。"]},
 "A visitor disputes the reception role record":{
  third:"不是",thirdWrong:["我的","也是"],
  back:"我的",backWrong:["不是","也是"],
  typed:"也是",typedWrong:["不是","我的"]}
} as const;
const phase34={
 "A delegate checks the meeting record":{
  decision:"你们",wrong:["我","我们"],
  sixth:["你们","我们","我"],pinyin:"wǒmen",otherPinyin:"nǐmen"},
 "The market clerk checks a third visitor":{
  decision:"你喜欢喝茶吗？",wrong:["你好","这个苹果很好吃。"],
  sixth:["你喜欢喝茶吗？","你好","这个苹果很好吃。"],
  pinyin:"nǐ hǎo",otherPinyin:"Nǐ xǐhuan hē chá ma?"},
 "The teacher verifies a corrected school record":{
  decision:"不是",wrong:["他是老师。","我是学生。"],
  sixth:["不是","他是老师。","我是学生。"],pinyin:"bú shì",otherPinyin:"Tā shì lǎoshī."},
 "A visitor disputes the reception role record":{
  decision:"不是",wrong:["我的","也是"],
  sixth:["不是","我的","也是"],pinyin:"yě shì",otherPinyin:"bú shì"}
} as const;
const evidenceSwitch={
 "A delegate checks the meeting record":{
  first:"我们",firstWrong:["你们","我"],after:"你们",afterWrong:["我们","我"],
  typed:"我",typedWrong:["我们","你们"]},
 "The market clerk checks a third visitor":{
  first:"你喜欢喝茶吗？",firstWrong:["这个苹果很好吃。","你好"],
  after:"这个苹果很好吃。",afterWrong:["你喜欢喝茶吗？","你好"],
  typed:"你好",typedWrong:["你喜欢喝茶吗？","这个苹果很好吃。"]},
 "The teacher verifies a corrected school record":{
  first:"不是",firstWrong:["我是学生。","他是老师。"],
  after:"我是学生。",afterWrong:["不是","他是老师。"],
  typed:"他是老师。",typedWrong:["不是","我是学生。"]},
 "A visitor disputes the reception role record":{
  first:"我的",firstWrong:["也是","不是"],
  after:"也是",afterWrong:["我的","不是"],
  typed:"不是",typedWrong:["我的","也是"]}
} as const;
const verification={
 "A delegate checks the meeting record":{
  witness:"我",witnessWrong:["我们","你们"],returnQuote:"我们",returnWrong:["我","你们"],
  hanzi:"你们",hanziWrong:["我们","我"],pinyin:"wǒ",sourceWrong:"wǒmen"},
 "The market clerk checks a third visitor":{
  witness:"你好",witnessWrong:["你喜欢喝茶吗？","这个苹果很好吃。"],
  returnQuote:"你喜欢喝茶吗？",returnWrong:["你好","这个苹果很好吃。"],
  hanzi:"这个苹果很好吃。",hanziWrong:["你好","你喜欢喝茶吗？"],
  pinyin:"Zhège píngguǒ hěn hǎochī.",sourceWrong:"Nǐ xǐhuan hē chá ma?"},
 "The teacher verifies a corrected school record":{
  witness:"他是老师。",witnessWrong:["不是","我是学生。"],
  returnQuote:"不是",returnWrong:["他是老师。","我是学生。"],
  hanzi:"我是学生。",hanziWrong:["不是","他是老师。"],
  pinyin:"Tā shì lǎoshī.",sourceWrong:"Wǒ shì xuésheng."},
 "A visitor disputes the reception role record":{
  witness:"不是",witnessWrong:["我的","也是"],
  returnQuote:"我的",returnWrong:["不是","也是"],
  hanzi:"也是",hanziWrong:["我的","不是"],
  pinyin:"bú shì",sourceWrong:"yě shì"}
} as const;
type C=typeof samples[number];
async function choice(page:Page,answer:string){
 await page.getByRole("radio",{name:answer,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
}
async function fill(page:Page,answer:string){
 await page.getByRole("textbox",{name:"Your answer"}).fill(answer);
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
}
async function failedChoice(page:Page,wrong:string,correct:string){
 await page.getByRole("radio",{name:wrong,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await page.getByRole("button",{name:"Try again"}).click();
 await choice(page,correct);
}
async function order(page:Page,turns:readonly string[]){
 for(const turn of turns)await page.getByRole("button",{name:"Add "+turn,exact:true}).click();
 await page.getByRole("button",{name:"Check answer"}).click();
}
async function journey(page:Page,c:C){
 await page.goto("/");
 await page.getByRole("combobox",{name:"Study language"}).selectOption("zh");
 await page.getByRole("button",{name:"Course",exact:true}).click();
 await expect(page.locator(".course-sequence li")).toHaveCount(4);
 await page.getByRole("button",{name:"Preview editorial draft: "+c.title}).click();
 await expect(page.getByRole("heading",{name:c.title})).toBeVisible();
 for(let i=0;i<4;i++)await page.getByRole("button",{name:"Continue"}).click();
 await choice(page,c.guided);
 await fill(page,c.cloze);
 await choice(page,c.repair);
 await fill(page,c.reconstruct);
 // Two independently authored misconception cases lead to separate source-specific repair,
 // and neither incorrect source answer can advance the original player.
 await failedChoice(page,c.wrongA,c.turn);
 await failedChoice(page,c.nextWrong,c.nextRepair);
 await expect(page.locator(".reading-passage")).toBeVisible();
 await choice(page,c.reading);
 await expect(page.locator(".reading-passage")).toContainText("New practice situation (not a source transcript):");
 await choice(page,c.depth);
 await expect(page.locator(".reading-passage")).toContainText("New changed-role context (not an original source conversation):");
 await choice(page,c.role);
 await expect(page.locator(".order-activity")).toBeVisible();
 await order(page,c.oldOrder);
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
 await expect(page.locator(".reading-passage")).toContainText("New authored follow-up, not a source dialogue:");
 await choice(page,c.shift);
 // Previously correct Phase 28 source ordering is now the wrong answer in the new scenario.
 await expect(page.locator(".order-activity")).toBeVisible();
 await order(page,c.oldOrder);
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await expect(page.locator(".source-aid")).toBeVisible();
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await page.getByRole("button",{name:"Try again"}).click();
 await order(page,c.newOrder);
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
 await expect(page.locator(".reading-passage")).toContainText("Independent changed-intention scene (new writing, not original dialogue):");
 await choice(page,c.final);
 await expect(page.locator(".reading-passage")).toContainText("New independent scene with a changed listener (not a source transcript):");
 await choice(page,c.nextReading);
 await choice(page,c.situation);
 const unaccented=c.tone.normalize("NFD").replace(/[\u0300-\u036f]/gu,"");
 await page.getByRole("textbox",{name:"Your answer"}).fill(unaccented);
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await fill(page,c.tone);
 await page.getByRole("textbox",{name:"Your answer"}).fill(c.nextTone.normalize("NFD").replace(/[\u0300-\u036f]/gu,""));
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await fill(page,c.nextTone);
 for(let i=1;i<=6;i++){
  await page.getByRole("textbox",{name:"Your response"}).fill("第"+i+"篇练习：新人物、更换听者与不同提问。");
  await page.getByRole("button",{name:"Review writing"}).click();
  await expect(page.getByText("Ungraded practice")).toBeVisible();
  await page.getByRole("button",{name:"Continue"}).click();
 }

 // Source-pinned third-context extension on the SAME four original Phase 30 lessons.
 const extra=thirdContext[c.title];
 await expect(page.locator(".reading-passage")).toContainText("Third authored scenario (not an original source dialogue):");
 await page.getByRole("radio",{name:extra.wrong,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await expect(page.locator(".source-aid")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await choice(page,extra.reading);
 await page.getByRole("textbox",{name:"Your answer"}).fill(extra.wrongSource);
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await expect(page.locator(".source-aid")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await fill(page,extra.source);
 for(const prior of [c.oldOrder,c.newOrder]){
  await order(page,prior);
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await order(page,extra.order);
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("textbox",{name:"Your response"}).fill("第七次独立修订：新的说话者与听者，原文和新编内容清楚区分。");
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();

 const h=handoff[c.title];
 await expect(page.locator(".reading-passage")).toContainText("First intent (authored scenario, not original dialogue):");
 await page.getByRole("radio",{name:h.beforeWrong,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await expect(page.locator(".source-aid")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await choice(page,h.before);
 await expect(page.locator(".reading-passage")).toContainText("Changed intent (authored scenario, not original dialogue):");
 await page.getByRole("radio",{name:h.afterWrong,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await choice(page,h.after);
 for(const prior of [c.oldOrder,c.newOrder,extra.order]){
  await order(page,prior);
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await order(page,h.order);
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
 const first="第八段第一稿：先辨别我们和你们，再纠正角色。";
 const revised="第八段修改稿：换了新的听者，把我们和你们正确区分。";
 const response=page.getByRole("textbox",{name:"Your response"});
 await response.fill(first);
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await expect(page.getByText("Compare first draft")).toHaveCount(0);
 await page.getByRole("button",{name:"Revise writing"}).click();
 await expect(response).toHaveValue(first);
 await response.fill(revised);
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByText("Compare first draft").click();
 await expect(page.locator(".writing-draft-comparison")).toContainText(first);
 await expect(response).toHaveValue(revised);
 await page.getByRole("button",{name:"Continue"}).click();

 const negotiation=phase32[c.title];
 await expect(page.locator(".reading-passage")).toContainText("Opening speaker in a newly authored conversation, not a source transcript:");
 await page.getByRole("radio",{name:negotiation.firstWrong,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await choice(page,negotiation.first);
 await expect(page.locator(".reading-passage")).toContainText("Interrupted speaker in a newly authored conversation, not a source transcript:");
 await page.getByRole("radio",{name:negotiation.secondWrong,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await choice(page,negotiation.second);
 await expect(page.locator(".reading-passage")).toContainText("Third speaker in an authored practical correction, not source dialogue:");
 for(const wrong of negotiation.thirdWrong){
  await page.getByRole("radio",{name:wrong,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.locator(".source-aid")).toBeVisible();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await choice(page,negotiation.third);
 for(const previous of [c.oldOrder,c.newOrder,extra.order,h.order]){
  await order(page,previous);
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 // Reorder authentic source evidence in place, rather than undoing the whole answer.
 const rearranged=[negotiation.fifth[1],negotiation.fifth[0],negotiation.fifth[2]];
 for(const word of rearranged)await page.getByRole("button",{name:"Add "+word,exact:true}).click();
 await expect(page.locator(".chosen-tokens li")).toHaveCount(3);
 await page.getByRole("button",{name:"Move "+negotiation.fifth[0]+" earlier"}).click();
 await expect(page.locator(".chosen-tokens li").first()).toContainText(negotiation.fifth[0]);
 await expect(page.getByRole("button",{name:"Move "+negotiation.fifth[0]+" earlier"})).toBeDisabled();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
 const initial="第一次沟通：报告自己的组、回应另一组、最后由第三人澄清。";
 const revisedNinth="修订后的沟通：换一个说话者，保持原文与新编句子清楚分开。";
 await page.getByRole("textbox",{name:"Your response"}).fill(initial);
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByRole("button",{name:"Revise writing"}).click();
 await page.getByRole("textbox",{name:"Your response"}).fill(revisedNinth);
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByText("Compare first draft").click();
 await expect(page.locator(".writing-draft-comparison")).toContainText(initial);
 await expect(page.getByRole("textbox",{name:"Your response"})).toHaveValue(revisedNinth);
 await page.getByRole("button",{name:"Restore first draft"}).click();
 await expect(page.getByRole("textbox",{name:"Your response"})).toHaveValue(initial);
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await page.getByRole("textbox",{name:"Your response"}).fill(revisedNinth+" 调整后的第三稿。");
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByText("Compare first draft").click();
 await expect(page.locator(".writing-draft-comparison")).toContainText(initial);
 await page.getByRole("button",{name:"Continue"}).click();

 const cl=clarification[c.title];
 await expect(page.locator(".reading-passage")).toContainText("A listener detects an error in newly authored dialogue");
 for(const mistaken of cl.wrong){
  await page.getByRole("radio",{name:mistaken,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
  await expect(page.locator(".source-aid")).toBeVisible();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await choice(page,cl.first);
 for(const mistaken of cl.other){
  await page.getByRole("textbox",{name:"Your answer"}).fill(mistaken);
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
  await expect(page.locator(".source-aid")).toBeVisible();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await fill(page,cl.typed);
 await expect(page.locator(".reading-passage")).toContainText("Following the correction, the listener and purpose change");
 await page.getByRole("radio",{name:cl.afterWrong,exact:true}).check();
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 await choice(page,cl.after);
 const firstDraft="第一稿：听者解释错误的词义，发言者重新说明了问题。";
 const revision="第二稿：现在更换听者，原来错误的原文表达得到正确使用。";
 const textArea=page.getByRole("textbox",{name:"Your response"});
 await textArea.fill(firstDraft);
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByRole("button",{name:"Revise writing"}).click();
 await textArea.fill(revision);
 await page.getByRole("button",{name:"Review writing"}).click();
 await page.getByText("Compare first draft").click();
 await expect(page.locator(".writing-draft-comparison")).toContainText(firstDraft);
 await page.getByRole("button",{name:"Restore first draft"}).click();
 await expect(textArea).toHaveValue(firstDraft);
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await textArea.fill(revision+" 修订之后仍保留原文证据。");
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();

 const cf=counterfactual[c.title];
 await expect(page.locator(".reading-passage")).toContainText("new editorial practice, not source dialogue");
 for(const wrong of cf.thirdWrong){
  await page.getByRole("radio",{name:wrong,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.locator(".source-aid")).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await choice(page,cf.third);
 await expect(page.locator(".reading-passage")).toContainText("new editorial practice, not source dialogue");
 for(const wrong of cf.backWrong){
  await page.getByRole("radio",{name:wrong,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await choice(page,cf.back);
 for(const wrong of cf.typedWrong){
  await page.getByRole("textbox",{name:"Your answer"}).fill(wrong);
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.locator(".source-aid")).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await fill(page,cf.typed);
 const originalEleventh="第十一段第一稿：新发言者修改了原来的听者。";
 const revisedEleventh="第十一段第二稿：调整说话人的角色，区分三个来源原句。";
 const responseEleventh=page.getByRole("textbox",{name:"Your response"});
 await responseEleventh.fill(originalEleventh);
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByRole("button",{name:"Revise writing"}).click();
 await responseEleventh.fill(revisedEleventh);
 await page.getByRole("button",{name:"Review writing"}).click();
 await page.getByText("Compare first draft").click();
 await expect(page.locator(".writing-draft-comparison")).toContainText(originalEleventh);
 await expect(responseEleventh).toHaveValue(revisedEleventh);
 await page.getByRole("button",{name:"Restore first draft"}).click();
 await expect(responseEleventh).toHaveValue(originalEleventh);
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await responseEleventh.fill(revisedEleventh+" 第三次审核。");
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();

 const finalTransfer=phase34[c.title];
 await expect(page.locator(".reading-passage")).toContainText("Independent new speaker context (not original source dialogue)");
 for(const incorrect of finalTransfer.wrong){
  await page.getByRole("radio",{name:incorrect,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.locator(".source-aid")).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await choice(page,finalTransfer.decision);
 for(const previous of [c.oldOrder,c.newOrder,extra.order,h.order,negotiation.fifth]){
  await order(page,previous);
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await order(page,finalTransfer.sixth);
 await expect(page.locator(".feedback.correct")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("textbox",{name:"Your answer"}).fill(finalTransfer.otherPinyin);
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await expect(page.locator(".source-aid")).toBeVisible();
 await page.getByRole("button",{name:"Try again"}).click();
 const unmarkedPinyin=finalTransfer.pinyin.normalize("NFD").replace(/\p{M}/gu,"");
 await page.getByRole("textbox",{name:"Your answer"}).fill(unmarkedPinyin);
 await page.getByRole("button",{name:"Check answer"}).click();
 await expect(page.locator(".feedback.incorrect")).toBeVisible();
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await page.getByRole("button",{name:"Try again"}).click();
 await fill(page,finalTransfer.pinyin);
 const firstTwelfth="第十二段第一稿：真实原文、三位说话者、不同的听者。";
 const revisedTwelfth="第十二段第二稿：话语顺序变化后，我重新划分了角色。";
 const twelfth=page.getByRole("textbox",{name:"Your response"});
 await twelfth.fill(firstTwelfth);
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByRole("button",{name:"Revise writing"}).click();
 await twelfth.fill(revisedTwelfth);
 await page.getByRole("button",{name:"Review writing"}).click();
 await page.getByText("Compare first draft").click();
 await expect(page.locator(".writing-draft-comparison")).toContainText(firstTwelfth);
 await page.getByRole("button",{name:"Restore first draft"}).click();
 await expect(twelfth).toHaveValue(firstTwelfth);
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await twelfth.fill(revisedTwelfth+" 再次修改。");
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();

 const switchCase=evidenceSwitch[c.title];
 await expect(page.locator(".reading-passage")).toContainText("newly authored scenario only");
 for(const incorrect of switchCase.firstWrong){
  await page.getByRole("radio",{name:incorrect,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.locator(".source-aid")).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await choice(page,switchCase.first);
 await expect(page.locator(".reading-passage")).toContainText("speaker or request genuinely changes");
 for(const incorrect of switchCase.afterWrong){
  await page.getByRole("radio",{name:incorrect,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await choice(page,switchCase.after);
 for(const incorrect of switchCase.typedWrong){
  await page.getByRole("textbox",{name:"Your answer"}).fill(incorrect);
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.locator(".source-aid")).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await fill(page,switchCase.typed);
 const firstThirteenth="第十三篇第一稿：谁在说话，谁在听，来源原句是哪一句？";
 const secondThirteenth="第十三篇第二稿：我改变了角色，让回应与原文的含义匹配。";
 const thirdThirteenth="第十三篇第三稿：再次改写发言人，但保留所有来源引用。";
 const thirteenth=page.getByRole("textbox",{name:"Your response"});
 await thirteenth.fill(firstThirteenth);
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await expect(page.getByRole("button",{name:"Restore last revised draft"})).toHaveCount(0);
 await page.getByRole("button",{name:"Revise writing"}).click();
 await thirteenth.fill(secondThirteenth);
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByText("Compare first draft").click();
 await expect(page.locator(".writing-draft-comparison")).toContainText(firstThirteenth);
 await page.getByRole("button",{name:"Restore first draft"}).click();
 await expect(thirteenth).toHaveValue(firstThirteenth);
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await page.getByRole("button",{name:"Restore last revised draft"}).click();
 await expect(thirteenth).toHaveValue(secondThirteenth);
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByRole("button",{name:"Revise writing"}).click();
 await thirteenth.fill(thirdThirteenth);
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByText("Compare first draft").click();
 await expect(page.locator(".writing-draft-comparison")).toContainText(firstThirteenth);
 await expect(thirteenth).toHaveValue(thirdThirteenth);
 await page.getByRole("button",{name:"Continue"}).click();

 const verified=verification[c.title];
 await expect(page.locator(".reading-passage")).toContainText("Third-party verification changes");
 for(const wrong of verified.witnessWrong){
  await page.getByRole("radio",{name:wrong,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.locator(".source-aid")).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await choice(page,verified.witness);
 await expect(page.locator(".reading-passage")).toContainText("first participant returns");
 for(const wrong of verified.returnWrong){
  await page.getByRole("radio",{name:wrong,exact:true}).check();
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await choice(page,verified.returnQuote);
 for(const wrong of verified.hanziWrong){
  await page.getByRole("textbox",{name:"Your answer"}).fill(wrong);
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.locator(".source-aid")).toBeVisible();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await fill(page,verified.hanzi);
 for(const wrong of [verified.sourceWrong,verified.pinyin.normalize("NFD").replace(/\p{M}/gu,"")]){
  await page.getByRole("textbox",{name:"Your answer"}).fill(wrong);
  await page.getByRole("button",{name:"Check answer"}).click();
  await expect(page.locator(".feedback.incorrect")).toBeVisible();
  await expect(page.locator(".source-aid")).toBeVisible();
  await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
  await page.getByRole("button",{name:"Try again"}).click();
 }
 await fill(page,verified.pinyin);
 const drafts=[
  "第十四段初稿：团队、访客和独立证人的说话次序。",
  "第十四段修订一：更换说话人，检查每个原文出处。",
  "第十四段修订二：纠正第三人对听众的误读。",
  "第十四段修订三：更改角色归属但保留原文含义。"
 ];
 const phase36Response=page.getByRole("textbox",{name:"Your response"});
 for(let i=0;i<drafts.length;i++){
  if(i>0)await page.getByRole("button",{name:"Revise writing"}).click();
  await phase36Response.fill(drafts[i]);
  await page.getByRole("button",{name:"Review writing"}).click();
  await expect(page.getByText("Ungraded practice")).toBeVisible();
 }
 await page.getByText("Earlier submitted revisions").click();
 await expect(page.locator(".writing-revision-history")).toContainText(drafts[1]);
 await expect(page.locator(".writing-revision-history")).toContainText(drafts[2]);
 await page.getByRole("button",{name:"Restore revision 1"}).click();
 await expect(phase36Response).toHaveValue(drafts[1]);
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await page.getByRole("button",{name:"Restore last revised draft"}).click();
 await expect(phase36Response).toHaveValue(drafts[3]);
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await page.getByRole("button",{name:"Review writing"}).click();
 await page.getByText("Compare first draft").click();
 await expect(page.locator(".writing-draft-comparison")).toContainText(drafts[0]);
 await page.getByRole("button",{name:"Restore first draft"}).click();
 await expect(phase36Response).toHaveValue(drafts[0]);
 await expect(page.getByRole("button",{name:"Continue"})).toBeDisabled();
 await page.getByRole("button",{name:"Restore last revised draft"}).click();
 await expect(phase36Response).toHaveValue(drafts[3]);
 await page.getByRole("button",{name:"Review writing"}).click();
 await expect(page.getByText("Ungraded practice")).toBeVisible();
 await page.getByRole("button",{name:"Continue"}).click();
 await page.getByRole("button",{name:"Finish preview"}).click();
 await expect(page.getByRole("heading",{name:"Preview complete"})).toBeVisible();
 await page.getByRole("button",{name:"Back to Course"}).click();
 await expect(page.locator(".course-sequence li")).toHaveCount(4);
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
 const keys=await page.evaluate(()=>Array.from({length:sessionStorage.length},(_,i)=>sessionStorage.key(i)));
 expect(keys.some(k=>k?.includes("phase36-"))).toBe(false);
}
for(const c of samples){
 test("Phase 36 Chinese delayed verification and fourteen independently authored dialogues: "+c.title,async({page})=>{
  await journey(page,c);
 });
}
test("Phase 36 320px Chinese third-party verification and bounded revision history",async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await journey(page,samples[1]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 await page.reload();
 await expect(page.getByRole("heading",{name:"Home"})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
});
