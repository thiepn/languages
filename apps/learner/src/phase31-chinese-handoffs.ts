import type {ChineseRoleHandoffV1,SourceAuthoredIntake} from "./source-intake.ts";
import {PHASE30_ENRICHED_PERSPECTIVES} from "./phase30-revision-overlay.ts";

/** Four genuinely changed speaker-and-intent scenarios over exact original
 * thiepn/chinese DEMO_ONLY encounters. New dialogue turns are editorial practice. */
const prior=PHASE30_ENRICHED_PERSPECTIVES;
const handoff=(firstIntent:ChineseRoleHandoffV1["firstIntent"],
 secondIntent:ChineseRoleHandoffV1["secondIntent"],
 fourthSequence:ChineseRoleHandoffV1["fourthSequence"],
 independentDialogue:ChineseRoleHandoffV1["independentDialogue"]):ChineseRoleHandoffV1=>
 ({firstIntent,secondIntent,fourthSequence,independentDialogue});
export const PHASE31_CHINESE_HANDOFFS:readonly SourceAuthoredIntake[]=[
 {
  ...prior[0]!,
  id:"zh:phase31-group-dialogue-repair",
  title:"Repairing who speaks for two student groups",
  objective:"Repair a misunderstood group reference by checking who holds the floor, then intentionally switch to addressing the other group's listeners.",
  explanation:"Each original source item keeps its meaning: 我 (wǒ) is the individual speaker, 我们 (wǒmen) is a speaker-inclusive group, and 你们 (nǐmen) names plural listeners. The two source expressions switch correctness only because the authored speaker's intended reference changes.",
  transferSituation:"During a shared seminar, the first moderator reports what their own team agreed. They then turn toward visiting students to ask the visitors for their opinion. Another student wrongly reuses the earlier first-person group when addressing the visitors.",
  writingInstruction:"Draft an independently authored seminar repair between moderator, visiting representative and student. Make the reason for switching from the moderator's team to the addressed listeners explicit.",
  reflection:"Why does the same speaker-inclusive group expression become the wrong answer once the moderator is directly addressing the other participants?",
  writingChecks:["State who is currently speaking before using first-person plural.","Distinguish the addressed group from the moderator's own team.","Identify which mistaken source form caused the misunderstanding and repair the addressee."],
  chineseRoleHandoff:handoff(
   {context:"One moderator summarizes a decision taken together with their own student teammates. The moderator intends to include themself and their team, not to address the visiting audience.",
    question:"Which exact original source expression means the team including the speaker, rather than the visiting group being addressed?",
    correctQuote:"我们",wrongQuote:"你们",
    feedback:"你们 (nǐmen) addresses plural listeners. The moderator is now talking about the team that includes themself, so the original speaker-inclusive form is 我们 (wǒmen)."},
   {context:"The same moderator now turns to the visiting students and asks those other people to answer. The moderator no longer describes their own group's decision but explicitly addresses the listeners.",
    question:"Which exact original expression now addresses the visiting students, making the previous speaker-inclusive answer wrong?",
    correctQuote:"你们",wrongQuote:"我们",
    feedback:"我们 still refers to the group including the moderator. The communicative purpose has changed to addressing the visitors, so 你们 (nǐmen) is correct now."},
   {instruction:"Order the three unchanged authentic source items for a fourth newly authored seminar turn: first describe the moderator's own team, next identify the individual who is speaking for it, and finally address the visiting listeners. The three previous situations had different orders.",
    expected:["我们","我","你们"],
    previousFeedback:[
      "The host-first order began with the individual and then their own team. Here the team is being discussed before the moderator identifies who is speaking for that team.",
      "The visitor-first sequence began by addressing listeners. Here the own-team report comes first, so the visiting students are addressed only in the final turn.",
      "The third moderator scene identified the individual and directly addressed listeners before naming the moderator's own team. This scene deliberately reports the team first."
    ]},
   {instruction:"Write an eighth independently authored multi-speaker meeting exchange: a moderator first reports a team decision, a student misunderstands who 'we' includes, and the moderator repairs the misunderstanding before inviting visitors to respond. After reviewing your first draft, rewrite the exchange with a different visitor speaking.",
    criteria:["Identify at least three separate speaking turns and the mistaken group reference.","Explain why 我们 initially refers to the moderator's group but 你们 later addresses visitors.","Clearly distinguish the unchanged authentic Hanzi source items from all additional learner-authored turns."]}
  )
 },
 {
  ...prior[1]!,
  id:"zh:phase31-tea-counter-misunderstanding",
  title:"Correcting a tea-counter misunderstanding",
  objective:"Recognize that greeting a newly arriving shopper is different from asking an already present customer about tea, then repair the order of a two-customer exchange.",
  explanation:"Source-attested 你好 (nǐ hǎo) is a greeting, 你喜欢喝茶吗？ (Nǐ xǐhuan hē chá ma?) is a yes/no drink-preference question, and 这个苹果很好吃。 (Zhège píngguǒ hěn hǎochī.) describes fruit. Speaker intent changes which excerpt belongs to each visitor.",
  transferSituation:"A newly arriving customer is greeted. A customer already talking to the vendor asks about tea, but the vendor mistakenly greets them again. The vendor must use the tea question instead of repeating the arrival greeting.",
  writingInstruction:"Compose a short original market conversation with two distinct customers: one actually arrives, while the other has already started asking about a drink. Resolve the duplicated greeting and then mention the apple.",
  reflection:"What distinguishes greeting someone new from asking an existing visitor a question that ends with the original particle 吗?",
  writingChecks:["Attach 你好 to the actually arriving customer rather than a returning buyer.","Ask the present guest about tea using the attested question particle 吗.","Describe the apple independently of the greeting and drink question."],
  chineseRoleHandoff:handoff(
   {context:"A second shopper walks up and the vendor has not yet addressed this person. The vendor must open the conversation politely before discussing any fruit or tea.",
    question:"Which original expression greets the newly arriving shopper, rather than asking about tea?",
    correctQuote:"你好",wrongQuote:"你喜欢喝茶吗？",
    feedback:"你喜欢喝茶吗？ asks whether someone likes tea. The new shopper has not yet been greeted; source-attested 你好 is the appropriate opening."},
   {context:"The shopper has already been greeted and now the vendor needs to ask whether this guest enjoys drinking tea. Repeating a greeting would not ask a preference.",
    question:"Which exact original question now checks the guest's tea preference, making the previous greeting no longer an answer?",
    correctQuote:"你喜欢喝茶吗？",wrongQuote:"你好",
    feedback:"你好 was appropriate for the arrival, but it cannot ask about a drink. The question 你喜欢喝茶吗？ ends with 吗 and matches the new communicative goal."},
   {instruction:"Order exact original source excerpts for a fourth new stall scenario: greet the actual new guest, then describe the apple already shown to the returning customer, and only afterward ask the new guest about tea. Both customers have different conversational purposes.",
    expected:["你好","这个苹果很好吃。","你喜欢喝茶吗？"],
    previousFeedback:[
      "The initial single-buyer order asked about tea before describing an apple. Here the returning buyer's fruit question is answered before the new guest receives the tea question.",
      "The second returning-buyer order described the apple before any greeting. In this scene a new guest arrives first, so 你好 must precede the apple statement.",
      "The third tea-first order began with an already-present guest and placed the greeting last. Here greeting the new arrival comes before both later topics."
    ]},
   {instruction:"Create and revise an eighth independently authored market dialogue: distinguish a guest who has just arrived from a customer already asking about tea and a returning buyer asking about fruit. Explicitly repair the vendor's wrong repeated greeting when the present customer asks a preference question.",
    criteria:["Keep all three customers' arrival status, addressee and requested topic distinct.","Explain why 你好 cannot replace the attested tea question after a greeting has already happened.","Mark all new visitor/vendor turns as your own writing, not a recorded original Chinese dialogue."]}
  )
 },
 {
  ...prior[2]!,
  id:"zh:phase31-student-identity-misunderstanding",
  title:"Resolving a mistaken teacher identity",
  objective:"Understand how an initial denial of a mistaken role differs from a later positive first-person student identification, while preserving the third-person teacher sentence.",
  explanation:"The source form 不是 (bú shì) denies an identity. 我是学生。 (Wǒ shì xuésheng.) explicitly identifies the speaking student; 他是老师。 (Tā shì lǎoshī.) describes another person as teacher. One attested expression cannot replace a different communicative act.",
  transferSituation:"At registration, a clerk mistakenly identifies a student as the teacher. The student must first deny the false role, then explicitly identify themself as student so the clerk knows who needs registration.",
  writingInstruction:"Write a new clerk/student/teacher exchange in which the wrong role is denied before the student supplies a positive identity. Include a separate teacher identification without presenting invented replies as source excerpts.",
  reflection:"Why does a negation followed by a positive role statement communicate more than either isolated original expression in this invented registration situation?",
  writingChecks:["Make the mistaken teacher assumption explicit before a denial.","Use the complete first-person student identity statement for a positive correction.","Reserve the third-person teacher sentence for another person."],
  chineseRoleHandoff:handoff(
   {context:"Before introductions the clerk explicitly but incorrectly tells the visiting student that they are the teacher. The student first wants to deny that false identity, not yet to state their own role.",
    question:"Which original short expression explicitly negates the clerk's mistaken teacher identity?",
    correctQuote:"不是",wrongQuote:"我是学生。",
    feedback:"我是学生。 is a positive identification and does not itself use the original negation. To deny a mistaken teacher role explicitly in this separate step, use 不是."},
   {context:"The clerk accepts the denial but still needs to know the current visitor's actual status to register them. The student is now asked to give their own complete positive identity statement.",
    question:"Which exact original sentence now says that the person speaking is a student, rather than merely denying the former mistake?",
    correctQuote:"我是学生。",wrongQuote:"不是",
    feedback:"不是 was used to deny the erroneous assumption. It does not name the visitor's actual role. The exact original positive sentence is 我是学生。."},
   {instruction:"Arrange unchanged original source excerpts for a fourth registration practice: first identify the nearby teacher for orientation, then identify the visitor who is speaking as a student, and only afterward deny a different person's mistaken identity. Keep the denial attached to a specifically wrong role.",
    expected:["他是老师。","我是学生。","不是"],
    previousFeedback:[
      "The initial student-first order named the student before the teacher. Here the actual teacher is identified first and the student's own positive statement follows.",
      "The previous visitor-first scenario denied the wrong role immediately after naming the teacher. This scene gives the student's true identity before correcting another role error.",
      "The third scenario began with denial. This new scenario begins with an accurate orientation statement about the teacher, not a false assumption."
    ]},
   {instruction:"Author and independently revise an eighth school registration conversation among a clerk, a student and the actual teacher. Show the mistaken assertion, an explicit denial, the student's correct positive role and an independent later mistaken role for another person.",
    criteria:["Identify exactly which assertion is false before using the source negation 不是.","Separate affirmative 我是学生。 about the speaker from 他是老师。 about another person.","Distinguish quoted authentic source Hanzi from all new dialogue lines and evaluate the corrected speakers."]}
  )
 },
 {
  ...prior[3]!,
  id:"zh:phase31-badge-and-job-repair",
  title:"Separating a badge claim from a shared job",
  objective:"Resolve an ownership dispute before discussing whether another person holds the same role, and prevent the possessive marker from replacing identity evidence.",
  explanation:"The original 我的 (wǒ de) expresses first-person possession, 也是 (yě shì) adds an identity that also applies, and 不是 (bú shì) denies a role. The badge owner's voice and their colleague's role are different questions.",
  transferSituation:"One colleague identifies which badge belongs to them. A receptionist then asks whether another colleague shares the same role. An earlier answer about ownership must not be reused as a role statement.",
  writingInstruction:"Compose an independent front-desk exchange where one person claims a badge, a colleague clarifies a shared job, and a third worker rejects a mistaken title. Change the person speaking and explain each source choice.",
  reflection:"What makes the first-person ownership expression correct for a badge but wrong once the question concerns another colleague with the same position?",
  writingChecks:["Tie 我的 to the actual current owner and not simply the person holding the badge.","Use 也是 only for an additional true shared role.","Use 不是 when a specific identity is incorrect rather than when discussing possession."],
  chineseRoleHandoff:handoff(
   {context:"A guest finds a badge that is theirs and identifies it to the clerk while they are speaking. No question about job title or another person's role has yet been asked.",
    question:"Which attested original expression states that the badge belongs to the current speaker?",
    correctQuote:"我的",wrongQuote:"也是",
    feedback:"也是 adds that an identity also applies to someone. The guest is only identifying first-person ownership of the badge, so the correct original form is 我的."},
   {context:"The clerk has settled who owns the badge. A colleague enters and the clerk confirms that they have the same true role as the earlier worker; the question is no longer about ownership.",
    question:"Which exact original expression now adds that another colleague shares the same role, making the former possessive answer irrelevant?",
    correctQuote:"也是",wrongQuote:"我的",
    feedback:"我的 belonged to the ownership question. The new communicative goal adds another colleague's shared role, so the original additive identity expression is 也是."},
   {instruction:"Sequence three unchanged original source expressions for a fourth reception situation: the actual speaker first claims a badge as theirs, then confirms another worker also shares the real job title, and finally a third visitor denies a different mistaken role.",
    expected:["我的","也是","不是"],
    previousFeedback:[
      "The earlier badge-first situation denied a wrong job immediately after confirming ownership. Here another colleague's correct shared identity comes before the later role denial.",
      "The second situation placed the colleague's matching role before any badge claim. This new situation starts with the owner identifying the badge.",
      "The third situation rejected a mistaken role at the beginning. In this context the badge claim and genuine shared identity are resolved before a different error is denied."
    ]},
   {instruction:"Write an eighth independent reception-desk exchange: the owner claims a badge, another colleague is incorrectly taken for the owner, and the clerk asks a separate shared-job question. Repair the misunderstanding by shifting from possession to role evidence before introducing a third employee who denies a false title.",
    criteria:["Keep possession and the new speaker separate when the badge changes hands.","Explain why 我的 no longer answers the shared-role question and when 也是 becomes appropriate.","Reserve 不是 for a genuine false identity and keep every new conversation turn independently authored."]}
  )
 }
] as const;
