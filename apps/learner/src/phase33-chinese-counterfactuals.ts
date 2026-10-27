import type {ChineseCounterfactualV1,SourceAuthoredIntake} from "./source-intake.ts";
import {PHASE33_CHINESE_CLARIFICATIONS} from "./phase33-chinese-clarifications.ts";

/** Source-attested excerpt choices only. Speaker changes, motives, consequences and
 * surrounding conversations are explicitly new editorial practice, not transcripts. */
const original=PHASE33_CHINESE_CLARIFICATIONS;
const contrast=(
 thirdVoice:ChineseCounterfactualV1["thirdVoice"],
 returnToOriginal:ChineseCounterfactualV1["returnToOriginal"],
 exactRepair:ChineseCounterfactualV1["exactRepair"],
 independentDialogue:ChineseCounterfactualV1["independentDialogue"]
):ChineseCounterfactualV1=>({thirdVoice,returnToOriginal,exactRepair,independentDialogue});

export const PHASE33_CHINESE_COUNTERFACTUALS:readonly SourceAuthoredIntake[]=[
 {
  ...original[0]!,
  chineseCounterfactual:contrast(
   {context:"A fourth seminar participant becomes the sole speaker and explicitly distances their personal account from any negotiated decision of their team. The visitor now asks who, individually, is responsible for this interpretation rather than who belongs to the moderator's group.",
    question:"In this third distinct speaker role, which exact source item identifies the individual who is speaking, rather than a plural group of teammates or listeners?",
    correctQuote:"我",wrongQuotes:["我们","你们"],
    feedback:[
      "我们 includes the fourth speaker's teammates, but the listener now requests only the fourth speaker's individual view. The original singular expression is 我.",
      "你们 addresses multiple listeners rather than the sole person now volunteering an individual explanation. The source item for the individual speaker is 我."
    ]},
   {context:"A visiting attendee now asks the original moderator to repeat the collective resolution agreed by that moderator's own team, not the fourth participant's personal interpretation. The moderator is speaking again on behalf of their teammates, even though an individual speaker was relevant in the preceding exchange.",
    question:"Which exact original source form returns to a group including the current speaking moderator, as opposed to the independent interpreter or the addressed visitors?",
    correctQuote:"我们",wrongQuotes:["我","你们"],
    feedback:[
      "我 names only the individual speaker from the previous turn; this renewed question explicitly seeks the moderator's whole team decision, so 我们 is correct.",
      "你们 addresses visiting listeners, whereas the returning moderator now reports a decision by a team that includes the moderator. The original plural first person is 我们."
    ]},
   {instruction:"Reconstruct, using only exact original source Hanzi, the plural listener address the moderator would use if the audience were invited to respond rather than if the moderator were reporting their own team or an individual's opinion. Keep the original two-character source form unchanged.",
    quote:"你们",sourceId:"zh-ni-demo",wrongQuotes:["我","我们"],
    feedback:[
      "我 denotes the singular speaker, but the reconstructed utterance addresses a group of listeners and so requires original source 你们.",
      "我们 includes the speaking moderator in the referenced group; the instruction asks for plural addressees other than the moderator, so the source is 你们."
    ]},
   {instruction:"Write an eleventh independently authored seminar exchange with four clearly distinct voices. A fourth participant makes an individual objection, the moderator returns to the team's collective decision, then turns toward the visiting audience and invites a response. Review your first draft against your revised version after switching which attendee presents an objection.",
    criteria:[
      "Use the original singular 我 only for the fourth participant's individual position; separate it from the moderator's collective 我们.",
      "Explain precisely when the moderator shifts to 你们 because the visiting audience becomes the group addressed.",
      "Compare first and revised dialogues; mark all invented speaker lines as learner-authored rather than copied original source conversation."
    ]}
  )
 },
 {
  ...original[1]!,
  chineseCounterfactual:contrast(
   {context:"After the tea misunderstanding is resolved, a customer instead wants to know whether the exact apple on the counter is tasty. The vendor's purpose is now to describe the fruit, without greeting someone or asking about the customer's preferred beverage.",
    question:"Which exact original source sentence answers the new apple-quality question, rather than the previous tea question or a greeting?",
    correctQuote:"这个苹果很好吃。",wrongQuotes:["你喜欢喝茶吗？","你好"],
    feedback:[
      "你喜欢喝茶吗？ asks about tea preference, but the returning customer's new request is a statement about this apple's taste. The attested source sentence is 这个苹果很好吃。.",
      "你好 is a first-contact greeting and contains no claim about how the apple tastes. The appropriate original declarative excerpt describes the apple."
    ]},
   {context:"The fruit question is finished and the previously present customer now explicitly asks the vendor to find out whether a separate companion likes drinking tea. The companion has already been greeted, so no arrival greeting or apple description is being requested.",
    question:"Which complete original question should the vendor direct toward the already-present companion about liking tea, not apples or a new arrival?",
    correctQuote:"你喜欢喝茶吗？",wrongQuotes:["这个苹果很好吃。","你好"],
    feedback:[
      "这个苹果很好吃。 answers the earlier fruit-quality concern, while this new communicative task needs the question about drinking tea ending with 吗？.",
      "你好 greets an arrival, but this already-present companion is now being asked for a beverage preference. The original tea question is necessary."
    ]},
   {instruction:"Reconstruct the original exact Hanzi greeting for a genuinely new customer who has just arrived, without replacing it with either the apple-quality declaration or the separate tea-preference question. Do not add words not present in the authenticated source.",
    quote:"你好",sourceId:"zh-ni-demo",wrongQuotes:["你喜欢喝茶吗？","这个苹果很好吃。"],
    feedback:[
      "你喜欢喝茶吗？ asks a drink-preference question, which is not the immediate greeting needed when this customer arrives. The exact attested greeting is 你好.",
      "这个苹果很好吃。 makes a fruit claim and cannot greet someone. The full original greeting contains exactly the Hanzi 你好."
    ]},
   {instruction:"Independently write and revise an eleventh vendor conversation: answer a returning buyer's question about an apple, switch to a companion already asking about tea, then welcome a third genuinely new customer. In the revised version move the newcomer to the beginning while keeping the same three source statements matched to the correct listeners.",
    criteria:[
      "Distinguish the returning fruit buyer, already-present tea companion and new arrival; attach each original source item to the correct person and purpose.",
      "Preserve the full original question 你喜欢喝茶吗？ including its final question marker and the complete original apple sentence.",
      "Compare how order and speaker attribution change between independently authored drafts, without presenting either dialogue as a source transcript."
    ]}
  )
 },
 {
  ...original[2]!,
  chineseCounterfactual:contrast(
   {context:"The clerk finishes correcting a previously mistaken teacher badge. A genuine teacher then walks over, and the student points to this different person when the receptionist asks who is actually teaching. The current task is third-person identification, not the student's own name or a denial.",
    question:"Which complete original statement now identifies that different person as the real teacher, rather than claiming the speaker is the student or rejecting a false role?",
    correctQuote:"他是老师。",wrongQuotes:["不是","我是学生。"],
    feedback:[
      "不是 was the student's earlier denial of a false identity, but the clerk now requests a positive third-person identification of the real teacher. Use 他是老师。.",
      "我是学生。 refers to the speaking student, whereas the person now identified is a different individual who teaches. The source third-person teacher statement fits."
    ]},
   {context:"After identifying the teacher correctly, a separate clerk accidentally labels the student as a teacher once more. The student is asked to explicitly reject that fresh false role before supplying any longer explanation of actual status.",
    question:"Which attested expression now explicitly denies the renewed false teacher assignment rather than identifying the teacher or positively introducing the student?",
    correctQuote:"不是",wrongQuotes:["他是老师。","我是学生。"],
    feedback:[
      "他是老师。 describes the real teacher, not the student's denial of their own wrongly assigned badge. The new error calls for original 不是.",
      "我是学生。 could state the student's identity later, but the immediate requested communicative act is an explicit rejection of a false teacher role: 不是."
    ]},
   {instruction:"Reproduce the complete original first-person Hanzi statement that the student can use after denying the renewed mistaken teacher role, naming their actual positive identity. Preserve the attested subject and final punctuation exactly.",
    quote:"我是学生。",sourceId:"zh-wo-demo",wrongQuotes:["不是","他是老师。"],
    feedback:[
      "不是 denies a false assumption but never names the student's true role; the requested full positive self-identification is 我是学生。.",
      "他是老师。 describes another person and cannot state that the student speaker is a student; the first-person complete source sentence is 我是学生。."
    ]},
   {instruction:"Create an eleventh independently authored school registration dialogue where a new teacher is identified accurately, a second clerk makes a fresh mistaken assignment about the visiting student, and the student first denies it and then states the actual positive role. In a revised version make the real teacher speak before the clerk, correcting all pronoun referents.",
    criteria:[
      "Explain who is actually the teacher, which role the clerk wrongly assigns to the student and whose point of view each source excerpt expresses.",
      "Use the source-attested role denial 不是 before a positive student identification with complete 我是学生。, and reserve 他是老师。 for another person.",
      "Keep each new line independently authored and review whether pronouns still refer to the right participants after changing the turn order."
    ]}
  )
 },
 {
  ...original[3]!,
  chineseCounterfactual:contrast(
   {context:"After a badge is returned, an unrelated visitor is mistakenly addressed by the desk clerk as an employee with a particular job title. The visitor is not employed in that role and needs to explicitly reject the newly false professional label before ownership or shared-work questions resume.",
    question:"Which original expression denies the clerk's new false job-title assertion rather than claiming badge possession or confirming a real matching colleague role?",
    correctQuote:"不是",wrongQuotes:["我的","也是"],
    feedback:[
      "我的 makes a possession claim about an item, but the clerk has just attributed a false professional title. The attested explicit denial is 不是.",
      "也是 confirms a true additionally shared role, while the visitor's claimed role is false. This requires the original negative form 不是."
    ]},
   {context:"The receptionist acknowledges that denial, and the original badge owner returns to ask which badge belongs to the person now speaking. This new task concerns ownership rather than the visitor's previously rejected job title or any coworker's real shared role.",
    question:"Which original source expression now identifies the badge as belonging to the current speaking owner, rather than discussing true or false work identity?",
    correctQuote:"我的",wrongQuotes:["不是","也是"],
    feedback:[
      "不是 was correct when the visitor denied a false role, but the returning speaker now identifies possession of an item. The first-person original possessive is 我的.",
      "也是 confirms a matching identity and cannot mark an item as belonging to its current speaking owner; the authentic source possession expression is 我的."
    ]},
   {instruction:"Reconstruct the complete original attested Hanzi expression that confirms that a different colleague also truly holds the same professional role. Do not substitute first-person badge ownership or the earlier denial of an unrelated visitor's title.",
    quote:"也是",sourceId:"zh-shi-demo",wrongQuotes:["不是","我的"],
    feedback:[
      "不是 denied the visitor's false role, whereas the task now asks about another colleague who genuinely shares an existing professional identity. Use original 也是.",
      "我的 expresses what belongs to the speaker, but a colleague's genuinely shared profession requires the original additive identity form 也是."
    ]},
   {instruction:"Write an eleventh independently authored reception exchange where a visiting guest first rejects a newly assigned false job title, the badge owner later claims an item and a third colleague finally confirms a real shared professional role. In a revised version switch which speaker holds the badge, preserving the source distinction among negation, possession and addition.",
    criteria:[
      "Explain why the visitor uses the source 不是 to deny the new false title before a separate badge-ownership question is asked.",
      "Make 我的 explicitly refer to the current speaking badge owner and 也是 to a distinct colleague who actually shares a job.",
      "Compare the changed first-person perspective between independently authored drafts without inventing an authentic Chinese source transcript."
    ]}
  )
 }
] as const;
