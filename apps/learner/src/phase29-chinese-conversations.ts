import type {ChineseConversationV1,SourceAuthoredIntake} from "./source-intake.ts";
import {PHASE28_CHINESE_SEQUENCES} from "./phase28-chinese-sequences.ts";

/** These four unpublished scenarios reorder separately attested DEMO_ONLY expressions.
 * They do not assert original dialogues, pronunciation grades or official HSK proficiency. */
const base=PHASE28_CHINESE_SEQUENCES;
const conversation=(repair:ChineseConversationV1["repair"],
 reversedSequence:ChineseConversationV1["reversedSequence"],
 finalReading:ChineseConversationV1["finalReading"],
 independentDialogue:ChineseConversationV1["independentDialogue"]):ChineseConversationV1=>
 ({repair,reversedSequence,finalReading,independentDialogue});
export const PHASE29_CHINESE_CONVERSATIONS:readonly SourceAuthoredIntake[]=[
 {
  ...base[0]!,
  id:"zh:phase29-host-and-visiting-groups",
  title:"Two visiting groups change the speaker",
  objective:"Handle a real shift from one representative's own group to the visiting group's new speaker and distinguish individual from plural referents.",
  explanation:"The original 你们 (nǐmen) addresses a group, 我 (wǒ) denotes the current speaker, and 我们 (wǒmen) includes the current speaker's people. Each excerpt is a source fact; a new speaker-led orientation sequence is newly authored practice.",
  transferSituation:"At a university room, a visitor first addresses the hosts, introduces who is speaking for the visitors and finally introduces the visitor team. The previous host-first source sequence now means something different.",
  writingInstruction:"Write a separate visitor-first conversation and explain why the group pronoun changes referent when the visitor speaks rather than the host.",
  reflection:"Why does reusing the host-first order produce a perspective error when the guest now becomes the conversation leader?",
  writingChecks:["Give the guest a clear speaker turn before saying 我们.","Identify 你们 as the host listeners from the visitor's viewpoint.","Do not attribute a new composed group exchange to the original quoted words."],
  chineseConversation:conversation(
   {question:"The visiting representative now speaks for their own group. Which source word includes the person speaking and the visiting team?",
    correctQuote:"我们",firstWrong:"你们",
    firstFeedback:"你们 means the people being addressed, now the hosts. The visiting representative's own group is 我们 (wǒmen).",
    secondWrong:"我",
    secondFeedback:"我 means only the individual speaker, not that speaker together with all the visiting students. Use 我们 for the group."},
   {instruction:"The visitor rather than the host opens this new three-part evidence sequence. Arrange the attested source fragments to address the hosts first, identify the visitor speaking next and finally identify the visitor group; the earlier host-first order is incorrect here.",
    expected:["你们","我","我们"],
    feedback:"The old host-first order 我 → 我们 → 你们 no longer follows the new visitor's first address to the hosts. This practice order is 你们 → 我 → 我们, not an original source conversation."},
   {context:"After addressing the hosts and explaining their own team, the visitor asks another student to identify the individual speaker rather than either group.",
    question:"Which exact original excerpt names only the individual now speaking?",
    correctQuote:"我",wrongQuote:"我们",
    feedback:"我 (wǒ) is the individual speaker. 我们 includes that speaker's group, so it cannot answer a request for the individual alone."},
   {instruction:"Write a fifth original exchange: the first visiting student yields to a second student who now speaks for the hosts. Explicitly annotate the new speaker, the group included in 我们 and the group addressed with 你们 on each turn.",
    criteria:["Switch the speaker deliberately between visitor and host.","Recheck 我们 and 你们 independently in both directions of address.","Mark every original source word versus each learner-authored line without claiming recorded dialogue."]}
  )
 },
 {
  ...base[1]!,
  id:"zh:phase29-returning-buyer-and-new-guest",
  title:"A returning buyer and a new tea guest",
  objective:"Separate an apple statement meant for a returning customer from a greeting to a new visitor and a later tea-preference question.",
  explanation:"The source 这个苹果很好吃。 identifies an apple and describes its taste; 你好 greets a new person; 你喜欢喝茶吗？ asks about tea. In a returning-buyer scenario, the communicative order differs from a standard first-arrival greeting.",
  transferSituation:"A buyer who has already greeted the vendor first discusses the apple. A different guest then arrives and receives a greeting and a tea question. These are original pedagogical speaker turns, not source-recorded speech.",
  writingInstruction:"Write two independent vendor conversations with two distinct guests: a returning apple buyer and a new tea guest. Avoid repeating the greeting to the returning buyer.",
  reflection:"Why must the host not ask a tea preference when the returning buyer is only interested in an apple, and when is 你好 appropriate?",
  writingChecks:["Identify the returning buyer's apple question as separate from a greeting.","Use 你好 only for the new guest's actual arrival.","Keep final 吗 for the tea preference and the apple statement declarative."],
  chineseConversation:conversation(
   {question:"The returning buyer only wants information about the apple, not another greeting or a tea question. Which source quotation supplies a complete relevant statement?",
    correctQuote:"这个苹果很好吃。",
    firstWrong:"你好",
    firstFeedback:"你好 greets an arriving person; the returning buyer is already engaged and has asked about the apple, so the complete apple-quality sentence is needed.",
    secondWrong:"你喜欢喝茶吗？",
    secondFeedback:"你喜欢喝茶吗？ asks whether someone likes tea. It does not describe the apple that the returning customer requested."},
   {instruction:"Order three separately attested phrases for this new two-guest stall situation: answer the returning buyer about the apple first, greet a new visitor next, and then ask the new visitor about tea; this is not the earlier single-buyer order.",
    expected:["这个苹果很好吃。","你好","你喜欢喝茶吗？"],
    feedback:"The previous first-arrival sequence began with 你好 and only discussed the apple later. Now the returning buyer's apple request comes before a new guest arrives, so answer the apple first."},
   {context:"The returning buyer leaves. A new visitor walks up and needs a greeting before being asked what they want to drink. Do not confuse the greeting with the apple statement.",
    question:"Which original expression opens contact with this newly arriving visitor?",
    correctQuote:"你好",wrongQuote:"这个苹果很好吃。",
    feedback:"这个苹果很好吃。 describes the apple for a buyer who is already talking to the vendor. A new arrival is greeted with 你好 (nǐ hǎo)."},
   {instruction:"Write a fifth independently authored stall dialogue that alternates between the returning apple buyer and the newly arriving tea guest. Label who each question addresses and explain why the order differs from the first-contact scene.",
    criteria:["Give both customers separate roles and timestamps in your new story.","Distinguish the tea yes/no question ending in 吗 from the declarative apple report.","Quote original Hanzi/Pinyin exactly only when they are the attested excerpt, never present new dialogue as sourced."]}
  )
 },
 {
  ...base[2]!,
  id:"zh:phase29-visitor-corrects-role",
  title:"A visitor corrects a mistaken school role",
  objective:"Interpret a new teacher-first setting, explicit denial of a mistaken role and finally the student's own first-person role statement.",
  explanation:"他是老师。 (Tā shì lǎoshī.) identifies another person as a teacher; 不是 (bú shì) denies an identity claim, while 我是学生。 (Wǒ shì xuésheng.) identifies the person speaking as a student. This visitor-first ordering is newly authored; the native Chinese source supplied only the original excerpts.",
  transferSituation:"A visitor identifies the teacher first, then the student denies being another teacher, and finally identifies themself as a student. The older self-first orientation order no longer fits the correction.",
  writingInstruction:"Write a practical student-visitor dialogue that begins by identifying the nearby teacher, includes a mistaken role and ends with the student clarifying their own role.",
  reflection:"What is the referent of each sentence after the visitor asks about the teacher first, and why does the negation need a specific mistaken identity to deny?",
  writingChecks:["Point to the other person with 他是老师。 when discussing the teacher.","Treat 不是 as the original negation form, not a fully attested conversation turn.","Use 我是学生。 for the student's self-identification, not as a statement about the teacher."],
  chineseConversation:conversation(
   {question:"The student must deny the visitor's mistaken assumption that they are another teacher. Which attested source item expresses identity negation?",
    correctQuote:"不是",
    firstWrong:"他是老师。",
    firstFeedback:"他是老师。 affirms that another person is a teacher, but does not deny the mistaken identity attributed to the speaker. The negation form is 不是.",
    secondWrong:"我是学生。",
    secondFeedback:"我是学生。 is a positive self-identification. It can clarify a role, but 不是 is the source form needed to explicitly deny the visitor's false assumption."},
   {instruction:"Reorder the attested identity evidence for a new situation: first identify the teacher who is nearby, then deny the wrong role given to the speaker, then let the speaker identify themself as a student. The prior student-first ordering is now the wrong answer.",
    expected:["他是老师。","不是","我是学生。"],
    feedback:"The previous sequence introduced the student before the teacher. This visitor-first scene identifies the teacher, then shows denial of the student's wrongly assigned role, then gives the student's affirmative self-identification."},
   {context:"The visitor has now identified the teacher and heard the role denial. The student is asked what they themselves are, rather than who the teacher is.",
    question:"Which original complete sentence gives the current student's own identity?",
    correctQuote:"我是学生。",wrongQuote:"他是老师。",
    feedback:"The third-person 他是老师。 concerns the nearby teacher. The student's answer about themself is 我是学生。 with 我 as subject."},
   {instruction:"Compose a fifth learner-owned reception exchange where the visiting teacher is correctly identified before a student corrects a false assumption. Explain the contrast between negation and a first-person affirmative identity.",
    criteria:["Specify who is speaking and who is being identified by each positive identity statement.","Use denial only where the scene actually asserts a mistaken identity.","Explicitly separate the three original source expressions from all additional learner-authored words."]}
  )
 },
 {
  ...base[3]!,
  id:"zh:phase29-colleague-before-badge",
  title:"A colleague's shared role before a badge check",
  objective:"Track when an additional identity, a first-person possession and a later identity denial are required in a reordered office conversation.",
  explanation:"也是 (yě shì) adds that an identity also applies; 我的 (wǒ de) denotes first-person possession; 不是 (bú shì) denies a wrong identity. An added identity at the beginning of a conversation changes the appropriate sequence without changing the original Chinese meanings.",
  transferSituation:"A clerk confirms that a newly arrived colleague also shares the same role, then a guest claims their own badge, and finally denies an incorrectly assigned position. This reverses the earlier badge-first sequence.",
  writingInstruction:"Create a reception-desk conversation that starts with a shared colleague role, then a badge ownership question and finally a separate mistaken-position denial.",
  reflection:"Why would a role denial come after a colleague's matching role and a badge check in this new scenario, while every source expression still keeps its original meaning?",
  writingChecks:["Use 也是 for the additional shared identity rather than a negation.","Use 我的 for possession by the person speaking, not the clerk.","Use 不是 only when correcting a genuinely mistaken role."],
  chineseConversation:conversation(
   {question:"The clerk confirms that the new colleague has the same role as another person. Which original source expression adds the shared role?",
    correctQuote:"也是",
    firstWrong:"不是",
    firstFeedback:"不是 denies an identity and would contradict the clerk's statement that the colleague shares the role. 也是 adds that the identity also applies.",
    secondWrong:"我的",
    secondFeedback:"我的 means my or mine and indicates ownership, not another person's matching job identity. The source expression for an additional identity is 也是."},
   {instruction:"Order source expressions for a new office turn sequence: first say that another colleague shares a role, next claim one's own badge, and finally deny an incorrect position. The older badge-first order is no longer appropriate.",
    expected:["也是","我的","不是"],
    feedback:"The older authored situation started with badge ownership. The new colleague-first context uses 也是 before 我的, and reserves 不是 for the final correction of an incorrect role."},
   {context:"After the colleague's shared role has been established, the reception worker asks which badge belongs to the current speaker, not whether they have a different job.",
    question:"Which original expression now conveys first-person possession?",
    correctQuote:"我的",wrongQuote:"也是",
    feedback:"也是 adds that someone shares an identity. The clerk now asks whose badge it is: 我的 (wǒ de) indicates possession by the speaker."},
   {instruction:"Author a fifth original office exchange in which one colleague arrives first, a different guest then claims a badge, and the clerk finally corrects a mistaken role. Keep the three decisions independent.",
    criteria:["Begin with another person's matching identity without confusing it with ownership.","Make the badge owner and current speaker explicit before using 我的.","Use 不是 only to deny a false identity, and keep unverified new conversation separate from original quoted forms."]}
  )
 }
] as const;
