import type {LessonBundleV1} from "../../../packages/content-schema/src/lesson-v1.js";
import receipts from "../../../contracts/phase16-source-evidence.json" with {type:"json"};
import type {ApplicationPath} from "./application-paths.ts";

export interface CorrectionFocus {
  readonly label:string;
  readonly explanation:string;
  readonly sourceId:string;
  readonly quote:string;
}
export interface SourceFollowUp {
  readonly ownerId:string;
  readonly kind:"lesson"|"application";
  readonly languageId:"fr"|"ja"|"zh";
  readonly newSituation:string;
  readonly revisionTask:string;
  readonly reflection:string;
  readonly focuses:readonly [CorrectionFocus,CorrectionFocus];
}
type Draft = Omit<SourceFollowUp,"ownerId"|"kind"|"languageId">;
const pair=(label:string,explanation:string,sourceId:string,quote:string):CorrectionFocus=>({label,explanation,sourceId,quote});
const lesson=(ownerId:string,languageId:SourceFollowUp["languageId"],data:Draft):SourceFollowUp=>({ownerId,languageId,kind:"lesson",...data});
const application=(ownerId:string,languageId:SourceFollowUp["languageId"],data:Draft):SourceFollowUp=>({ownerId,languageId,kind:"application",...data});

/** Internal, author-written transfer prompts. Quotations must be exact Phase 16 encountered source text. */
export const LESSON_FOLLOW_UPS:readonly SourceFollowUp[]=[
 lesson("fr:a1-01:shared-pilot","fr",{
  newSituation:"At a formal evening meeting, an unfamiliar host greets you; on the next morning, you meet a classmate.",
  revisionTask:"Write two different greetings with your own introduction and a fitting farewell. Explain why the evening opener cannot stand unchanged in the morning.",
  reflection:"Which expression establishes your identity, and which expression fits the time and addressee?",
  focuses:[
   pair("Time and register","Bonsoir is an evening greeting; a daytime or familiar conversation needs a different greeting. The original addresses an unfamiliar monsieur.","fr-a1-01-original","Bonsoir, monsieur."),
   pair("Introducing your name","Je m’appelle introduces a name rather than a profession. Keep your own name distinct from the source speaker Inès.","fr-a1-01-original","Je m’appelle Inès.")
  ]}),
 lesson("ja:cf-a1-01-01:shared-pilot","ja",{
  newSituation:"You meet a teacher before classes, see a friend at noon, and leave the household for bed later that night.",
  revisionTask:"Write the expression for each event in Japanese, with a short explanation of who is addressed and why bedtime differs from an evening greeting.",
  reflection:"Are you greeting someone in the evening, or closing the day before sleep?",
  focuses:[
   pair("Morning versus evening","The source explicitly marks おはようございます as a morning expression; switching only the audience does not make it an evening expression.","ja-cf-a1-01-01-original","朝：おはようございます。"),
   pair("Evening versus bedtime","こんばんは opens an evening encounter. It is not the same communicative act as a bedtime farewell.","ja-cf-a1-01-01-original","夜：こんばんは。")
  ]}),
 lesson("zh:ni-hao:shared-pilot","zh",{
  newSituation:"A visitor greets a friend and then comments on a slice of fruit. Write the greeting and food description as separate exchanges.",
  revisionTask:"Compose a new short Hanzi exchange using the greeting and the taste expression, then explain their distinct functions in English.",
  reflection:"Does 好 mean a positive property here, or does the whole 你好 expression greet a person?",
  focuses:[
   pair("Greeting and addressee","你好 addresses a person as a greeting; it does not by itself say that an object tastes good.","zh-ni-demo","你好"),
   pair("Describing flavor","好吃 evaluates food as tasty. Do not substitute it for a greeting merely because the written component 好 is shared.","zh-hao-demo","好吃")
  ]}),
 lesson("fr:a1-02:shared-pilot","fr",{
  newSituation:"You describe your own occupation, then tell a visitor which city a small group is in.",
  revisionTask:"Write one sentence with je suis and another with nous sommes, changing the original identities and location without inventing a conjugation rule.",
  reflection:"How does the form of être change when the subject changes from je to nous?",
  focuses:[
   pair("First-person singular","Je suis accompanies the first-person subject je. It does not use the plural verb sommes.","fr-a1-02-original","Je suis professeur."),
   pair("First-person plural","Nous sommes expresses a plural first-person group. Keep its verb form distinct from je suis.","fr-a1-02-original","Nous sommes à Lyon.")
  ]}),
 lesson("ja:cf-a1-01-02:shared-pilot","ja",{
  newSituation:"At a counter you need a staff member's attention, then receive help and thank them.",
  revisionTask:"Write the request-for-attention and gratitude as two separate Japanese turns; add a plausible source-supported acknowledgment.",
  reflection:"Are you trying to get help now, or acknowledging help already received?",
  focuses:[
   pair("Requesting attention","すみません can call for assistance. It should not be replaced with a thank-you when help has not yet occurred.","ja-cf-a1-01-02-original","すみません。"),
   pair("Expressing gratitude","ありがとうございます acknowledges help or kindness. It is not the same act as getting someone's attention.","ja-cf-a1-01-02-original","ありがとうございます。")
  ]}),
 lesson("zh:wo:shared-pilot","zh",{
  newSituation:"One speaker describes a notebook as theirs, then joins classmates in a group introduction.",
  revisionTask:"Use 我, 我的 and 我们 in distinct short contexts. Explain possession versus group membership in English.",
  reflection:"Who is the speaker in 我, whose possession is 我的, and how many speakers are included in 我们?",
  focuses:[
   pair("Possessive form","我的 refers to something associated with or belonging to the speaker; it is not just the standalone subject 我.","zh-wo-demo","我的"),
   pair("Plural participation","我们 refers to a first-person group. Do not use it when only a single speaker is meant.","zh-wo-demo","我们")
  ]}),
 lesson("fr:a1-01-02:cross-transfer","fr",{
  newSituation:"At a new volunteer event, introduce yourself and your occupation; later say goodbye to the same person.",
  revisionTask:"Write a concise French exchange combining an evening greeting, your own name, your role, and a goodbye. Explain the two distinct verbs.",
  reflection:"Which sentence names the speaker, and which states a profession?",
  focuses:[
   pair("Name identification","Je m’appelle introduces the name. It should not be swapped mechanically for je suis in the same source pattern.","fr-a1-01-original","Je m’appelle Inès."),
   pair("Professional role","Je suis describes a profession or identity. Do not repeat je m’appelle when stating a role.","fr-a1-02-original","Je suis professeur.")
  ]}),
 lesson("ja:cf-a1-01-01-02:cross-transfer","ja",{
  newSituation:"You enter a small shop in the daytime, interrupt politely to ask for assistance, and thank the clerk.",
  revisionTask:"Write the exchange in the correct event order and explain why the opening, attention request and gratitude are separate acts.",
  reflection:"At which turn do you first greet the clerk, and when has help actually been given?",
  focuses:[
   pair("Greeting first","こんにちは marks a daytime greeting. A help request is not a substitute for opening the encounter.","ja-cf-a1-01-01-original","昼：こんにちは。"),
   pair("Getting attention","すみません is an attention request here; gratitude belongs after the other person helps.","ja-cf-a1-01-02-original","すみません。")
  ]}),
 lesson("zh:ni-hao-wo:cross-transfer","zh",{
  newSituation:"A new classmate arrives; you greet the classmate and identify yourself, then separately praise a snack.",
  revisionTask:"Write three short Hanzi lines showing a greeting, first-person identity and a food description, with a brief English explanation.",
  reflection:"Do the expressions refer to the addressee, the speaker, or a quality of food?",
  focuses:[
   pair("Addressing another person","你好 addresses a listener. It is not a first-person statement of who you are.","zh-ni-demo","你好"),
   pair("Identifying the speaker","我是学生。 identifies a first-person noun role; it should not be substituted for the separate greeting.","zh-wo-demo","我是学生。")
  ]}),
 lesson("fr:a1-03:shared-pilot","fr",{
  newSituation:"You first point out a previously unseen book, then tell a friend where that same book has been placed.",
  revisionTask:"Write the first mention and subsequent reference as different French sentences, then add a plural object contrast.",
  reflection:"Does the listener already know which noun you mean at the second mention?",
  focuses:[
   pair("First mention","Un introduces a singular masculine book before the referent is known; the source does not start with le.","fr-a1-03-original","C’est un livre."),
   pair("Known reference","Le refers to the previously identified book in the location sentence. Keep gender and referent consistent.","fr-a1-03-original","Le livre est sur la table.")
  ]}),
 lesson("ja:cf-a1-01-03:shared-pilot","ja",{
  newSituation:"Meet a new project partner for the first time today, and describe what you would say at a second meeting tomorrow.",
  revisionTask:"Write the initial introduction with your own name and goodwill, and contrast it with a later familiar encounter without a repeated first-meeting opener.",
  reflection:"Is your phrase a first-contact greeting or a wish for future cooperation?",
  focuses:[
   pair("First encounter only","はじめまして belongs to a first meeting. Repeating it to the same partner tomorrow loses that meaning.","ja-cf-a1-01-03-original","はじめまして。"),
   pair("Goodwill and cooperation","よろしくお願いします expresses goodwill for the relationship; it is not the learner's name or a statement of thanks.","ja-cf-a1-01-03-original","よろしくお願いします。")
  ]}),
 lesson("zh:shi:shared-pilot","zh",{
  newSituation:"A name tag incorrectly identifies a visitor as a teacher; later a different speaker says they share a role.",
  revisionTask:"Write two identity contrasts, one denying an incorrect label and one adding a shared identity. Explain in English how each expression changes the claim.",
  reflection:"Is the second claim correcting a false statement, or adding someone else with the same role?",
  focuses:[
   pair("Correcting a claim","不是 denies an identity; it does not assert that another person shares a role.","zh-shi-demo","不是"),
   pair("Adding a second case","也是 adds also to an existing identity comparison. It does not negate the identity.","zh-shi-demo","也是")
  ]})
] as const;

export const APPLICATION_FOLLOW_UPS:readonly SourceFollowUp[]=[
 application("fr-object-reference","fr",{
  newSituation:"A second class arrives after objects were introduced. They must distinguish a new pen from the already identified book.",
  revisionTask:"Rewrite your classroom description for the new audience. Separate first mentions from references to known objects.",
  reflection:"Which noun does the listener now identify uniquely?",
  focuses:[
   pair("Introducing the object","The book begins as an unfamiliar object in C’est un livre. Use the new-reference form when first presenting it.","fr-a1-03-original","C’est un livre."),
   pair("Returning to it","The location sentence has a previously recognized book and therefore le livre. Do not treat both mentions identically.","fr-a1-03-original","Le livre est sur la table.")
  ]}),
 application("fr-introduce-and-describe","fr",{
  newSituation:"Someone at a new community meeting needs both your name and what you do, before you identify a familiar book.",
  revisionTask:"Compose a short self-introduction with a separate profession statement and a definite reference to the book.",
  reflection:"Which information is a personal name and which is an occupational role?",
  focuses:[
   pair("Naming yourself","Je m’appelle presents a name and does not directly assert your profession.","fr-a1-01-original","Je m’appelle Inès."),
   pair("Explaining your role","Je suis introduces a role with être in the original example. Keep that purpose separate.","fr-a1-02-original","Je suis professeur.")
  ]}),
 application("ja-first-meeting","ja",{
  newSituation:"Today you are assigned a new partner; tomorrow you see the same partner again.",
  revisionTask:"Write a first-contact introduction with your own name, then contrast tomorrow's return encounter in your own words.",
  reflection:"What marks the initial meeting rather than every later meeting?",
  focuses:[
   pair("Opening first contact","はじめまして signals the first encounter, not each subsequent meeting.","ja-cf-a1-01-03-original","はじめまして。"),
   pair("Requesting goodwill","よろしくお願いします expresses goodwill; it should not replace your name or be used as a literal thank-you for past help.","ja-cf-a1-01-03-original","よろしくお願いします。")
  ]}),
 application("ja-first-contact-help","ja",{
  newSituation:"After meeting someone new, you ask a different person at the reception desk for directions and thank them.",
  revisionTask:"Revise as two distinct exchanges: an introduction, then a request followed by gratitude.",
  reflection:"Which turn starts an assistance request and which closes it?",
  focuses:[
   pair("Attention request","すみません can get the receptionist's attention. It should precede the help in this scenario.","ja-cf-a1-01-02-original","すみません。"),
   pair("Thanking after help","ありがとうございます follows the assistance and should not replace the initial request.","ja-cf-a1-01-02-original","ありがとうございます。")
  ]}),
 application("zh-speaker-identity","zh",{
  newSituation:"You introduce yourself to a visitor and point to a teacher standing across the room.",
  revisionTask:"Write two contrasting Hanzi identity sentences and explain whose identity each refers to.",
  reflection:"Who is the speaker, and who is the separately identified third person?",
  focuses:[
   pair("First person","我 refers to the speaker, and cannot refer to the teacher across the room without a change of speaker.","zh-wo-demo","我"),
   pair("Third person","他是老师。 describes another person's noun identity. Distinguish it from 我.","zh-shi-demo","他是老师。")
  ]}),
 application("zh-negative-or-also","zh",{
  newSituation:"Correct a mistaken identity label at registration; at a different table, add someone sharing the right identity.",
  revisionTask:"Write a negated correction and a separate additive identity statement, explicitly explaining the contrast.",
  reflection:"Is your statement rejecting a claim or adding a comparison?",
  focuses:[
   pair("Rejecting an identity","不是 negates a noun-identity claim. It is not a synonym of 也是.","zh-shi-demo","不是"),
   pair("Adding an identity","也是 adds 'also' in a comparison and needs something already established to compare.","zh-shi-demo","也是")
  ]})
] as const;

export interface FollowUpIssue {readonly ownerId:string;readonly problem:string}
export function auditSourceFollowUps(bundles:readonly LessonBundleV1[],paths:readonly ApplicationPath[]):readonly FollowUpIssue[]{
  const issues:FollowUpIssue[]=[];
  const fail=(ownerId:string,problem:string)=>issues.push({ownerId,problem});
  const lessonIds=new Set(bundles.map(b=>b.lesson.id));
  const pathIds=new Set(paths.map(p=>p.id));
  if(LESSON_FOLLOW_UPS.length!==bundles.length)fail("lesson","incomplete-lesson-coverage");
  if(APPLICATION_FOLLOW_UPS.length!==paths.length)fail("application","incomplete-application-coverage");
  const seen=new Set<string>();
  for(const followUp of [...LESSON_FOLLOW_UPS,...APPLICATION_FOLLOW_UPS]){
    const ownerKey=followUp.kind+"|"+followUp.ownerId;
    if(seen.has(ownerKey))fail(followUp.ownerId,"duplicate-follow-up");
    seen.add(ownerKey);
    const path=paths.find(p=>p.id===followUp.ownerId);
    const lessonBundle=bundles.find(b=>b.lesson.id===followUp.ownerId);
    if(followUp.kind==="lesson"?!lessonIds.has(followUp.ownerId):!pathIds.has(followUp.ownerId))
      fail(followUp.ownerId,"unknown-owner");
    if(followUp.kind==="lesson"&&!lessonBundle?.exercises.some(e=>e.kind==="free-production"))
      fail(followUp.ownerId,"missing-writing-exercise");
    if(followUp.languageId!==(followUp.kind==="lesson"?lessonBundle?.lesson.languageId:path?.languageId))
      fail(followUp.ownerId,"language-mismatch");
    const allowed=followUp.kind==="lesson"?(lessonBundle?[lessonBundle]:[])
      :bundles.filter(bundle=>path?.steps.some(s=>s.lessonId===bundle.lesson.id));
    if(followUp.newSituation.trim().length<30||followUp.revisionTask.trim().length<30||
      followUp.reflection.trim().length<25||
      (path&&(followUp.newSituation===path.situation||followUp.newSituation===path.title)))
      fail(followUp.ownerId,"empty-or-repeated-independent-context");
    if(followUp.focuses.length!==2||new Set(followUp.focuses.map(f=>f.sourceId+"|"+f.quote)).size!==2)
      fail(followUp.ownerId,"invalid-focus-pair");
    for(const focus of followUp.focuses){
      const authentic=allowed.some(bundle=>bundle.lesson.publication==="internal-fixture"&&
        bundle.lesson.sources.some(source=>source.id===focus.sourceId&&source.editorialReview==="pending"&&!source.redistributionVerified)&&
        bundle.lesson.steps.some(step=>step.type==="encounter"&&step.examples.some(e=>e.targetText===focus.quote)));
      if(!authentic||!(receipts.originalSourceQuotes as Record<string,string[]>)[focus.sourceId]?.includes(focus.quote)||
        (path&&!path.steps.some(step=>step.sourceId===focus.sourceId))||
        focus.label.trim().length<8||focus.explanation.trim().length<30)
        fail(followUp.ownerId,"unverified-corrective-teaching");
    }
  }
  for(const bundle of bundles)if(!seen.has("lesson|"+bundle.lesson.id))fail(bundle.lesson.id,"missing-follow-up");
  for(const path of paths)if(!seen.has("application|"+path.id))fail(path.id,"missing-follow-up");
  return issues;
}
