import type {ChineseEvidenceSwitchV1,SourceAuthoredIntake} from "./source-intake.ts";
import {PHASE34_CHINESE_FINAL_ORDERS} from "./phase34-chinese-final-orders.ts";

/** Phase 35 adds independent authorship and meaning-first, conditional evidence checks.
 * Attested source excerpts remain exactly the original DEMO_ONLY Hanzi/Pinyin. */
const previous=PHASE34_CHINESE_FINAL_ORDERS;
const evidence=(first:ChineseEvidenceSwitchV1["first"],reconsider:ChineseEvidenceSwitchV1["reconsider"],
 remaining:ChineseEvidenceSwitchV1["remaining"],dialogue:ChineseEvidenceSwitchV1["dialogue"]):ChineseEvidenceSwitchV1=>
 ({first,reconsider,remaining,dialogue});
const originalSource=(index:number,quote:string):string=>{
 const entry=previous[index]!.encounters.find(e=>e.quote===quote);
 if(!entry)throw new Error("Missing original Chinese source custody: "+quote);
 return entry.sourceId;
};

export const PHASE35_CHINESE_EVIDENCE_SWITCHES:readonly SourceAuthoredIntake[]=[
 {
  ...previous[0]!,
  id:"zh:phase35-visitor-response-custody",
  title:"Visitors challenge who may speak for a team",
  objective:"Evaluate a meeting delegate's original source expression against two rival speaker interpretations, then repair the reply after the speaker and listener genuinely change.",
  explanation:"Original 我们 (wǒmen) includes a speaking group, 你们 (nǐmen) addresses plural listeners, and 我 (wǒ) names one speaker. This meeting scenario is independently authored and no complete conversation is present in the original source.",
  transferSituation:"A visiting delegate disputes a report: the original moderator speaks for the home team, but a new host changes the request to addressing the outside visitors before another student volunteers an individual statement.",
  writingInstruction:"Create a distinct meeting conversation with a visitor who changes the floor and explicitly distinguishes who is included when a person speaks for a team.",
  reflection:"Why does the word for the speaker's own team become incorrect when the speaker instead turns outward to multiple visitors?",
  writingChecks:["First identify the moderator who belongs to the team making the decision.","Track the new host addressing plural outside visitors without claiming their identity.","Reserve the remaining singular form for the volunteer who speaks only for themself."],
  chineseEvidenceSwitch:evidence(
   {context:"The moderator reports a statement agreed by the moderator and the home student committee. A visitor incorrectly writes down that the moderator is addressing the visitors instead. Another listener asks for the original expression that includes the moderator with the committee, not an address to the guests.",
    question:"Which exact attested source excerpt refers to the speaker's own team, in spite of the visitor's mistaken interpretation?",
    correctQuote:"我们",wrongQuotes:["你们","我"],
    feedback:[
      "你们 names the visiting audience as addressees. This report is about the home committee including the current moderator, so the source wording is 我们.",
      "我 refers only to an individual. This visitor asks for a collective committee statement including the moderator, so source 我们 is needed."
    ]},
   {context:"The committee report is complete. The moderator steps aside and a new host explicitly invites the visiting students as an outside group to reply. The host is addressing the guests rather than claiming to be one of the committee members who just spoke.",
    question:"Now that a new host addresses several visitors directly, which original expression fits the changed addressees rather than the former speaker-inclusive team report?",
    correctQuote:"你们",wrongQuotes:["我们","我"],
    feedback:[
      "我们 had correctly described the moderator's own committee, but the new host is now addressing outside students directly. The original plural addressee is 你们.",
      "我 identifies a single person rather than a group of visitors being addressed by the new host. The original second-person plural is 你们."
    ]},
   {instruction:"Type the exact original Hanzi for a final volunteer identifying only the volunteer personally, not the committee's collective voice or an address to several visiting students. Do not invent a full sentence missing from the attested source.",
    quote:"我",sourceId:originalSource(0,"我"),wrongQuotes:["我们","你们"],
    feedback:[
      "我们 includes more than the individual volunteer, while the request now names a single person's own view. The original attested single-speaker excerpt is 我.",
      "你们 refers to multiple people being addressed, not the volunteer as the person now speaking. Use exact original 我."
    ]},
   {instruction:"Write a thirteenth original four-person meeting dialogue in which the moderator reports the committee's own position, a separate host requests the visitors' response, and an individual volunteer gives a personal view. Revise the exchange after moving the volunteer onto the committee and specify precisely which source referent changes.",
    criteria:[
      "Distinguish the actual speaking committee member, the separate host addressing visitors and the volunteer with an independent first-person perspective.",
      "Use unchanged original source excerpts 我们, 你们 and 我 only for their correct referents, explicitly identifying learner-authored surrounding conversation.",
      "Compare the initial draft with the revised one after the volunteer's committee membership changes, including which earlier listener assumption no longer holds."
    ]}
  )
 },
 {
  ...previous[1]!,
  id:"zh:phase35-market-switches-requester",
  title:"A returning buyer changes the question",
  objective:"Resolve an initial tea-preference request and a later apple-description request from the same buyer without treating the separately attested sources as interchangeable dialogue.",
  explanation:"Original 你喜欢喝茶吗？ (Nǐ xǐhuan hē chá ma?) is a complete question, 这个苹果很好吃。 (Zhège píngguǒ hěn hǎochī.) describes apple quality, and 你好 (nǐ hǎo) greets a new arrival.",
  transferSituation:"A shopper first asks the vendor to inquire about a companion's tea preference. After receiving the answer, the same shopper points to an apple and requests a taste description. A different newcomer later needs a greeting.",
  writingInstruction:"Compose a real-purpose market dialogue with one returning customer who switches from asking about their companion's tea preference to asking about an apple, followed by a genuine newcomer.",
  reflection:"Why do two requests from the same shopper require different authentic source snippets, even though the surrounding roles remain vendor and customer?",
  writingChecks:["Use the source tea question only when someone actually asks for a beverage preference.","Keep the apple description declarative when the same buyer changes the subject.","Use the greeting only after the separately arriving customer enters."],
  chineseEvidenceSwitch:evidence(
   {context:"At the counter, one buyer asks the vendor to question a nearby companion about the companion's liking for tea. Both people have already been greeted, and the buyer is not asking about a fruit yet.",
    question:"Which original source expression asks the already-present companion about a drink preference rather than making a food statement or greeting someone again?",
    correctQuote:"你喜欢喝茶吗？",wrongQuotes:["这个苹果很好吃。","你好"],
    feedback:[
      "这个苹果很好吃。 makes a claim about an apple. The current request instead asks whether an already-present companion likes tea, so the attested source question is 你喜欢喝茶吗？.",
      "你好 is a greeting for contact, but both people have already arrived. The required original yes-no preference question ends with 吗？."
    ]},
   {context:"The same buyer now changes the subject and points to an apple on the stall, asking the vendor whether it tastes good. The buyer has not brought a new person to greet and no longer seeks any tea preference.",
    question:"Which complete attested source statement now describes the indicated apple rather than asking about the companion's tea preference?",
    correctQuote:"这个苹果很好吃。",wrongQuotes:["你喜欢喝茶吗？","你好"],
    feedback:[
      "你喜欢喝茶吗？ was the correct earlier drink question, but the same buyer now requests a statement of how this apple tastes. The appropriate source expression is 这个苹果很好吃。.",
      "你好 addresses a newcomer, whereas this buyer asks about fruit already in view. The original apple statement fits the newly changed purpose."
    ]},
   {instruction:"A separate third customer now walks through the door and must be greeted before making any request. Type the exact attested original Hanzi greeting, not the earlier tea question or apple description.",
    quote:"你好",sourceId:originalSource(1,"你好"),wrongQuotes:["你喜欢喝茶吗？","这个苹果很好吃。"],
    feedback:[
      "你喜欢喝茶吗？ asks about tea and cannot serve as the immediate greeting to this newly arriving customer. The source greeting is 你好.",
      "这个苹果很好吃。 reports apple quality, not first contact with an arriving customer. Use the two-character original greeting 你好."
    ]},
   {instruction:"Write a thirteenth market conversation in which the same buyer asks first about a companion's tea preference and then about an apple's taste, and a separate customer finally arrives. Revise it when the companion instead asks the apple question, distinguishing source utterances from all surrounding learner-authored lines.",
    criteria:[
      "Make the speaker/requester explicit for the tea question, the apple report and the newly arriving buyer's greeting.",
      "Keep both original 你喜欢喝茶吗？ and 这个苹果很好吃。 intact, including their different question/declarative punctuation.",
      "Compare the first and revised independently authored dialogue after the companion becomes the apple requester and mark exact original snippets separately."
    ]}
  )
 },
 {
  ...previous[2]!,
  id:"zh:phase35-school-rechecks-registrant",
  title:"The registrar changes the role being checked",
  objective:"Distinguish direct rejection of a mistaken teacher label from the student's real affirmative identity after the registrar changes the question.",
  explanation:"Original 不是 (bú shì) denies a false label, 我是学生。 (Wǒ shì xuésheng.) positively identifies the speaking student, and 他是老师。 (Tā shì lǎoshī.) names a different teacher.",
  transferSituation:"A staff member first hands a student the wrong teacher pass, then checks the student's actual registration entry after the student denies the mistake. The student finally points out the real teacher.",
  writingInstruction:"Write an independently authored school front-desk correction in which the staff question changes from a mistaken teacher claim to the actual role of the visitor.",
  reflection:"Why does an authentic denial become insufficient when the registrar changes the task to asking positively who the visitor is?",
  writingChecks:["Use original 不是 when rejecting the explicit false teacher assumption.","Use 我是学生。 only after the real role is requested in first-person.","Describe the actual separate teacher with 他是老师。, not the speaking student."],
  chineseEvidenceSwitch:evidence(
   {context:"A registrar mistakes the visiting student for an instructor and gives out the teacher's access pass. Before anyone requests the student's positive identity, the student must directly reject the registrar's false assignment.",
    question:"Which exact original expression explicitly denies the newly assigned false teacher status rather than stating a positive student identity or describing a separate teacher?",
    correctQuote:"不是",wrongQuotes:["我是学生。","他是老师。"],
    feedback:[
      "我是学生。 positively reports student identity, but the registrar's initial incorrect assignment needs an explicit immediate denial of a false teacher role using 不是.",
      "他是老师。 describes a separate real teacher in the third person, not a refusal of this student's wrongly issued instructor pass. Source 不是 denies the false assignment."
    ]},
   {context:"The registrar accepts the denied teacher status and changes the question: the student is now explicitly asked to enter their own actual role in the attendance record rather than reject another false label.",
    question:"Which attested complete original sentence now positively states the speaking student's correct identity, rather than repeating the prior negation or naming a different teacher?",
    correctQuote:"我是学生。",wrongQuotes:["不是","他是老师。"],
    feedback:[
      "不是 was right when rejecting the incorrect pass. The newly asked affirmative registration question now requires the full original first-person statement 我是学生。.",
      "他是老师。 describes a third person and cannot identify the currently registering student as student; original 我是学生。 matches the updated question."
    ]},
   {instruction:"Another person who actually teaches enters the office, and the same student is asked to point out that different teacher. Reconstruct the complete source-attested third-person Hanzi sentence, retaining the original punctuation exactly.",
    quote:"他是老师。",sourceId:originalSource(2,"他是老师。"),wrongQuotes:["不是","我是学生。"],
    feedback:[
      "不是 is only the original denial of a false teacher role and does not identify this different person positively. The complete teacher statement is 他是老师。.",
      "我是学生。 identifies the student speaker rather than pointing out a separate genuine teacher. The attested third-person statement is 他是老师。."
    ]},
   {instruction:"Author a thirteenth school registration exchange: a student rejects an incorrect teacher pass, supplies the actual student identity when prompted, and points to the real teacher. Revise the conversation after the teacher arrives before the registrar checks the role, preserving which person's pronoun each original statement uses.",
    criteria:[
      "Make the registrar's concrete false teacher-role assumption explicit before rejecting it with the original 不是.",
      "Distinguish the positive speaker identity 我是学生。 from the reference to a different teacher 他是老师。, with correct final punctuation.",
      "Compare initial and revised learner-authored turns after the actual teacher arrives earlier, without treating the reconstructed dialogue as original source content."
    ]}
  )
 },
 {
  ...previous[3]!,
  id:"zh:phase35-badge-changes-owner-claim",
  title:"The desk clerk changes from badge to job",
  objective:"Correct the desk clerk's evidence about badge ownership before switching to a genuinely shared professional title and separately rejecting another person's false title.",
  explanation:"Original 我的 (wǒ de) is first-person possession, 也是 (yě shì) confirms a matching real identity and 不是 (bú shì) rejects a false role. These are independently attested fragments, not a transcribed dialogue.",
  transferSituation:"A guest asserts possession of a badge that a colleague is merely holding, then the clerk changes the question to whether that colleague shares the guest's actual role. A separate visitor later denies a false title.",
  writingInstruction:"Compose a front-desk conversation with an owner, a colleague holding the badge and the clerk; distinguish physical custody of the badge from belonging and actual work status.",
  reflection:"Why does confirming an authentic shared job not answer who owns the badge, even when the colleague has been holding it?",
  writingChecks:["Treat physical badge custody as different from first-person ownership.","Only affirm also having a role when the coworker genuinely shares that position.","Make the third visitor's wrongly attributed role explicit before using negation."],
  chineseEvidenceSwitch:evidence(
   {context:"An employee asks to recover a badge belonging to them, although a coworker has temporarily been holding it. The receptionist incorrectly infers that the coworker's current possession proves ownership. The employee identifies the item as belonging to the person currently speaking.",
    question:"Which exact source fragment makes the speaker's ownership claim despite someone else temporarily holding the badge?",
    correctQuote:"我的",wrongQuotes:["也是","不是"],
    feedback:[
      "也是 says someone additionally shares a professional identity, but it does not identify whose item this is. The original first-person possessive 我的 answers the ownership question.",
      "不是 denies a title or claim but does not itself positively identify a badge as belonging to the current speaker. The original possessive fragment is 我的."
    ]},
   {context:"The badge is returned and the same receptionist now asks whether its former holder really performs the same work as the owner. Both workers have that role; the question is no longer whose badge it is.",
    question:"Which attested original fragment confirms that the colleague also shares the actual role rather than claiming the badge or denying a false job title?",
    correctQuote:"也是",wrongQuotes:["我的","不是"],
    feedback:[
      "我的 was appropriate to assert ownership of the badge, but the new question concerns whether a real colleague also has the same profession. The original additive expression 也是 applies.",
      "不是 would deny a false job title. The clerk has now confirmed that both workers genuinely share the role, so attested 也是 answers the changed question."
    ]},
   {instruction:"At the same desk an unrelated visitor is mistakenly given an employee title and must reject it. Type the exact original short Hanzi denial, not the first-person ownership phrase or a genuine shared-job claim.",
    quote:"不是",sourceId:originalSource(3,"不是"),wrongQuotes:["我的","也是"],
    feedback:[
      "我的 identifies a belonging from the visitor's own perspective, but the clerk must instead be told that the newly assigned title is false. The original denial is 不是.",
      "也是 confirms a genuine shared work identity, while the third visitor is explicitly rejecting a false employee title. Use the source negation 不是."
    ]},
   {instruction:"Write a thirteenth original reception-desk script with a badge owner, a coworker temporarily holding the badge, the clerk and a third visitor denying an incorrectly assigned role. Revise it when the coworker becomes the badge's rightful owner; explain how the referent of the first-person claim changes.",
    criteria:[
      "Distinguish who is merely holding the item from who is currently speaking as its rightful owner, using original 我的 only for the latter.",
      "Use 也是 solely for the genuine shared role and 不是 when the unrelated visitor rejects an explicit false title.",
      "Compare the two independently authored drafts after badge ownership changes, ensuring the role question is still a separate communicative act."
    ]}
  )
 }
] as const;
