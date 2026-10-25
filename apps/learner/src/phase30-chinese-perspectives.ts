import type {SourceAuthoredIntake,ChinesePerspectiveV1} from "./source-intake.ts";
import {PHASE29_CHINESE_CONVERSATIONS} from "./phase29-chinese-conversations.ts";
const parent=PHASE29_CHINESE_CONVERSATIONS;
const perspective=(changedListener:ChinesePerspectiveV1["changedListener"],
 laterReading:ChinesePerspectiveV1["laterReading"],
 secondPinyin:ChinesePerspectiveV1["secondPinyin"],
 sixthDialogue:ChinesePerspectiveV1["sixthDialogue"]):ChinesePerspectiveV1=>
 ({changedListener,laterReading,secondPinyin,sixthDialogue});
/** Additional, unpublished source-pinned encounters only. New scenes and replies are authored,
 * never copied native dialogues, licensed curricula, recordings or proficiency evidence. */
export const PHASE30_CHINESE_PERSPECTIVES:readonly SourceAuthoredIntake[]=[
 {
  ...parent[0]!,
  id:"zh:phase30-moderator-switches-teams",
  title:"The moderator switches teams twice",
  objective:"Reevaluate speaker, addressed group and the individual pronoun after two changes of who leads a group meeting.",
  explanation:"我 means the currently speaking individual, 我们 includes the speaker's group, and 你们 addresses listeners in another group. The original source quotes these three forms separately. A moderator changing who leads a conversation forces repeated interpretation, not a fixed script.",
  transferSituation:"A campus moderator gives the floor to a visiting representative, then interrupts to direct a separate student group, then asks only one individual to answer.",
  writingInstruction:"Author three clearly labeled speaking turns across two real addressee changes. Explain each group's referent rather than recycling a previous memorized exchange.",
  reflection:"What remains consistent about 我们 and 你们 when the moderator changes who can speak for each group?",
  writingChecks:["Follow the person with the floor before assigning 我.","Use 我们 only for the current speaker's own group.","Use 你们 to direct a turn at multiple listeners, not the speaker's own side."],
  chinesePerspective:perspective(
   {question:"The moderator stops a group representative and calls on several other students. Which original word directly addresses those other students as listeners?",
    correctQuote:"你们",wrongQuote:"我们",
    feedback:"我们 (wǒmen) includes the current speaker. The moderator is addressing a separate group of listeners, so the source word is 你们 (nǐmen)."},
   {context:"After the group conversation, the moderator explicitly asks a single student to speak on their own behalf, not for either student team.",
    question:"Which original attested Chinese expression identifies only this one individual speaker?",
    correctQuote:"我",wrongQuote:"我们",
    feedback:"我 (wǒ) is the singular current speaker. 我们 (wǒmen) includes the speaker together with a group and would change the referent."},
   {question:"Type the exact original tone-marked Pinyin for 我们, which includes the current speaker and their team, rather than the second-person plural reading.",
    quote:"我们",sourceId:"zh-wo-demo",reading:"wǒmen",
    cue:"The verified Chinese demo source explicitly reads 我们 as wǒmen; the second syllable is neutral, and no actual speech is evaluated."},
   {instruction:"Write a sixth original campus discussion in which the moderator hands the floor to one group, reverses it to a different group, and then asks one student to speak alone. Include speaker and addressee labels and review pronouns independently.",
    criteria:["Show the moderator changing speaker authority twice, not a static exchange.","Track whether 我们 includes the person currently speaking at each turn.","Use 你们 for plural listeners and 我 for the final individual without inventing a source transcript."]}
  )
 },
 {
  ...parent[1]!,
  id:"zh:phase30-vendor-changes-customer",
  title:"The vendor switches from fruit to tea",
  objective:"Follow distinct buyers and reset an apple statement, new greeting and tea question when the relevant customer changes.",
  explanation:"The pinned original 这个苹果很好吃。 describes a particular apple. 你好 is a greeting to a new addressee; 你喜欢喝茶吗？ asks about tea. The vendor's new third customer is not an original recorded conversation.",
  transferSituation:"A vendor answers a returning buyer's apple question, greets a newly arriving shopper, and later returns to a different buyer asking only about the taste of this apple.",
  writingInstruction:"Compose two new customer exchanges where each question and statement is addressed to the right customer, not inferred from the previous line's source order.",
  reflection:"Why is a sentence ending in 吗 inappropriate when the buyer has asked only for the apple's taste?",
  writingChecks:["Identify the subject 这个苹果 of the statement.","Use 你好 for a new arrival rather than repeating it to a returning customer.","Use 你喜欢喝茶吗？ only for the guest who is actually being asked about tea."],
  chinesePerspective:perspective(
   {question:"A third shopper asks whether this particular apple tastes good. Which original statement should the vendor select instead of greeting or asking about tea?",
    correctQuote:"这个苹果很好吃。",wrongQuote:"你喜欢喝茶吗？",
    feedback:"The source tea question asks a drink preference and ends in 吗. For this apple, the attested declarative 这个苹果很好吃。 states food quality."},
   {context:"The vendor finishes describing the apple and notices that an entirely new visitor has arrived but has not been addressed at all.",
    question:"Which original excerpt opens the exchange with the newly arriving person before either food or drink is discussed?",
    correctQuote:"你好",wrongQuote:"这个苹果很好吃。",
    feedback:"The statement about 这个苹果 is a food description, not a first-contact greeting. 新到的客人 is greeted with 你好 (nǐ hǎo)."},
   {question:"Type the exact original written tone-marked Pinyin of 这个苹果很好吃。 rather than the Pinyin for the tea preference question.",
    quote:"这个苹果很好吃。",sourceId:"zh-hao-demo",reading:"Zhège píngguǒ hěn hǎochī.",
    cue:"The pinned original reading includes Zhège, píngguǒ, hěn and hǎochī with their original diacritics and full stop; it is not an audio score."},
   {instruction:"Write a sixth original stall scene in which three distinct shoppers arrive at different points. Give each shopper a separate purpose, then independently revise whether the greeting, tea question and apple statement are appropriate to each specific listener.",
    criteria:["Identify the returning buyer, the arriving guest and the later fruit customer separately.","Use question-ending 吗 only when asking the right person's tea preference.","Quote the exact original Hanzi/Pinyin only as source evidence, never as a purported recorded multivoice dialogue."]}
  )
 },
 {
  ...parent[2]!,
  id:"zh:phase30-staff-identity-handoff",
  title:"School registration changes who is mistaken",
  objective:"Differentiate an explicit identity denial from a first-person student statement and a third-person teacher identity across multiple mistaken speakers.",
  explanation:"不是 (bú shì) denies an identity; 我是学生。 (Wǒ shì xuésheng.) states that the current speaker is a student; 他是老师。 (Tā shì lǎoshī.) names a third person as teacher. These original excerpts do not attest an entire repair conversation.",
  transferSituation:"A school receptionist correctly points to a teacher, then mistakes the visiting student for the teacher and later mistakes a new speaker for a student.",
  writingInstruction:"Write a new practical registration exchange with both kinds of mistaken role. Identify the speaker for each claim and mark where a denial is required.",
  reflection:"Why is the bare source negation 不是 different from the full source sentences used to positively identify a student and a teacher?",
  writingChecks:["Clarify whether 我 refers to the visiting student or the new speaker.","Keep 他是老师。 as a statement about another person.","Choose 不是 to deny an asserted false identity, never as an unmotivated greeting."],
  chinesePerspective:perspective(
   {question:"The receptionist says that the current visitor is the teacher, but the visitor has to reject the assumption before correcting their role. Which original form actually denies an identity?",
    correctQuote:"不是",wrongQuote:"他是老师。",
    feedback:"他是老师。 identifies another person as teacher; it is a positive statement. The source 不是 (bú shì) is the form for denying the mistaken identity."},
   {context:"The receptionist now turns to the student and asks for an explicit complete sentence about their own student role, not the nearby teacher.",
    question:"Which attested original sentence identifies the current speaker as a student?",
    correctQuote:"我是学生。",wrongQuote:"他是老师。",
    feedback:"The self-identity line starts with 我 (wǒ): 我是学生。. 他是老师。 has third-person 他 and describes another person as a teacher."},
   {question:"Type the original exact tone-marked Pinyin for 不是, the identity negation form, rather than the full teacher sentence reading.",
    quote:"不是",sourceId:"zh-shi-demo",reading:"bú shì",
    cue:"The demo source records 不是 as bú shì with written tone marks, including the changed tone of 不 before 是; this is not spoken verification."},
   {instruction:"Write a sixth independent registration dialogue in which the person wrongly identified as teacher first denies the role and then a second speaker identifies the actual teacher. Add a third learner's self-description and verify pronouns.",
    criteria:["Give each person a distinct speaking turn and role.","Show a specific false identity before using the negation 不是.","Distinguish original short source excerpts from any independent corrective dialogue you compose."]}
  )
 },
 {
  ...parent[3]!,
  id:"zh:phase30-badge-exchange-and-role",
  title:"A badge changes hands but roles do not",
  objective:"Distinguish a change in which person owns a badge from whether their role is denied or shared by someone else.",
  explanation:"我的 (wǒ de) identifies the current speaker's possession. 不是 (bú shì) rejects a role claim. 也是 (yě shì) says an identity also holds. Changing badge ownership does not automatically change a person's job identity.",
  transferSituation:"A visitor returns a badge to its owner, two staff members realize they share one role, and a third worker then disputes the title printed on a different badge.",
  writingInstruction:"Write three short, newly authored reception-desk turns with explicitly marked owners and positions. Keep possession, shared identity and negation independent.",
  reflection:"What makes the possession term 我的 refer to a new person even while 也是 and 不是 continue to express different role relationships?",
  writingChecks:["Track the actual badge owner before using the first-person possessive.","Use 也是 to affirm the additional shared role.","Use 不是 when a third person denies an incorrectly assigned title."],
  chinesePerspective:perspective(
   {question:"Two staff members share the same job despite holding different badges. Which original source expression affirms the matching identity rather than ownership or denial?",
    correctQuote:"也是",wrongQuote:"不是",
    feedback:"不是 denies a role and conflicts with the stated agreement. 也是 (yě shì) adds that the identity also belongs to the colleague."},
   {context:"One visitor returns a misplaced badge and the correct owner takes the floor to identify the badge as theirs. The clerk asks who owns it, not what role it displays.",
    question:"Which original expression now indicates that the item belongs to the person speaking?",
    correctQuote:"我的",wrongQuote:"也是",
    feedback:"也是 describes another matching identity; 我的 (wǒ de) marks the current speaker's possession regardless of who held the badge earlier."},
   {question:"Type the unchanged source-attested tone-marked Pinyin for 我的, indicating the current speaker's ownership rather than the previous identity denial form.",
    quote:"我的",sourceId:"zh-wo-demo",reading:"wǒ de",
    cue:"The Chinese original example writes 我的 as wǒ de with a third-tone wǒ and neutral de, not an inferred spoken learner score."},
   {instruction:"Write a sixth original three-person conversation where a badge changes owner, a colleague shares a position, and a different visitor denies an incorrect position. Revise every expression to match its specific speaker and role.",
    criteria:["Mark exactly when the badge changes hands and who says 我的.","Ensure that 也是 confirms an identity instead of incorrectly negating it.","Use 不是 only to deny a role and distinguish source quotations from the new dialogue."]}
  )
 }
] as const;
