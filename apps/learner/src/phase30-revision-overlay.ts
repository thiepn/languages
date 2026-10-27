import type {ChineseRevisionV1,SourceAuthoredIntake} from "./source-intake.ts";
import {PHASE30_CHINESE_PERSPECTIVES} from "./phase30-chinese-perspectives.ts";

/** These added third-context decisions supplement the already committed Phase 30
 * perspectives; source quotes and player ownership remain entirely unchanged. */
const revise=(revisedReading:ChineseRevisionV1["revisedReading"],
 sourceReconstruction:ChineseRevisionV1["sourceReconstruction"],
 thirdSequence:ChineseRevisionV1["thirdSequence"],
 independentRevision:ChineseRevisionV1["independentRevision"]):ChineseRevisionV1=>
 ({revisedReading,sourceReconstruction,thirdSequence,independentRevision});
const addedRevisions:readonly ChineseRevisionV1[]=[
 revise(
   {context:"A moderator interrupts two student representatives. The moderator addresses the participants together rather than including all of them in the moderator's own team. They need one original second-person plural term.",
    question:"Which exact original source expression addresses the student groups as listeners, rather than referring to the speaker's own team or the individual speaker?",
    correctQuote:"你们",firstWrong:"我们",
    firstFeedback:"我们 (wǒmen) includes whoever is speaking and their group, but the moderator is directly addressing separate listeners. The original addressee form is 你们.",
    secondWrong:"我",
    secondFeedback:"我 refers to the moderator alone. The instruction addresses multiple listeners, so the attested plural second-person source is 你们 (nǐmen)."},
   {instruction:"Reconstruct the exact attested Hanzi of the moderator's own group after the moderator has finished addressing the listeners; include both characters and do not replace this group with a single person or the addressed groups.",
    correctQuote:"我们",sourceId:"zh-wo-demo",firstWrong:"你们",
    firstFeedback:"你们 identifies the group addressed, not a group including the speaker. The original first-person plural Hanzi is 我们 (wǒmen).",
    secondWrong:"我",
    secondFeedback:"我 identifies only the current speaker. The third context requires a group containing that speaker, expressed with original 我们."},
   {instruction:"Arrange the three unchanged original source items for the moderator's THIRD new situation: identify the individual moderator, then address the groups listening, and only then identify the moderator's own group. Earlier host-first and visitor-first orders do not fit this authored conversation.",
    expected:["我","你们","我们"],
    firstFeedback:"The original host-first sequence 我 → 我们 → 你们 identifies the own group before addressing participants, but this moderator addresses listeners immediately after identifying themself.",
    secondFeedback:"The prior visitor-first sequence 你们 → 我 → 我们 addresses the listeners before the moderator has introduced who is speaking. This scene begins with 我."},
   {instruction:"Write a seventh original three-person conversation: two student representatives disagree over who is speaking for each group and a moderator clarifies speaker, addressee and own-group membership. Independently revise the dialogue after the moderator is replaced by a visitor.",
    criteria:["Label at least three speaking turns and describe the role of every person.","Reinterpret 我们 and 你们 after the moderator's role changes rather than copying the earlier dialogue.","Keep exact Hanzi source quotations separate from new learner-authored lines and do not claim verified spoken Chinese."]}
  ),
 revise(
   {context:"The first customer is already talking to the vendor and the apple description will come later. The vendor asks only whether this customer likes drinking tea; a greeting and fruit statement are both wrong speech acts.",
    question:"Which exact original sentence asks the first customer about tea, rather than greeting them or describing their apple?",
    correctQuote:"你喜欢喝茶吗？",firstWrong:"你好",
    firstFeedback:"你好 is a greeting, but this customer has already been greeted. The requested tea-preference question ends with the source particle 吗？.",
    secondWrong:"这个苹果很好吃。",
    secondFeedback:"这个苹果很好吃。 describes a particular apple; it has no yes/no question and does not ask the guest whether they like tea."},
   {instruction:"Type the complete original Hanzi apple-quality statement for the first customer's fruit, retaining its punctuation; a greeting or a tea-preference question is not the requested declarative sentence.",
    correctQuote:"这个苹果很好吃。",sourceId:"zh-hao-demo",
    firstWrong:"你喜欢喝茶吗？",
    firstFeedback:"The tea source ends with 吗？ and asks a preference; the intended apple description is 这个苹果很好吃。 with declarative punctuation.",
    secondWrong:"你好",
    secondFeedback:"你好 establishes contact with another person and contains no information about the taste of this particular apple."},
   {instruction:"For a THIRD independently authored market scene, order the exact source phrases as tea preference for an already-present visitor, apple quality for that visitor, and finally a greeting for a new arrival. Neither earlier buyer-first nor returning-buyer-first sequence fits.",
    expected:["你喜欢喝茶吗？","这个苹果很好吃。","你好"],
    firstFeedback:"The earlier one-visitor scenario began by greeting before asking about tea. Here the first visitor is already present and the only new greeting occurs after both tea and apple discussion.",
    secondFeedback:"The returning-buyer scenario describes an apple first, but in this new case the vendor first asks about tea, then discusses the apple and finally greets another arrival."},
   {instruction:"Write a seventh independent market-stall conversation with two customers arriving at different moments. The vendor first asks the present visitor about tea, later describes the visitor's apple, and only then greets the next guest. Revise the script if the second visitor arrives earlier.",
    criteria:["Label which visitor has already arrived and who receives the final greeting.","Preserve the question marker 吗 in source-attested tea text and explain why the apple line is a statement.","Separately mark every sourced exact Hanzi line and your own originally authored replies and transitions."]}
  ),
 revise(
   {context:"Before either person has been introduced, the visitor falsely assumes the current student is the teacher. The student must reject that assumption first, rather than begin with an affirmative student or teacher identity.",
    question:"Which original source item explicitly denies the mistaken teacher identity at the start of this new dialogue?",
    correctQuote:"不是",firstWrong:"我是学生。",
    firstFeedback:"我是学生。 does state the speaker is a student, but it is affirmative identification; this question asks for the original form that explicitly negates the mistaken teacher role.",
    secondWrong:"他是老师。",
    secondFeedback:"他是老师。 identifies a different person as teacher and cannot itself deny the visitor's false claim about the person speaking. The negation form is 不是."},
   {instruction:"Reconstruct the complete originally attested Hanzi student self-identification after correcting the visitor, including the original final full stop. Do not give the separate teacher sentence or bare negation as the student's affirmative identity.",
    correctQuote:"我是学生。",sourceId:"zh-wo-demo",firstWrong:"不是",
    firstFeedback:"不是 denies a mistaken role but does not positively identify the current speaker. The full original student statement is 我是学生。.",
    secondWrong:"他是老师。",
    secondFeedback:"他是老师。 uses a third-person subject for another person. The self-identifying student must use the original first-person sentence 我是学生。."},
   {instruction:"Sequence the three unchanged source expressions for a THIRD original learner situation: deny the visitor's false teacher assumption immediately, then identify the speaker as student, then name the actual teacher. This denial-first order differs from both previously taught positive-introduction sequences.",
    expected:["不是","我是学生。","他是老师。"],
    firstFeedback:"The first earlier scenario stated student and teacher identities before introducing denial. Here the false assumption must be rejected immediately with 不是, followed by clarified identities.",
    secondFeedback:"The second earlier visitor-first scene identified the teacher before the denial. In this new situation the visitor is speaking to the mistaken student and needs immediate correction first."},
   {instruction:"Write a seventh practical three-person dialogue where a visitor mistakes a student for the teacher, the student first denies it, identifies themself and identifies the actual teacher. Revise the scene so a second visitor instead asks about the teacher without making the same error.",
    criteria:["Identify what assumption is false and who explicitly denies it before positive identification.","Distinguish the first-person student and third-person teacher subjects in every original source excerpt.","Label additional conversational content as learner-authored; do not claim the source records a complete correction exchange."]}
  ),
 revise(
   {context:"At the office a clerk has corrected a false role claim and then confirmed the colleague holds the same real role. The guest now only asks which badge belongs to the person speaking, not about anyone's position.",
    question:"Which exact original source expression identifies the current speaker's badge as theirs, rather than adding or denying an identity?",
    correctQuote:"我的",firstWrong:"不是",
    firstFeedback:"不是 rejects an identity claim and has no possessive particle. The new question asks about whose badge it is, so use the original 我的 (wǒ de).",
    secondWrong:"也是",
    secondFeedback:"也是 means that an identity also holds, not that an object belongs to the speaker. The first-person possessive original is 我的."},
   {instruction:"Type the complete original Hanzi form for an additional colleague having the same identity, rather than the denial or the possessive badge claim.",
    correctQuote:"也是",sourceId:"zh-shi-demo",firstWrong:"不是",
    firstFeedback:"不是 is a denial and would contradict the additional true role. The original additive identity expression is 也是 (yě shì).",
    secondWrong:"我的",
    secondFeedback:"我的 expresses first-person possession of an object. The intended source short expression adds that someone also holds the identity: 也是."},
   {instruction:"For a THIRD newly authored service-desk conversation, place the original expression for denial of a mistaken role first, the added colleague identity second, and the guest's personal badge claim last. Neither earlier badge-first nor colleague-first sequence fits this order.",
    expected:["不是","也是","我的"],
    firstFeedback:"The previous badge-first sequence started with 我的, but this guest's badge is not discussed until after the role error and shared colleague identity have been resolved.",
    secondFeedback:"The previous colleague-first sequence began with 也是, while the clerk in this scene must correct the mistaken identity using 不是 before confirming another matching role."},
   {instruction:"Write a seventh original office exchange: a clerk rejects a mistaken identity, introduces another colleague with the real matching role and finally asks which badge belongs to the current speaker. Revise for a second guest whose badge does not belong to the first visitor.",
    criteria:["Resolve the incorrect identity before adding a genuinely matching colleague role.","Treat 我的 as possession by the actual speaking guest, not a role description.","Separate attested original words and tone-marked reading from the new unverified Chinese dialogue."]}
  )
];
/** Same four Phase 30 lesson IDs, never four duplicate candidates or new canonical content. */
export const PHASE30_ENRICHED_PERSPECTIVES:readonly SourceAuthoredIntake[]=
 PHASE30_CHINESE_PERSPECTIVES.map((spec,i)=>({
  ...spec,
  chineseRevision:addedRevisions[i]!
 }));
