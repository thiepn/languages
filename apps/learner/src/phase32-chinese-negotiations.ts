import type {ChineseNegotiationV1,SourceAuthoredIntake} from "./source-intake.ts";
import {PHASE31_CHINESE_HANDOFFS} from "./phase31-chinese-handoffs.ts";

/** Original DEMO_ONLY Hanzi/Pinyin are source-owned excerpts; conversations below
 * are new exercises, neither quoted source dialogues nor official HSK content. */
const previous=PHASE31_CHINESE_HANDOFFS;
const negotiation=(opening:ChineseNegotiationV1["opening"],
 interruption:ChineseNegotiationV1["interruption"],
 thirdSpeaker:ChineseNegotiationV1["thirdSpeaker"],
 fifthSequence:ChineseNegotiationV1["fifthSequence"],
 independentDialogue:ChineseNegotiationV1["independentDialogue"]):ChineseNegotiationV1=>
 ({opening,interruption,thirdSpeaker,fifthSequence,independentDialogue});

export const PHASE32_CHINESE_NEGOTIATIONS:readonly SourceAuthoredIntake[]=[
 {
  ...previous[0]!,
  id:"zh:phase32-team-meeting-negotiation",
  title:"Three speakers repair a team meeting",
  objective:"Distinguish a coordinator's own group, a visiting audience and an individual interpreter across three interruptions, then write an independent repair dialogue.",
  explanation:"Original 我们 (wǒmen) includes the speaker's team, 你们 (nǐmen) addresses other plural listeners, and 我 (wǒ) names only the speaking individual. Each fragment is an exact demo source excerpt; the staged meeting is newly composed.",
  transferSituation:"A coordinator first describes a plan agreed by their own team. Another speaker interrupts to ask several visitors for feedback. Finally the interpreter clarifies that they alone are reporting the result, not the entire team.",
  writingInstruction:"Construct a new meeting exchange for coordinator, visitor and interpreter. Resolve which group's first-person voice changes when each speaker takes over.",
  reflection:"Why does the third speaker need the singular individual expression after one speaker referred to a team and another addressed an audience?",
  writingChecks:["Distinguish the coordinator's team from a separate visiting audience.","Switch plural reference only after identifying who has the floor.","Use the singular source item only for the interpreter speaking individually."],
  chineseNegotiation:negotiation(
   {context:"The meeting coordinator begins by reporting the conclusion reached by the coordinator and their own teammates, without asking the visiting students a question.",
    question:"Which original form includes this coordinator with their own team rather than directly addressing the visitors?",
    correctQuote:"我们",wrongQuote:"你们",
    feedback:"你们 is the plural listener form, not the coordinator's own group. The original 我们 identifies the team including the speaker."},
   {context:"The meeting is interrupted by a new speaker inviting several visiting students to speak. The purpose is now addressing these listeners rather than describing the earlier coordinator's team.",
    question:"Which attested Hanzi expression now directly addresses the visiting listeners instead of referring to the previous speaker's team?",
    correctQuote:"你们",wrongQuote:"我们",
    feedback:"The former correct word 我们 would include whoever is speaking, but the new speaker addresses another group. That requires original 你们."},
   {context:"After the group response, the interpreter is asked to clarify that the message is the interpreter's own individual report and not the position of all teammates or an address to visitors.",
    question:"Which exact original source expression names the single interpreter who is currently speaking?",
    correctQuote:"我",wrongQuotes:["我们","你们"],
    feedback:[
      "我们 includes the interpreter and their group, while the instruction requests the interpreter alone. The attested singular expression is 我.",
      "你们 addresses plural listeners rather than denoting the individual interpreter. Only 我 refers to the person now speaking."
    ]},
   {instruction:"For a fifth independently authored meeting, order the attested phrases as the moderator first identifying their own team, next addressing the visiting listeners and finally letting the individual interpreter identify themself. This differs from all four previously accepted situations.",
    expected:["我们","你们","我"],
    previousFeedback:[
      "The original host-first practice introduced the individual before their team. This meeting instead begins with the team's shared decision.",
      "The earlier visitor-first order addressed visitors before saying which team reports. Here the shared team report comes first.",
      "The earlier moderator scene introduced an individual first. Here the singular interpreter does not speak until the final turn.",
      "The fourth scene introduced the individual before addressing visitors. Now the coordinator first reports the team, then calls on visitors."
    ]},
   {instruction:"Write a ninth independent meeting dialogue: the coordinator reports their team's plan, a new speaker asks visiting students to respond and an interpreter finally gives an individual account. Revise the draft so the interpreter later speaks for the team instead of only themself.",
    criteria:[
      "Identify every speaker and distinguish the coordinator's own group from visitors receiving the question.",
      "Explain the change from 我们 to 你们 and then to singular 我 using the original source expressions correctly.",
      "Compare the initial and revised conversations and label every independently authored line separately from the exact demo source quotes."
    ]}
  )
 },
 {
  ...previous[1]!,
  id:"zh:phase32-market-three-customer-repair",
  title:"Three customers change a market conversation",
  objective:"Handle an apple-quality statement, a later drink question and a new arrival greeting for three different customers without conflating their purposes.",
  explanation:"The original 这个苹果很好吃。 (Zhège píngguǒ hěn hǎochī.) describes an apple, 你喜欢喝茶吗？ (Nǐ xǐhuan hē chá ma?) asks about tea, and 你好 (nǐ hǎo) greets an arrival. They were attested separately, not as a recorded market conversation.",
  transferSituation:"The vendor first answers a returning fruit buyer, later asks an already-present second customer about tea, then welcomes a third guest entering the stall.",
  writingInstruction:"Author a vendor dialogue with three separately identifiable shoppers, where a fruit description, tea question and arrival greeting go to different listeners.",
  reflection:"Why is it wrong to treat every utterance as a greeting or to move the original tea question onto the customer who only asked about an apple?",
  writingChecks:["Answer the apple customer's original taste request with a statement.","Use the question marker 吗 for the distinct customer asked about tea.","Reserve the source greeting for the genuinely new third arrival."],
  chineseNegotiation:negotiation(
   {context:"At the fruit counter, an established shopper specifically asks how this displayed apple tastes, not whether the vendor enjoys a drink.",
    question:"Which attested complete statement tells this returning buyer about the apple's taste?",
    correctQuote:"这个苹果很好吃。",wrongQuote:"你喜欢喝茶吗？",
    feedback:"The tea source asks a preference with final 吗, whereas the buyer asks for a declarative description of the apple. Use 这个苹果很好吃。."},
   {context:"The returning buyer departs and another customer already at the counter is asked whether they enjoy drinking tea. This is a new question, not another report about fruit.",
    question:"Which exact original expression asks this second customer a yes-or-no tea-preference question?",
    correctQuote:"你喜欢喝茶吗？",wrongQuote:"这个苹果很好吃。",
    feedback:"The earlier correct apple description does not ask about a drink. The new listener needs the original tea-preference question ending with 吗？."},
   {context:"After both purchases, a third person comes through the door and has not yet been addressed. The vendor should open contact rather than continue discussing food and drink.",
    question:"Which original source phrase greets the newly arriving third customer?",
    correctQuote:"你好",wrongQuotes:["这个苹果很好吃。","你喜欢喝茶吗？"],
    feedback:[
      "The apple-quality sentence has no greeting function. The third shopper has just arrived and requires the original 你好.",
      "The tea-preference question is premature before this newly arriving customer has been greeted. Use 你好 to open contact."
    ]},
   {instruction:"Sequence original expressions for a fifth separately authored stall interaction: first describe an apple for an existing buyer, then ask a second shopper about tea, and finally greet a third newcomer. Earlier orders represent different arrival schedules.",
    expected:["这个苹果很好吃。","你喜欢喝茶吗？","你好"],
    previousFeedback:[
      "The original one-customer scenario began with a greeting, but this scene already has customers present before any new arrival.",
      "The returning-buyer scenario greeted the newcomer before asking about tea. Here the tea question comes first and the later arrival is greeted last.",
      "The tea-first scenario asked about a drink before mentioning fruit. This buyer asks about the apple before the vendor turns to the second customer's tea.",
      "The fourth scene opened with a greeting. In this case the first two customers have already arrived, so greeting comes last."
    ]},
   {instruction:"Write a ninth independent three-customer market script where an existing buyer receives an apple report, another shopper gets the tea question and a third new arrival receives 你好. Revise the sequence when the third arrival appears earlier, without treating your new Chinese turns as original-source dialogue.",
    criteria:[
      "Identify the three customers separately and make every vendor statement belong to the correct listener.",
      "Preserve the question marker 吗 and the exact apple statement while changing only independently authored surrounding turns.",
      "Review the first and second drafts for actual context changes, labeling exact original source Hanzi separately from new dialogue."
    ]}
  )
 },
 {
  ...previous[2]!,
  id:"zh:phase32-school-three-person-repair",
  title:"Student, clerk and teacher resolve an identity mistake",
  objective:"Differentiate positive student identification, explicit denial of a mistaken teacher assignment and the later third-person identification of the actual teacher.",
  explanation:"Original 我是学生。 (Wǒ shì xuésheng.) identifies the speaker as student, 不是 (bú shì) denies a false role and 他是老师。 (Tā shì lǎoshī.) points to another teacher. The authored multi-person exchange is not recorded in the source.",
  transferSituation:"A student first registers with a receptionist, who mistakenly assigns the student the teacher's badge. The student denies the incorrect identity and eventually directs the receptionist to the actual teacher.",
  writingInstruction:"Compose a new registration conversation where the student gives a true self-identity, interrupts to deny a mistaken badge role, then identifies the teacher in a separate sentence.",
  reflection:"Why is a positive statement not identical to a negative correction, and why must the teacher's identification use a different subject?",
  writingChecks:["Use 我 to identify only the person currently registering as student.","Link 不是 to a stated, genuine false teacher assumption.","Use 他是老师。 to describe the other person rather than the speaking student."],
  chineseNegotiation:negotiation(
   {context:"A student is meeting the clerk for the first time and explicitly gives a positive self-identification as a student before any wrong identity has been asserted.",
    question:"Which original complete sentence correctly states that the person speaking is a student?",
    correctQuote:"我是学生。",wrongQuote:"不是",
    feedback:"不是 is a negation that needs a previous false identity to reject. The first request is for the positive original student statement 我是学生。."},
   {context:"The clerk then incorrectly prints the student's badge as teacher. The same student immediately rejects that mistaken title before clarifying whose role is teacher.",
    question:"Which original form now explicitly denies this newly mistaken teacher identity?",
    correctQuote:"不是",wrongQuote:"我是学生。",
    feedback:"The earlier positive student identity can clarify the situation but does not itself express negation. To explicitly reject the false title use 不是."},
   {context:"After the clerk corrects the student's badge, the real teacher walks in. The clerk now needs a full original sentence identifying this other person rather than the student speaking or denying a role.",
    question:"Which exact original sentence identifies the third person as the teacher?",
    correctQuote:"他是老师。",wrongQuotes:["我是学生。","不是"],
    feedback:[
      "我是学生。 describes the person speaking as a student, not another person who is teacher. Use 他是老师。.",
      "不是 only denies a claim and does not identify the real teacher. The original teacher statement has third-person 他."
    ]},
   {instruction:"Reorder the three original source expressions for a fifth new registration practice: the student first identifies themself, then denies a badge role mistake, and finally identifies the actual teacher. This differs from all four earlier orientation/correction examples.",
    expected:["我是学生。","不是","他是老师。"],
    previousFeedback:[
      "The earliest student-first sequence identified the teacher before the denial. This specific badge correction occurs before pointing out the actual teacher.",
      "The prior visitor-first sequence introduced the teacher before a correction. Here the student registers themself first.",
      "The earlier denial-first situation began before the student introduced themself. This student has already provided a true identity before the error.",
      "The fourth practice identified the teacher before the student. The actual teacher arrives only after the badge mistake here."
    ]},
   {instruction:"Write a ninth independent school registration dialogue: a student states their role, the clerk mistakenly assigns a teacher badge, the student denies it, and the real teacher arrives. Revise when the teacher arrives before the badge mistake, keeping the original quotations exact.",
    criteria:[
      "Show why the student's first positive identification and later denial answer two different questions.",
      "Keep the third-person actual teacher distinct from the clerk and the student in every source-backed phrase.",
      "Compare the first and revised authored scenes and avoid presenting newly composed Chinese replies as a native source recording."
    ]}
  )
 },
 {
  ...previous[3]!,
  id:"zh:phase32-badge-office-three-way-repair",
  title:"A badge, a colleague and a false job title",
  objective:"Separate a colleague's shared role, a later denial of an incorrect job title and a final badge ownership claim by the actual speaker.",
  explanation:"The authentic original source has 也是 (yě shì) for an identity also applying, 不是 (bú shì) for denial and 我的 (wǒ de) for first-person possession. The reception narrative is newly composed and no original dialogue is asserted.",
  transferSituation:"The clerk first confirms a colleague shares the role, a new worker then rejects an incorrectly printed title, and the actual badge owner finally claims their badge independently of job classification.",
  writingInstruction:"Compose an office dialogue that starts with a true shared role, then denies a different false title, then lets a third person claim an item using a first-person possessive.",
  reflection:"Why cannot a source expression for shared identity take the place of a negation or a possessive claim when another speaker enters?",
  writingChecks:["Use 也是 only when the additional colleague actually has the matching identity.","Use 不是 only for a demonstrably false job title.","Tie 我的 to the person who currently owns and claims the badge."],
  chineseNegotiation:negotiation(
   {context:"The receptionist confirms a second staff member holds the same real job as the first worker. This is an additional true identity, not a contradiction.",
    question:"Which original source expression means that the colleague also has the matching role?",
    correctQuote:"也是",wrongQuote:"不是",
    feedback:"不是 would deny the shared job identity. This clerk is affirming the additional true role, so the attested source item is 也是."},
   {context:"A third employee interrupts after noticing a false job title on another person's form. The employee explicitly rejects that title instead of adding another true role.",
    question:"Which source-backed expression now denies the incorrect professional identity?",
    correctQuote:"不是",wrongQuote:"也是",
    feedback:"The first speaker's 也是 adds an identity, but the new speaker needs to deny a falsely printed job title. The original negation form is 不是."},
   {context:"With the role mistakes settled, an unrelated guest now identifies their own personal badge. The clerk asks about possession, not the employee's role or another matching profession.",
    question:"Which original Chinese form marks the badge as belonging to the person speaking?",
    correctQuote:"我的",wrongQuotes:["也是","不是"],
    feedback:[
      "也是 indicates that a professional identity also applies to another person, not that the guest owns the badge. Possession is 我的.",
      "不是 rejects a job identity and cannot indicate ownership of an object. The correct first-person possessive form is 我的."
    ]},
   {instruction:"Arrange authentic source excerpts for a fifth new reception case: first affirm a new colleague shares the role, then deny a different incorrect job title, and finally let an unrelated visitor claim their personal badge. The fourth earlier scenario order does not fit.",
    expected:["也是","不是","我的"],
    previousFeedback:[
      "The earlier badge-first case opened with possession before any role discussion, whereas this situation settles the professional roles first.",
      "The second colleague-first case proceeded directly to a badge claim, but this scenario has a false job title that must first be denied.",
      "The third denial-first case began with an incorrect title. In this case the clerk confirms a true shared identity before the later error.",
      "The fourth case began with personal badge ownership, while this version finishes the role discussion before the guest claims a badge."
    ]},
   {instruction:"Write a ninth independent three-person reception conversation: a clerk confirms a shared job, another employee disputes a false title and an unrelated guest claims their badge. Revise the scene with the badge owner arriving earlier, keeping the source phrases exact and the authored dialogue distinct.",
    criteria:[
      "Identify which two people genuinely share a professional identity before any later denial.",
      "Separate the employee's rejection of a false title from the unrelated guest's first-person badge ownership.",
      "Use first-draft comparison to check the revised speaker order and never claim newly invented conversational sentences were attested."
    ]}
  )
 }
] as const;
