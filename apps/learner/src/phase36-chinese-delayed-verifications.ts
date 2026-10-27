import type {ChineseDelayedVerificationV1,SourceAuthoredIntake} from "./source-intake.ts";
import {PHASE35_CHINESE_EVIDENCE_SWITCHES} from "./phase35-chinese-evidence-switches.ts";

/** The original DEMO_ONLY expressions and tone-marked Pinyin are the only source
 * quotations. Scenarios, listeners, reports and participant turns are authored. */
const earlier=PHASE35_CHINESE_EVIDENCE_SWITCHES;
const source=(i:number,quote:string):string=>{
 const item=earlier[i]!.encounters.find(e=>e.quote===quote);
 if(!item)throw new Error("Phase 36 source not among original pinned encounters: "+quote);
 return item.sourceId;
};
const delayed=(
 witness:ChineseDelayedVerificationV1["witness"],
 returnDecision:ChineseDelayedVerificationV1["returnDecision"],
 finalHanzi:ChineseDelayedVerificationV1["finalHanzi"],
 writtenPinyin:ChineseDelayedVerificationV1["writtenPinyin"],
 dialogue:ChineseDelayedVerificationV1["dialogue"]
):ChineseDelayedVerificationV1=>({witness,returnDecision,finalHanzi,writtenPinyin,dialogue});

export const PHASE36_CHINESE_DELAYED_VERIFICATIONS:readonly SourceAuthoredIntake[]=[
 {
  ...earlier[0]!,
  id:"zh:phase36-meeting-three-perspectives",
  title:"A delegate checks the meeting record",
  objective:"Verify three shifting speaker referents from a contested meeting record, then restore the correct original excerpt after independent witness confirmation.",
  explanation:"Original 我们 (wǒmen) includes a speaker's group, 你们 (nǐmen) addresses multiple listeners and 我 (wǒ) names the individual speaker. They were attested separately, not as a full meeting transcript.",
  transferSituation:"The secretary first records a team decision, a new host then addresses the visiting group, and an independent witness insists on stating only a personal observation. A final return to the first committee report tests what really changed.",
  writingInstruction:"Create an independent four-person meeting record with explicit speaker attribution, a third-party challenge and a return to the original committee report.",
  reflection:"Why does a committee report remain correct on return even after the group address and the later individual's statement temporarily required different source words?",
  writingChecks:["Use first-person plural only when the speaking member includes their actual team.","Separate plural listeners addressed by a new host from an individual witness's personal statement.","Show what changes when the same original group decision is reconsidered after the witness speaks."],
  chineseDelayedVerification:delayed(
   {context:"The secretary has recorded the committee's statement and a host's invitation to the visiting audience. A separate witness now corrects the clerk: the witness is reporting only that witness's own view, not the local team's verdict and not an address to several guests.",
    question:"Which single original Hanzi excerpt is right for the third independent witness speaking only for themself, rather than for a team or toward plural guests?",
    correctQuote:"我",wrongQuotes:["我们","你们"],
    feedback:[
      "我们 was correct for the committee member's earlier collective decision, but this independent witness explicitly speaks only for the individual. Original 我 matches the new referent.",
      "你们 was right for the host addressing visiting listeners, not for this witness stating their individual view. The separate original first-person singular is 我."
    ]},
   {context:"After the witness offers that personal observation, the secretary requests the original committee decision once again. The moderator resumes as a member of the same local team and has not begun addressing the visitors.",
    question:"When the moderator returns to the original collective decision, which authentic expression once again includes the current speaker and other committee members?",
    correctQuote:"我们",wrongQuotes:["我","你们"],
    feedback:[
      "我 matched the individual's last statement, but this is again a committee report made by a member of that team. Source 我们 restores the plural speaker-inclusive meaning.",
      "你们 directly addresses several visitors. The secretary asks for the reporting moderator's own team decision, so the authentic expression is 我们."
    ]},
   {instruction:"A different host now directly invites all the visiting students to respond. Type the exact authenticated Hanzi for the second-person plural listeners rather than the speaker's team or the individual witness.",
    quote:"你们",sourceId:source(0,"你们"),wrongQuotes:["我们","我"],
    feedback:[
      "我们 names the current speaker's own group. The new host is addressing an outside audience, so exact source 你们 is required.",
      "我 names a single speaker, not the several guests being addressed. Reconstruct the original two-character listener form 你们."
    ]},
   {instruction:"Write the exact original written tone-marked Pinyin for the third-party individual's authenticated Hanzi 我, not the moderator's group or an address to visitors.",
    quote:"我",sourceId:source(0,"我"),reading:"wǒ",sourceMisreading:"wǒmen",
    sourceFeedback:"wǒmen belongs to the separately attested team-inclusive 我们; the individual first-person source 我 is written wǒ.",
    unmarkedFeedback:"wo omits the source's third-tone mark. Retain the authentic written reading wǒ, without claiming any spoken pronunciation assessment."
   },
   {instruction:"Write a fourteenth new four-person meeting dialogue: a secretary records a team decision, a host addresses visiting students, a witness speaks individually and the moderator repeats the original team report. Revise the exchange after the witness joins the committee, comparing three independently submitted drafts using the original player.",
    criteria:[
      "Identify each current speaker and whether the authentic referent is individual 我, team-inclusive 我们 or outside plural listeners 你们.",
      "Keep the original attested Hanzi and written tone-marked Pinyin separate from the newly authored meeting record and participant turns.",
      "Compare the first submitted dialogue with an intermediate and latest revision after the witness's membership changes, preserving why the final original committee report is still correct."
    ]}
  )
 },
 {
  ...earlier[1]!,
  id:"zh:phase36-market-third-visitor-check",
  title:"The market clerk checks a third visitor",
  objective:"Repair a tea question and apple report after a newly arriving third visitor changes the necessary response; verify the original request independently.",
  explanation:"你好 (nǐ hǎo) greets a real newcomer. The separately attested 你喜欢喝茶吗？ (Nǐ xǐhuan hē chá ma?) asks for a tea preference, while 这个苹果很好吃。 (Zhège píngguǒ hěn hǎochī.) describes apple quality.",
  transferSituation:"A buyer asks a vendor about a companion's tea preference, then changes the request to the taste of an apple. A late-arriving shopper interrupts and must be greeted; after that interruption, the original tea preference request returns.",
  writingInstruction:"Independently write the vendor's three-part customer encounter and explicitly distinguish returning from newly arriving buyers.",
  reflection:"Why can a later greeting and a correct apple statement both be inappropriate when the first buyer returns to asking about the companion's tea preference?",
  writingChecks:["Keep the initial tea preference question and the later apple description as separate speech acts.","Use the greeting only for the newly arrived third visitor.","Return to the original tea question without changing its final question particle and punctuation."],
  chineseDelayedVerification:delayed(
   {context:"The buyer has finished discussing the apple. A third shopper now walks into the stall and has not been addressed previously. The vendor has no basis yet to ask about that shopper's tea preferences or make an unrelated statement about fruit.",
    question:"What exact original Hanzi phrase greets this newly arriving third shopper, rather than querying tea or describing apples?",
    correctQuote:"你好",wrongQuotes:["你喜欢喝茶吗？","这个苹果很好吃。"],
    feedback:[
      "你喜欢喝茶吗？ was appropriate when the first buyer asked about the companion's tea preference, but no such question is now being asked of the newcomer. The original greeting is 你好.",
      "这个苹果很好吃。 described the apple for the earlier buyer; it cannot greet a newly arriving visitor. Source 你好 fits the first-contact purpose."
    ]},
   {context:"After the new visitor has been greeted, the original buyer returns to the vendor and again asks about the same companion's tea preference. Both have long since been greeted, and there is no new apple question.",
    question:"Which complete original attested question must the vendor use when the returning buyer requests the companion's tea preference once again?",
    correctQuote:"你喜欢喝茶吗？",wrongQuotes:["你好","这个苹果很好吃。"],
    feedback:[
      "你好 was right for the third shopper's recent arrival, but the returning customer now requests the companion's drink preference. The original source question 你喜欢喝茶吗？ is needed.",
      "这个苹果很好吃。 makes a fruit-quality statement. The returning buyer asks about drinking tea, so the source question ending with 吗？ fits."
    ]},
   {instruction:"The companion now asks the vendor for an affirmative description of the nearby apple. Reconstruct the complete exact original Hanzi apple statement, preserving the original declarative final punctuation.",
    quote:"这个苹果很好吃。",sourceId:source(1,"这个苹果很好吃。"),
    wrongQuotes:["你好","你喜欢喝茶吗？"],
    feedback:[
      "你好 merely greets a customer. The new request is about the apple's quality, which the full attested source sentence describes.",
      "你喜欢喝茶吗？ asks about tea and ends in a question mark. The requested apple source is a declarative statement: 这个苹果很好吃。."
    ]},
   {instruction:"Type the exact original written tone-marked Pinyin for the source's complete apple-quality statement, not the tea-preference question or new-visitor greeting.",
    quote:"这个苹果很好吃。",sourceId:source(1,"这个苹果很好吃。"),
    reading:"Zhège píngguǒ hěn hǎochī.",sourceMisreading:"Nǐ xǐhuan hē chá ma?",
    sourceFeedback:"Nǐ xǐhuan hē chá ma? is the original written reading for a tea-preference question. The apple statement is Zhège píngguǒ hěn hǎochī..",
    unmarkedFeedback:"Zhege pingguo hen haochi. omits the authenticated original tone marks. Copy the complete source Pinyin Zhège píngguǒ hěn hǎochī., including punctuation."
   },
   {instruction:"Create a fourteenth independent market dialogue: the same buyer first asks about a companion's tea preference, then points to an apple, a third visitor arrives and is greeted, and finally the first buyer returns to tea. In an intermediate revision move the apple request later; in a final revision change which buyer asks it, keeping source questions and original Pinyin separate.",
    criteria:[
      "Mark exactly when the late third visitor arrives, who has already been greeted and when the returning buyer resumes asking about tea.",
      "Preserve the full authentic source tea question 你喜欢喝茶吗？, greeting 你好 and complete apple statement 这个苹果很好吃。 with correct source punctuation.",
      "Compare independently authored initial, intermediate and final dialogues after changing which buyer asks about fruit, rather than presenting any invented conversation as the original source."
    ]}
  )
 },
 {
  ...earlier[2]!,
  id:"zh:phase36-school-witness-registers-role",
  title:"The teacher verifies a corrected school record",
  objective:"Read a student denial, correct a register with affirmative identity, then identify a separate teacher who arrives to verify the record.",
  explanation:"Original 不是 (bú shì) denies a false title, 我是学生。 (Wǒ shì xuésheng.) reports the speaker's student identity, and 他是老师。 (Tā shì lǎoshī.) identifies a different person as a teacher.",
  transferSituation:"A school clerk falsely labels a student as teacher and is corrected. The student provides positive identity; the genuine teacher then enters, creating a new person for third-person reference. The clerk asks the student to restate the original role denial.",
  writingInstruction:"Create a multi-party registration dispute and explain exactly who holds each role when the genuine teacher arrives late.",
  reflection:"Why is a positive third-person teacher statement right for the late visitor but not for identifying the speaking student?",
  writingChecks:["Explicitly deny the false title before entering the real student role.","Use the third-person teacher statement only for a different actual teacher.","On returning to the mistaken register, give an explicit denial rather than misidentifying the third person."],
  chineseDelayedVerification:delayed(
   {context:"After the registrar corrects the student's role, a different person who really teaches approaches the desk. The student points to this newly arrived teacher and the clerk asks which original source statement refers to the third person rather than to the student who is speaking.",
    question:"Which complete attested Hanzi sentence identifies the separately arriving teacher, not the student speaker or the original mistaken badge?",
    correctQuote:"他是老师。",wrongQuotes:["不是","我是学生。"],
    feedback:[
      "不是 was the denial of the student's false teacher assignment. The newly arriving person is actually a teacher and must now be described positively with 他是老师。.",
      "我是学生。 correctly identifies the student speaking, but the clerk asks about a different true teacher. The third-person original sentence is 他是老师。."
    ]},
   {context:"Having identified the genuine teacher, the clerk opens the original mistaken school register again. The student is asked to deny the wrongly recorded teacher title once more before anyone enters the correct role in the form.",
    question:"Which short original expression immediately rejects the incorrect teacher title still printed beside this student's name?",
    correctQuote:"不是",wrongQuotes:["他是老师。","我是学生。"],
    feedback:[
      "他是老师。 now describes the correctly identified teacher who just arrived, not a denial of the wrong title beside the student's own record. Source 不是 is needed.",
      "我是学生。 can supply the true role later, but the clerk explicitly asks for the denial of the incorrect teacher entry. The short source negation is 不是."
    ]},
   {instruction:"The student is then asked to state their actual role positively, after the rejected teacher label. Reproduce the complete exact original first-person student identity sentence, including its terminal punctuation.",
    quote:"我是学生。",sourceId:source(2,"我是学生。"),wrongQuotes:["不是","他是老师。"],
    feedback:[
      "不是 only denies a false label and does not provide the student's affirmative role. The exact source statement is 我是学生。.",
      "他是老师。 describes a different person who actually teaches, not the student speaking to the clerk. Use the attested first-person sentence 我是学生。."
    ]},
   {instruction:"Type the exact original written tone-marked Pinyin for 他是老师。, the complete source statement describing the separately arriving real teacher.",
    quote:"他是老师。",sourceId:source(2,"他是老师。"),
    reading:"Tā shì lǎoshī.",sourceMisreading:"Wǒ shì xuésheng.",
    sourceFeedback:"Wǒ shì xuésheng. belongs to the student's first-person identity. The actual third-person teacher source is Tā shì lǎoshī..",
    unmarkedFeedback:"Ta shi laoshi. removes all authenticated original tone marks. The original source writes Tā shì lǎoshī., with its final period."
   },
   {instruction:"Write a fourteenth independently authored school registration dialogue with a student, original clerk, late real teacher and separate checking clerk. The student denies the false title, identifies the teacher and then supplies their own positive role. Revise once by moving the teacher's arrival earlier, then revise again by letting the checking clerk speak first; preserve exact pronoun reference.",
    criteria:[
      "Clearly distinguish who was falsely labelled a teacher, who actually teaches and who is the student speaker after each arrival.",
      "Keep authentic 不是, 他是老师。 and 我是学生。 separate from any invented longer Chinese conversation and retain punctuation.",
      "Compare the first, intermediate and final independently authored drafts after the teachers' arrival and speaking order changes, without treating them as authenticated original source lines."
    ]}
  )
 },
 {
  ...earlier[3]!,
  id:"zh:phase36-reception-third-party-denial",
  title:"A visitor disputes the reception role record",
  objective:"Separate badge ownership from shared work identity when a late visitor rejects a false role and the badge owner then returns to the original question.",
  explanation:"Original 我的 (wǒ de) marks first-person possession, 也是 (yě shì) confirms a matching true identity and 不是 (bú shì) denies a false professional title. These snippets were separately attested.",
  transferSituation:"The actual owner recovers a badge, the clerk correctly confirms a colleague's matching role and a different visitor then rejects a false work identity; the owner returns to clarify why mere badge custody never proved ownership.",
  writingInstruction:"Compose an independent reception record that distinguishes current speaker ownership from current badge custody, a real colleague's matching role and a third person's false title.",
  reflection:"When the initial badge owner returns after an unrelated visitor's denial, why does the original first-person possessive become correct again?",
  writingChecks:["Do not mistake the colleague holding the badge for the actual owner.","Only confirm a shared role when the second colleague truly holds it.","Return to the first-person possession claim after the third visitor's independent false-role denial."],
  chineseDelayedVerification:delayed(
   {context:"A badge owner has reclaimed an item and the receptionist has verified a different coworker's genuine shared job. A completely unrelated visitor now enters and is mistakenly called an employee. The visitor must deny that job, not assert possession or add a matching job.",
    question:"Which exact original source fragment rejects this late visitor's falsely assigned professional identity?",
    correctQuote:"不是",wrongQuotes:["我的","也是"],
    feedback:[
      "我的 was right when the earlier employee identified their badge, but the new visitor is instead rejecting an incorrect job. The original negation is 不是.",
      "也是 confirmed an actual coworker's shared job, not the unrelated visitor's false title. The correct authentic denial is 不是."
    ]},
   {context:"After the third visitor's job title is corrected, the original badge owner returns to confirm who the badge actually belongs to. The owner is speaking again, and the clerk is no longer asking about anyone's profession.",
    question:"Which original first-person fragment now identifies the item as belonging to the person speaking instead of answering a job identity question?",
    correctQuote:"我的",wrongQuotes:["不是","也是"],
    feedback:[
      "不是 was the third visitor's correct earlier denial of a false title. The returning owner now positively states who owns the badge, so the original possessive 我的 applies.",
      "也是 applies to a genuinely shared professional identity but does not mark an item as belonging to a person. The source possession fragment is 我的."
    ]},
   {instruction:"The clerk then asks whether a real colleague actually has the same job as the original badge owner. Type the exact attested additive source fragment, rather than denying a title or claiming an item.",
    quote:"也是",sourceId:source(3,"也是"),wrongQuotes:["我的","不是"],
    feedback:[
      "我的 claims an item belongs to the speaker, while this last question is about two colleagues with a genuinely shared profession. The original addition is 也是.",
      "不是 denies a false role, but the clerk has confirmed that both coworkers really hold this position. Type authentic 也是."
    ]},
   {instruction:"Recall the exact source written tone-marked Pinyin for the third visitor's original denial 不是, not the coworker's matching-role confirmation.",
    quote:"不是",sourceId:source(3,"不是"),reading:"bú shì",sourceMisreading:"yě shì",
    sourceFeedback:"yě shì belongs to the original additive coworker-role expression 也是. The third visitor's denial 不是 is written bú shì.",
    unmarkedFeedback:"bu shi omits both attested tone marks and the contextual rising tone. The original written Pinyin is bú shì."
   },
   {instruction:"Write a fourteenth independent front-desk conversation: an owner reclaims their badge, the clerk confirms another colleague's shared profession, an unrelated visitor rejects a false job and the owner returns to the possession claim. In an intermediate draft move the false role dispute earlier; in a final draft change who briefly holds the badge, preserving ownership and original source meanings.",
    criteria:[
      "Explain the distinction between true item ownership and temporary badge custody, as well as the colleague's valid shared work role.",
      "Place authentic 我的, 也是 and 不是 only in the correct speaker contexts and retain their exact source Hanzi and Pinyin.",
      "Compare initial, intermediate and final separately authored drafts after revising the visitor's entry time and badge holder, without inventing any attested original dialogue."
    ]}
  )
 }
] as const;
