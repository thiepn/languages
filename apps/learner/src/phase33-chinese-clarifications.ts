import type {ChineseClarificationV1,SourceAuthoredIntake} from "./source-intake.ts";
import {PHASE32_CHINESE_NEGOTIATIONS} from "./phase32-chinese-negotiations.ts";

/** No newly invented source quotations: the Phase 16/25 original Chinese
 * DEMO_ONLY evidence and existing original LessonV1 player stay authoritative.
 * These listener-initiated disagreements are independently authored scenarios. */
const old=PHASE32_CHINESE_NEGOTIATIONS;
const clarification=(misunderstood:ChineseClarificationV1["misunderstood"],
 writtenRepair:ChineseClarificationV1["writtenRepair"],
 changedConsequence:ChineseClarificationV1["changedConsequence"],
 independentDialogue:ChineseClarificationV1["independentDialogue"]):ChineseClarificationV1=>
 ({misunderstood,writtenRepair,changedConsequence,independentDialogue});
export const PHASE33_CHINESE_CLARIFICATIONS:readonly SourceAuthoredIntake[]=[
 {
  ...old[0]!,
  id:"zh:phase33-moderator-listener-clarification",
  title:"The listener challenges the moderator's group",
  objective:"Respond to a concrete listener misunderstanding of who belongs to the moderator's team, distinguish speaker-inclusive and listener-addressed groups, and rewrite the exchange after the listener changes sides.",
  explanation:"The separately attested original expressions 我们 (wǒmen), 你们 (nǐmen) and 我 (wǒ) differ in speaker inclusion and number. A fourth character who misunderstands the moderator's group provides a pragmatic correction task, not an alleged original transcript.",
  transferSituation:"At a joint seminar a new attendee mistakenly thinks the moderator is addressing visiting listeners when the moderator is actually reporting their own group's decision. The moderator clarifies, after which the attendee is deliberately asked to address the visitors.",
  writingInstruction:"Write a separate four-voice seminar correction. Distinguish an attendee's mistaken reading, the moderator's correction and the actual later shift to the addressed visitors.",
  reflection:"Why can 你们 be wrong in the first listener-interpreted situation yet right in the next situation when the speaker's purpose explicitly changes?",
  writingChecks:["Write down exactly whom the moderator initially includes in their group.","Let a listener explicitly misattribute speaker inclusion before showing the correction.","After the addressee changes, reinterpret the previously wrong 你们 without changing its attested Hanzi or Pinyin."],
  chineseClarification:clarification(
   {context:"An attendee hears the coordinator report a decision taken by the coordinator and their own team. The attendee mistakenly treats this report as a direct address to all visitors. A second listener asks which original expression truly includes the coordinator in the reported group.",
    question:"Which attested original Chinese expression identifies the team including the speaking coordinator, despite the listener's mistaken assumption about the visitors?",
    correctQuote:"我们",wrongQuotes:["你们","我"],
    feedback:[
      "你们 (nǐmen) identifies the group being addressed, not the reporting coordinator's own team. The source form 我们 explicitly includes the speaker and teammates.",
      "我 (wǒ) is only the individual coordinator, but the discussion concerns a decision shared with that person's team. Source-attested 我们 is required."
    ]},
   {instruction:"Reconstruct in original Hanzi the coordinator's speaker-inclusive plural expression that corrects the listener's wrong attribution to the visiting students; keep both source characters, rather than a listener-address form or singular speaker form.",
    quote:"我们",sourceId:"zh-wo-demo",
    firstWrong:"你们",
    firstFeedback:"你们 is second-person plural and excludes the current speaker from the referenced group. The coordinator explicitly included their own teammates using 我们.",
    secondWrong:"我",
    secondFeedback:"我 identifies only the person speaking, whereas the listener misunderstood a team-level decision. The original two-character first-person plural is 我们."},
   {context:"The attendee understands the coordinator's group decision. The coordinator then turns to several visiting students and explicitly asks those listeners to respond. The communicative act is now addressing visitors rather than reporting the coordinator's own team.",
    question:"Which source-backed expression is correct now that the coordinator directs the question to the visiting students instead of referring to their own group?",
    correctQuote:"你们",wrongQuote:"我们",
    feedback:"我们 was the right first-person plural answer for the earlier team report, but the speaker is now addressing visiting listeners. 你们 (nǐmen) is now appropriate."},
   {instruction:"Compose a tenth independent four-speaker meeting exchange where an attendee wrongly interprets the moderator's team report as an address to the visitors, the moderator corrects the referent, and another visitor later becomes the speaker. Submit an initial dialogue, compare it to a new draft and revise the point at which the referent changes.",
    criteria:[
      "Specify exactly who speaks and which team they are included in before the listener's mistake.",
      "Explain the listener's false 你们 interpretation and why 我们 is the correct original expression in the first scene.",
      "Reassign the addressee during the new turn and make all additional responses independently authored rather than claiming an original dialogue."
    ]}
  )
 },
 {
  ...old[1]!,
  id:"zh:phase33-market-listener-request-repair",
  title:"A customer corrects the vendor's question",
  objective:"Repair the wrong conversational response when a customer asks for a tea-preference question but hears a greeting or a food description; then recognize when that greeting becomes appropriate for a later arrival.",
  explanation:"The actual original source snippets 你喜欢喝茶吗？ (Nǐ xǐhuan hē chá ma?), 你好 (nǐ hǎo) and 这个苹果很好吃。 (Zhège píngguǒ hěn hǎochī.) are authentic separate demo excerpts with different communicative purposes. The newly composed customer correction is not attested as a source conversation.",
  transferSituation:"A shopper has already been welcomed at a stall. A visiting companion asks the vendor to check whether the shopper enjoys tea, but the vendor repeats a greeting and points at an apple. The companion then clarifies the intended question. A new customer later arrives and needs an actual greeting.",
  writingInstruction:"Write an original vendor-and-two-customers correction scene where the companion repairs a repeated greeting into a tea question, then changes the situation so the same greeting becomes correct when a newcomer arrives.",
  reflection:"Why does final 吗 identify the original yes/no tea question, and why is a greeting appropriate only when the interlocutor is genuinely new?",
  writingChecks:["Use the exact attested tea-question Hanzi with its original 吗？.","Separate greeting a genuinely new person from responding to an already-present customer.","Correct the specific misunderstanding without inventing new source-verified utterances."],
  chineseClarification:clarification(
   {context:"The first visitor was greeted a minute earlier. Their companion asks the stallholder to find out whether this visitor likes tea, but the stallholder repeats a greeting and adds a statement about an apple. The companion asks for the original yes/no tea preference question instead.",
    question:"Which original Chinese excerpt asks the already-present visitor about liking tea rather than greeting them again or describing fruit?",
    correctQuote:"你喜欢喝茶吗？",wrongQuotes:["你好","这个苹果很好吃。"],
    feedback:[
      "你好 is only a greeting, and this customer is already present. The requested original preference question is 你喜欢喝茶吗？ with final 吗？.",
      "这个苹果很好吃。 is a declarative apple-quality report. It neither asks the customer's tea preference nor includes the required question particle 吗."
    ]},
   {instruction:"Reconstruct the complete original attested Hanzi tea-preference question addressed to the already-present shopper, retaining the final 吗？; do not use the separate greeting or the declarative apple sentence as the corrected question.",
    quote:"你喜欢喝茶吗？",sourceId:"zh-ni-demo",
    firstWrong:"你好",
    firstFeedback:"你好 greets a person and does not ask about tea. The correction explicitly needs the attested tea-preference question 你喜欢喝茶吗？.",
    secondWrong:"这个苹果很好吃。",
    secondFeedback:"The apple source describes fruit, not the customer's beverage preference. The original source question ends with 吗？ and is 你喜欢喝茶吗？."},
   {context:"The vendor finally asks the tea question correctly. At that moment a genuinely new person enters and has not been greeted. This is now a first-contact exchange with the new arrival, not a request about tea.",
    question:"Which source expression correctly starts the conversation with the newly arriving visitor, although it was wrong for the already-present tea customer?",
    correctQuote:"你好",wrongQuote:"你喜欢喝茶吗？",
    feedback:"The tea-preference question was right for the earlier customer. A newly arriving person now requires first-contact greeting 你好 (nǐ hǎo), not an unprompted tea question."},
   {instruction:"Write a tenth independent market repair dialogue with a previously greeted customer, their companion and a newly arriving guest. Have the companion identify the vendor's wrongly repeated 你好, supply the source-backed tea question and later justify using 你好 for the newcomer. Revise the written dialogue after switching who enters first.",
    criteria:[
      "Distinguish the existing customer's already-completed greeting from the new guest's first greeting.",
      "Explain why 吗 belongs in the exact attested tea question but not in the apple-quality statement.",
      "Keep the composed companion/vendor explanations explicitly learner-authored and compare how their timing changes across drafts."
    ]}
  )
 },
 {
  ...old[2]!,
  id:"zh:phase33-school-mistaken-identity-clarification",
  title:"A student challenges a mistaken identity",
  objective:"Correct a misattributed teaching role using the original negation before switching to positive self-identification, and distinguish the separate third-person teacher reference.",
  explanation:"Source-attested 不是 (bú shì) denies a false claim, 我是学生。 (Wǒ shì xuésheng.) affirms the current speaker's student identity, and 他是老师。 (Tā shì lǎoshī.) identifies another person as teacher. The explanation of the mistaken form is newly authored practice.",
  transferSituation:"At an orientation desk the clerk explicitly assumes that the person speaking is a teacher and offers the teacher's key. The student first challenges the false claim; once corrected, the clerk requests their positive role for a roster.",
  writingInstruction:"Write a three-person orientation correction where the student rejects an explicit false teacher assumption and later positively identifies themself. Introduce the actual teacher only as a separate third-person reference.",
  reflection:"Why is an explicit denial of the clerk's initial mistaken role not enough to supply the student's actual identity for registration?",
  writingChecks:["State the clerk's mistaken claim before using the original negation 不是.","Follow the corrected assumption with the source-attested positive 我是学生。 only when identification is requested.","Avoid treating 他是老师。 as the current speaker's role or as a denial."],
  chineseClarification:clarification(
   {context:"At the registration desk, a clerk mistakenly assumes the visiting student is a teacher and hands over a teacher's key. The student immediately challenges that false role rather than beginning with a routine positive introduction.",
    question:"Which attested source expression explicitly denies the false teacher role before the student gives their actual identity?",
    correctQuote:"不是",wrongQuotes:["我是学生。","他是老师。"],
    feedback:[
      "我是学生。 is an affirmative statement about the current speaker, but it does not explicitly use the original denial needed to reject this first false assumption.",
      "他是老师。 identifies a third person as a teacher, not a correction of the clerk's false claim about the student standing at the desk."
    ]},
   {instruction:"Reconstruct the entire original attested short Hanzi denial used to reject the clerk's false assumption about the student holding a teacher's role; do not substitute the separate positive student or third-person teacher statements.",
    quote:"不是",sourceId:"zh-shi-demo",
    firstWrong:"我是学生。",
    firstFeedback:"我是学生。 provides affirmative student identity but the initial communicative task is to explicitly deny the clerk's mistaken teacher assumption using 不是.",
    secondWrong:"他是老师。",
    secondFeedback:"他是老师。 correctly identifies another person, not the speaker's denial of a false role. The source negation for this action is 不是."},
   {context:"The clerk accepts that the student is not the teacher and asks what role to enter on the attendance roster. The student must now positively state their own identity rather than merely repeat the denial.",
    question:"Which exact source sentence now affirmatively identifies the person speaking as a student for the roster?",
    correctQuote:"我是学生。",wrongQuote:"不是",
    feedback:"不是 was appropriate when denying a mistaken assumption. The new roster question requires an affirmative student identity using 我是学生。."},
   {instruction:"Write and revise a tenth independent desk conversation involving a clerk, a student and the actual teacher. Include a mistaken teacher-role assertion, its explicit correction, a roster request for positive student identity, and an independently written transition to the actual teacher. Swap the clerk's first question in your revision and justify which original source expression then changes position.",
    criteria:[
      "Link 不是 to an explicitly false teacher assumption rather than a generic introduction.",
      "Explain why positive 我是学生。 becomes necessary after the clerk requests the real role.",
      "Keep the actual teacher's third-person source sentence separate from all independently composed replies and compare the changed order."
    ]}
  )
 },
 {
  ...old[3]!,
  id:"zh:phase33-office-badge-listener-clarification",
  title:"An owner corrects a badge-role misunderstanding",
  objective:"Fix a clerk's confusion between personal badge ownership, shared professional role and job-title denial before switching to an authentic shared-role question.",
  explanation:"The original source short items 我的 (wǒ de), 也是 (yě shì) and 不是 (bú shì) respectively convey current speaker possession, additive shared identity and explicit denial. A receptionist who misreads a badge-owner question as a colleague-role question motivates practical repair of the misunderstanding.",
  transferSituation:"At reception a guest asks whom a badge belongs to. The clerk mistakenly replies about a colleague holding the same job and then denies a wrong title. The guest requests a possession answer. Only after returning the badge does the clerk ask about a colleague's matching role.",
  writingInstruction:"Create a practical correction between owner, desk clerk and colleague. Make the listener identify the wrong role-based reply to a badge-ownership question, then shift to the actual colleague-role discussion.",
  reflection:"Why does the possessive source 我的 answer who owns a badge, while 也是 is meaningful only after the conversation explicitly asks who else shares a role?",
  writingChecks:["Determine whose voice the first-person possession refers to at each turn.","Correct the false assumption that an additive role answer can identify badge ownership.","Do not use the negation 不是 as either a possession marker or the additive true-role claim."],
  chineseClarification:clarification(
   {context:"The guest asks the desk clerk to identify a badge belonging to the guest. Instead, the clerk talks about another colleague's matching job and then denies a mistaken title. The guest explains that the current question concerns possession, not anyone's work role.",
    question:"Which exact source expression from the badge owner's voice signals that this item belongs to the speaker, rather than confirming or denying anyone's professional identity?",
    correctQuote:"我的",wrongQuotes:["也是","不是"],
    feedback:[
      "也是 says a role also applies to someone, but does not identify the badge's owner. The original speaker-owned possessive expression is 我的.",
      "不是 rejects an identity and has no first-person possessive function. The source item for the badge owner is 我的 (wǒ de)."
    ]},
   {instruction:"Reproduce the exact original Hanzi that means the badge belongs to the person currently speaking. Keep both original characters, not an additive shared-role response or a denial of the person's job title.",
    quote:"我的",sourceId:"zh-wo-demo",
    firstWrong:"也是",
    firstFeedback:"也是 confirms that a role also applies. The listener has asked about ownership, so the attested first-person possessive is 我的.",
    secondWrong:"不是",
    secondFeedback:"不是 denies a role; it cannot state that an object belongs to the speaker. The exact source phrase for possession is 我的."},
   {context:"After the badge is correctly returned, the clerk changes the conversation and asks whether a second employee truly has the same role as the first. This is now a matching-identity question, not a request about ownership.",
    question:"Which original form is correct for affirming that another employee also has the role, even though it was the wrong reply to the badge question?",
    correctQuote:"也是",wrongQuote:"我的",
    feedback:"我的 was appropriate for first-person badge ownership, but the new request asks about a true shared job identity, so 也是 is now the correct original source expression."},
   {instruction:"Write a tenth independent front-desk correction with a guest, clerk and colleague. The guest first challenges the clerk's answer about a shared job because the question concerns a badge, then the clerk returns the badge and changes the question to professional identity. Revise the dialogue after changing who holds the badge.",
    criteria:[
      "Distinguish the badge owner's own voice from the clerk's incorrect role statement in the first exchange.",
      "Explain why 我的 answers the possession question and 也是 answers the genuinely new colleague-role question.",
      "Compare the revised dialogue to the first draft and mark all new sentences as learner-authored, not original Chinese evidence."
    ]}
  )
 }
] as const;
