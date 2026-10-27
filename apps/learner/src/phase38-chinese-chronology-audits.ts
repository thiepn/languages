import type {ChineseChronologyAuditV1,SourceAuthoredIntake} from "./source-intake.ts";
import {PHASE37_CHINESE_CONTESTED_CLAIMS} from "./phase37-chinese-contested-claims.ts";

/** Original snippets remain unchanged, individually source-attested DEMO_ONLY examples.
 * Speaker roles, witness timestamps and written conversations are new editorial practice. */
const prior=PHASE37_CHINESE_CONTESTED_CLAIMS;
const source=(i:number,quote:string)=>{
  const found=prior[i]!.encounters.find(item=>item.quote===quote);
  if(!found)throw new Error("No original source custody for Phase 38 excerpt: "+quote);
  return found.sourceId;
};
const audit=(
 opening:ChineseChronologyAuditV1["opening"],
 newEvidence:ChineseChronologyAuditV1["newEvidence"],
 order:ChineseChronologyAuditV1["chronology"],
 hanzi:ChineseChronologyAuditV1["hanzi"],
 pinyin:ChineseChronologyAuditV1["pinyin"],
 dialogue:ChineseChronologyAuditV1["dialogue"]
):ChineseChronologyAuditV1=>({opening,newEvidence,chronology:order,hanzi,pinyin,dialogue});

export const PHASE38_CHINESE_CHRONOLOGY_AUDITS:readonly SourceAuthoredIntake[]=[
 {
  ...prior[0]!,
  id:"zh:phase38-seminar-witness-timeline",
  title:"Rebuild a meeting from three witness timestamps",
  objective:"Distinguish the first independent witness, later speaker-inclusive committee record and final address to visitors from competing incorrect chronologies.",
  explanation:"The independently attested original source expressions 我 (wǒ), 我们 (wǒmen) and 你们 (nǐmen) express individual speaker, speaker-inclusive group and plural addressees. These new records do not claim original transcript status.",
  transferSituation:"An independent student speaks first, the full committee later issues its own position, and only after that does a new host turn to the visiting audience. Two note-takers disagree about whether the committee report occurred before the witness.",
  writingInstruction:"Write a distinctly new four-person meeting conversation that follows independent witness, committee statement and host's visitor address, then revise it after one witness timestamp is disputed.",
  reflection:"Why can all three original excerpts be valid while an apparently plausible sequence is still wrong for this specific meeting chronology?",
  writingChecks:["Track who speaks individually before the committee convenes.","Distinguish the later speaker-inclusive team from a final address to plural visitors.","Keep the original source readings separate from newly authored meeting testimony."],
  chineseChronologyAudit:audit(
   {context:"At the start of a newly reconstructed seminar, one student volunteers a strictly personal observation. The committee has not yet spoken and the host has not turned to the guests. An archivist asks which original source expression identifies only that first individual speaker.",
    question:"Which original attested Hanzi item fits the sole first witness, rather than a later committee position or the still-unaddressed visitors?",
    correctQuote:"我",wrongQuotes:["我们","你们"],
    feedback:[
      "我们 includes other committee members, but the only initial witness explicitly speaks for one person before the committee session. The original singular is 我.",
      "你们 addresses multiple listeners; the host has not addressed the outside visitors yet. This opening testimony uses first-person singular 我."
    ]},
   {context:"A second signed timestamp shows that the moderator and all members of the home committee issued the next statement together. The speaker belongs to the committee, not the visiting group, and the first individual's separate testimony has finished.",
    question:"With this newly authenticated committee timestamp, which original source expression correctly includes the moderator among the reporting team?",
    correctQuote:"我们",wrongQuotes:["我","你们"],
    feedback:[
      "我 was appropriate for the single earlier witness, not for the collective committee report now confirmed by the second timestamp. Use original 我们.",
      "你们 addresses a different set of listeners; the source event is the moderator's own committee speaking as a group. The original form is 我们."
    ]},
   {instruction:"Order only the three unchanged original Hanzi expressions by this NEW recorded sequence: single independent witness first, moderator's inclusive committee second, host's direct address to visiting listeners last. Every alternative order corresponds to a different schedule, not this report.",
    expected:["我","我们","你们"],
    wrongFeedback:[
      "That sequence addresses the plural visitors before documenting the moderator's committee statement. The host speaks to guests only after the committee report.",
      "That sequence puts the committee's own report first, but the independent witness's earlier timestamp shows a sole speaker went first.",
      "That sequence puts a visitor address before the individual witness, while the witness was recorded before any host invitation.",
      "That sequence addresses visiting listeners before the independently signed witness and the committee statement, although the host's audience invitation was the last event.",
      "That sequence addresses visitors first and leaves the individual witness until last, although the witness actually spoke before both committee and host."
    ]},
   {instruction:"Reconstruct the exact attested Hanzi for the final host addressing the visiting students as plural listeners, keeping the original expression unchanged rather than adding invented words.",
    quote:"你们",sourceId:source(0,"你们"),wrongQuotes:["我","我们"],
    feedback:[
      "我 denotes the single earlier witness, not the final group of visitors addressed by the host. The full original plural address is 你们.",
      "我们 includes the speaker's own committee, but this final host turn addresses external visitors. The original listener expression is 你们."
    ]},
   {instruction:"Type the original source's exact tone-marked written Pinyin for the FIRST singular witness's Hanzi 我, without recording or grading pronunciation.",
    quote:"我",sourceId:source(0,"我"),reading:"wǒ",sourceMisreading:"wǒmen",
    sourceFeedback:"wǒmen belongs to original 我们 for the later group report, while the independently speaking first witness uses wǒ.",
    unmarkedFeedback:"wo drops the attested third-tone mark, whereas the original written Pinyin for 我 is wǒ."
   },
   {instruction:"Write a sixteenth original meeting dialogue among a lone witness, committee moderator, visiting audience and host in the verified order. Revise it twice after a disputed timestamp is corrected; compare the original, intermediate and latest versions and keep the source snippets clearly distinguished from newly authored lines.",
    criteria:[
      "Name which character speaks independently first, who later represents the home committee, and who finally addresses visiting students.",
      "Preserve original 我, 我们, 你们 and their attested written readings as source excerpts only, never as fabricated authentic full exchanges.",
      "Explain why alternative orders that were correct in other situations are invalid for these particular timestamps, and compare the independently revised dialogues."
    ]}
  )
 },
 {
  ...prior[1]!,
  id:"zh:phase38-market-arrival-chronology",
  title:"Resolve a stall's greeting, tea and apple schedule",
  objective:"Identify the first newly arriving buyer, the later tea preference question and the last fruit description from contradictory customer notes.",
  explanation:"The original 你好 (nǐ hǎo) is a greeting, 你喜欢喝茶吗？ (Nǐ xǐhuan hē chá ma?) asks about tea, and 这个苹果很好吃。 (Zhège píngguǒ hěn hǎochī.) describes an apple; the combined market exchange is newly authored.",
  transferSituation:"A first visitor arrives and is greeted, later asks the vendor about a companion's tea preference, then the vendor finally reports how an apple tastes. A second customer incorrectly claims the apple conversation happened before the tea question.",
  writingInstruction:"Compose three distinct market interactions for an arriving customer, their already-present companion and an apple vendor, indicating which request happens when.",
  reflection:"How can an authentic apple statement or tea question be linguistically valid but still be wrongly placed in this newly verified chronology?",
  writingChecks:["Begin with the greeting for the first newly arriving customer.","Only ask the original tea question once the companion becomes the actual listener.","Reserve the original apple description for the vendor's last response after both earlier events."],
  chineseChronologyAudit:audit(
   {context:"A customer with no earlier contact enters the stall. The vendor begins a new conversation. The later tea and apple requests have not been made, despite a conflicting customer note that places the tea exchange at opening time.",
    question:"Which exact source item is appropriate for the vendor's first greeting to someone who has only just arrived?",
    correctQuote:"你好",wrongQuotes:["你喜欢喝茶吗？","这个苹果很好吃。"],
    feedback:[
      "你喜欢喝茶吗？ presupposes a later beverage preference question. The arrival has just occurred; source 你好 is the correct greeting.",
      "这个苹果很好吃。 describes a fruit rather than welcoming the newly arriving customer. The attested greeting is 你好."
    ]},
   {context:"Only after that greeting, the shopper brings an already-present companion and asks the vendor to inquire whether the companion likes tea. The fruit quality question is deferred until later.",
    question:"Which complete original Chinese question now asks the actual companion about tea, instead of greeting them again or describing an apple?",
    correctQuote:"你喜欢喝茶吗？",wrongQuotes:["你好","这个苹果很好吃。"],
    feedback:[
      "你好 was correct at the earlier arrival, but the companion is now present and needs a direct tea-preference question ending in 吗？.",
      "这个苹果很好吃。 reports fruit quality. The verified middle action asks whether the companion likes drinking tea, using 你喜欢喝茶吗？."
    ]},
   {instruction:"Rebuild only the authenticated Hanzi excerpts in the observed order: greet the genuinely arriving first buyer, ask the companion's tea preference later, and make the apple-quality statement last. The other five permutations contradict the newly witnessed arrival schedule.",
    expected:["你好","你喜欢喝茶吗？","这个苹果很好吃。"],
    wrongFeedback:[
      "This schedule greets the buyer correctly but describes the apple before asking about tea, contrary to the companion's confirmed middle request.",
      "This schedule asks the companion about tea before the buyer is greeted, although the newly arriving buyer first receives original 你好.",
      "This schedule puts tea first, describes the apple second and delays the greeting until the end, contradicting the newcomer's actual first arrival.",
      "This schedule begins by describing fruit and postpones the greeting, contrary to the first new customer's documented arrival.",
      "This schedule puts the apple description first and the greeting last, while the witnessed sequence began with greeting and ended with fruit."
    ]},
   {instruction:"Reconstruct the exact original attested Hanzi statement describing the apple's taste at the END of this market dialogue, including final punctuation.",
    quote:"这个苹果很好吃。",sourceId:source(1,"这个苹果很好吃。"),
    wrongQuotes:["你好","你喜欢喝茶吗？"],
    feedback:[
      "你好 only greets the newcomer. The last source statement must describe the apple's taste and reads 这个苹果很好吃。.",
      "你喜欢喝茶吗？ is the already completed tea-preference question and cannot answer the final apple quality request."
    ]},
   {instruction:"Type the original source's tone-marked written Pinyin for the newly arriving customer's simple greeting 你好; keep both attested third-tone marks.",
    quote:"你好",sourceId:source(1,"你好"),reading:"nǐ hǎo",sourceMisreading:"Nǐ xǐhuan hē chá ma?",
    sourceFeedback:"Nǐ xǐhuan hē chá ma? is the separate original tea question, not the initial greeting. Source 你好 is written nǐ hǎo.",
    unmarkedFeedback:"ni hao removes the two original third-tone marks. The exact source-written Pinyin is nǐ hǎo."
   },
   {instruction:"Write a sixteenth independent vendor interaction: greet a newly arriving customer, ask the already-present companion about tea, then describe the fruit. Revise twice when the buyer disputes the chronology; keep the signed arrival, tea-question and apple-description order verifiable and each source quote unchanged.",
    criteria:[
      "Clearly differentiate first arrival, subsequent tea preference and last apple-quality description using independently authored customer roles.",
      "Keep exact original 你好, 你喜欢喝茶吗？ and 这个苹果很好吃。 with their distinct original punctuation and Pinyin.",
      "Compare the first, intermediate and latest dialogues against the new event chronology rather than presenting an invented recorded conversation as authentic source material."
    ]}
  )
 },
 {
  ...prior[2]!,
  id:"zh:phase38-school-clerk-timestamp-audit",
  title:"Reconstruct a student's identity audit in order",
  objective:"Separate a student's affirmative status, the identification of a real teacher and a late correction of a false register entry by reconstructing verified event order.",
  explanation:"The authentic fragments 我是学生。 (Wǒ shì xuésheng.), 他是老师。 (Tā shì lǎoshī.) and 不是 (bú shì) were originally attested separately. Student and teacher timelines here are new practice, not original transcripts.",
  transferSituation:"The student positively introduces themself at the desk before the teacher arrives, then identifies the real teacher, and only afterward finds a wrongly assigned teacher title on a second registrar's form and explicitly denies it.",
  writingInstruction:"Author a front-desk exchange with a student, a late genuine teacher and two clerks where the wrong teacher designation is discovered after both true identities were stated.",
  reflection:"Why does the time at which the false entry is discovered determine whether the short negation occurs first or last in this exercise?",
  writingChecks:["The student introduces actual student identity before another person arrives.","Use third person only for the genuinely separate teacher.","Reject the false form entry with the short original denial only after the incorrect record is discovered."],
  chineseChronologyAudit:audit(
   {context:"A student arrives alone and proactively states the student's real identity before a teacher or second clerk appears. One later account mistakes this introduction for a denial of a false title that has not yet been recorded.",
    question:"What complete original first-person statement identifies the speaking student positively at the earliest event, not a later denial or another person's profession?",
    correctQuote:"我是学生。",wrongQuotes:["不是","他是老师。"],
    feedback:[
      "不是 would reject a false title, but no such title has been assigned yet at the first event. The source's positive self-identification is 我是学生。.",
      "他是老师。 identifies a separate teacher in third person, whereas the first event is the student introducing themself. Use original 我是学生。."
    ]},
   {context:"A genuine teacher then arrives, and the student points to this different person. The registrar asks which source sentence identifies that separate person as teacher before the false form entry is discovered.",
    question:"Which original third-person sentence positively identifies the teacher who arrived after the student, rather than restating the student's own role?",
    correctQuote:"他是老师。",wrongQuotes:["我是学生。","不是"],
    feedback:[
      "我是学生。 was the correct student's earlier self-introduction, but the new arriving person is a distinct true teacher. The source third-person sentence is 他是老师。.",
      "不是 rejects a false role; the newly arrived person is genuinely a teacher. The source affirmative statement 他是老师。 fits."
    ]},
   {instruction:"Arrange the exact three original Hanzi expressions by the documented new school schedule: the student positively identifies themself, then points out a different genuine teacher, then finally denies a false teacher designation in a second clerk's record.",
    expected:["我是学生。","他是老师。","不是"],
    wrongFeedback:[
      "This ordering introduces the student first but denies the false teacher label before the genuine teacher arrives; the error was discovered only after the teacher identification.",
      "This ordering begins with the teacher before the student, while the student's own first-person introduction was the documented first event.",
      "This ordering identifies the teacher before the student. The student's own arrival and affirmative status were documented first.",
      "This ordering begins with the role denial before student and teacher identify themselves, though the false register entry is only discovered at the end.",
      "This ordering begins with a denial before the real teacher and postpones the student identity, though the student spoke first."
    ]},
   {instruction:"At the last event a different registrar finds a teacher badge assigned to the student. Reconstruct the exact short original Hanzi negation the student uses to deny that newly identified false role.",
    quote:"不是",sourceId:source(2,"不是"),wrongQuotes:["我是学生。","他是老师。"],
    feedback:[
      "我是学生。 already supplied the actual identity before the error was found; the current question asks for an explicit denial of a false teacher role: 不是.",
      "他是老师。 identifies the genuine separate teacher. It cannot deny the false label applied to the student at the second desk; source 不是 can."
    ]},
   {instruction:"Type the exact source-authenticated tone-marked written Pinyin of the student first-person sentence 我是学生。, retaining the terminal period.",
    quote:"我是学生。",sourceId:source(2,"我是学生。"),reading:"Wǒ shì xuésheng.",sourceMisreading:"Tā shì lǎoshī.",
    sourceFeedback:"Tā shì lǎoshī. identifies the genuine teacher, not the student speaker. The exact original written reading for 我是学生。 is Wǒ shì xuésheng..",
    unmarkedFeedback:"Wo shi xuesheng. omits authentic tone marks. Restore the source's first-person written reading Wǒ shì xuésheng.."
   },
   {instruction:"Write a sixteenth independently authored school registration dialogue: a student identifies themself first, the real teacher then arrives and is identified, and a different registrar finally assigns a false teacher role that the student denies. Revise twice after staff discover a misdated register entry; preserve authentic pronouns and original quote punctuation.",
    criteria:[
      "Mark the distinct positive student introduction, true teacher arrival and late erroneous teacher designation in their evidenced order.",
      "Use the complete original 我是学生。, 他是老师。 and the short denial 不是 correctly with their verified source Pinyin.",
      "Compare the first, intermediate and final learner-authored drafts after the disputed registration date is corrected, without portraying invented dialogue as a source transcript."
    ]}
  )
 },
 {
  ...prior[3]!,
  id:"zh:phase38-badge-reception-chronology",
  title:"Order badge possession, shared work and false title",
  objective:"Distinguish an owner's positive item claim, a second employee's true shared job and a late visitor's explicit rejection of a wrongly assigned title.",
  explanation:"Original 我的 (wǒ de) means belonging to the speaker, 也是 (yě shì) adds a true matching identity and 不是 (bú shì) denies a false role. These are separately source-attested words, not recorded conversations.",
  transferSituation:"The badge's true owner first identifies an item while a colleague temporarily holds it; the coworker next truthfully confirms a matching job. Only at the end does a new visitor reject an inaccurate employee label in a separate conversation.",
  writingInstruction:"Independently script badge owner, true coworker, clerk and misidentified visitor in their verified arrival order.",
  reflection:"Why would an otherwise appropriate negation be chronologically wrong if written before the late visitor actually received an inaccurate role?",
  writingChecks:["Keep actual badge owner distinct from temporary holder at the first event.","Only affirm an additional true role after the two employees' jobs are verified.","Reject a new visitor's false title last, when the mistake actually happens."],
  chineseChronologyAudit:audit(
   {context:"The first reception event is a true badge owner identifying a badge temporarily held by a different coworker. No visitor has been mistakenly called an employee yet, and the coworker's job is not the subject of this first question.",
    question:"Which attested original Hanzi fragment makes the first speaker's ownership claim, as distinct from professional role agreement or an error denial?",
    correctQuote:"我的",wrongQuotes:["也是","不是"],
    feedback:[
      "也是 adds another genuine matching job, but the first event concerns whose item the badge actually is. The original possessive is 我的.",
      "不是 denies an incorrectly attributed role that does not occur until the last visitor. The first owner states possession with 我的."
    ]},
   {context:"The desk verifies that the second worker genuinely holds the same profession as the first. The owner has already reclaimed the badge, so no one is asking about whose item it is or an unrelated visitor's later false role.",
    question:"Which authentic source fragment confirms that a second worker ALSO truly has the shared professional role at this middle event?",
    correctQuote:"也是",wrongQuotes:["我的","不是"],
    feedback:[
      "我的 was the first owner's correct badge claim; the second event verifies an additional matching job, so the original additive source is 也是.",
      "不是 denies a false role, whereas the two coworkers genuinely share this professional identity. The original answer is 也是."
    ]},
   {instruction:"Place the three authentic source Hanzi items in the newly verified order: owner claims the badge, a real colleague shares the profession, and a separate later visitor rejects an incorrect job title. The other five permutations incorrectly move a distinct event.",
    expected:["我的","也是","不是"],
    wrongFeedback:[
      "This sequence places the new visitor's false-role denial between the badge claim and true shared-job confirmation, but the visitor arrives only after the two workers finish.",
      "This sequence begins with the coworker's job confirmation before the badge owner's documented initial claim.",
      "This sequence begins with the colleague's profession and then the late visitor, leaving the owner's original badge claim until the end.",
      "This sequence begins by denying the late visitor's job before the badge owner has even spoken; the visitor was not present at the start.",
      "This sequence begins with the late visitor's denial and then the coworker's role agreement, reversing all the first events' witnessed order."
    ]},
   {instruction:"A late visiting guest now discovers a falsely issued employee badge and rejects the wrong professional title. Type the exact original short Hanzi negation, not a statement about the badge's owner or matching coworkers.",
    quote:"不是",sourceId:source(3,"不是"),wrongQuotes:["我的","也是"],
    feedback:[
      "我的 refers to an item belonging to the present speaker. The late visitor must reject a false job title, using attested 不是.",
      "也是 confirms an actual matching professional role, but the late guest denies an incorrectly assigned title. The original negation is 不是."
    ]},
   {instruction:"Type the exact source-written tone-marked Pinyin of the first badge owner's possessive expression 我的, distinguishing it from a true shared role or the late guest's denial.",
    quote:"我的",sourceId:source(3,"我的"),reading:"wǒ de",sourceMisreading:"bú shì",
    sourceFeedback:"bú shì is the separately attested reading of 不是, a false-title denial, while the source-written possession fragment 我的 is wǒ de.",
    unmarkedFeedback:"wo de loses the third-tone source mark for the pronoun. The attested written Pinyin of 我的 is wǒ de."
   },
   {instruction:"Write a sixteenth independently authored reception conversation in the verified arrival order: an owner claims a badge, a second worker confirms a true shared profession and a late visitor rejects a false job title. Revise it twice after receiving a corrected entry log while protecting both distinct unsent drafts when switching between submitted versions.",
    criteria:[
      "Distinguish current badge custody from real ownership at the first event and the coworker's actual shared work role in the middle.",
      "Keep original 我的, 也是 and 不是 aligned with their authentic source meaning and the independently documented arrival times.",
      "Compare first, intermediate and latest dialogue submissions and both independently drafted unsent alternatives without storing them in checkpoints or claiming the invented conversation is a source transcript."
    ]}
  )
 }
] as const;
