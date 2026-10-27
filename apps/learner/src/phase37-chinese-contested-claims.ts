import type {ChineseContestedClaimV1,SourceAuthoredIntake} from "./source-intake.ts";
import {PHASE36_CHINESE_DELAYED_VERIFICATIONS} from "./phase36-chinese-delayed-verifications.ts";

/** Multiple authored reports about the same authentic source fragments.
 * Only earlier pinned Hanzi/Pinyin are ever treated as original evidence. */
const earlier=PHASE36_CHINESE_DELAYED_VERIFICATIONS;
const source=(i:number,quote:string)=>{
  const found=earlier[i]!.encounters.find(item=>item.quote===quote);
  if(!found)throw new Error("Cannot attribute unauthenticated Chinese expression: "+quote);
  return found.sourceId;
};
const claims=(dispute:ChineseContestedClaimV1["dispute"],appeal:ChineseContestedClaimV1["appeal"],
 thirdSource:ChineseContestedClaimV1["thirdSource"],pinyin:ChineseContestedClaimV1["pinyin"],
 dialogue:ChineseContestedClaimV1["dialogue"]):ChineseContestedClaimV1=>
 ({dispute,appeal,thirdSource,pinyin,dialogue});

export const PHASE37_CHINESE_CONTESTED_CLAIMS:readonly SourceAuthoredIntake[]=[
 {
  ...earlier[0]!,
  id:"zh:phase37-two-meeting-records",
  title:"Two meeting reports disagree about the speaker",
  objective:"Resolve a conflicting committee report, a later audience-directed challenge, and an individual witness by attributing three authentic excerpts to their exact speakers.",
  explanation:"The original source independently attests 我们 wǒmen for a speaker-inclusive group, 你们 nǐmen for plural addressees, and 我 wǒ for the individual speaker. Neither newly written meeting report is a source transcript.",
  transferSituation:"A minute-taker attributes a committee decision to visiting listeners; an independent recorder corrects the source attribution, and a host then changes the question to who is being addressed.",
  writingInstruction:"Compose two rival meeting reports and a corrected four-person exchange, clearly indicating when a person speaks for a committee and when the host addresses visitors.",
  reflection:"What evidence forces a change from the first-person group to the plural addressees even though both descriptions mention several people?",
  writingChecks:["Identify whether the speaker belongs to the group under discussion.","Keep the host's direct address distinct from a committee's reported decision.","Mark the independent witness's individual testimony separately."],
  chineseContestedClaim:claims(
   {context:"Two secretaries disagree about the moderator's report. One incorrectly marks the visitors as the referent, even though the moderator explicitly reports an agreement reached with the moderator's own committee. A second secretary requests the original source expression that includes the moderator within the reporting group.",
    question:"Which original Hanzi source expression fits this committee member's own collective report, not a direct address to visitors or a personal statement?",
    correctQuote:"我们",wrongQuotes:["你们","我"],feedback:[
      "你们 addresses the visiting listeners, but the evidence says the speaker reports the own committee's decision. The authentic speaker-inclusive group expression is 我们.",
      "我 identifies only the individual, whereas the current record includes the moderator and committee together. The original attested group form is 我们."
    ]},
   {context:"The two secretaries agree about the original committee statement. A different host now addresses the visiting students directly to ask for a response. A new note wrongly reuses the committee's earlier first-person group reference even though the outside visitors have become addressees.",
    question:"After the host turns toward several outside visitors, which original form now names the plural addressees rather than the committee including the speaker?",
    correctQuote:"你们",wrongQuotes:["我们","我"],feedback:[
      "我们 described the speaking moderator's team in the earlier record, but the new host now addresses another group directly. The original plural addressee expression is 你们.",
      "我 would identify a sole speaker. The host is addressing several visiting students; the source second-person plural 你们 is required."
    ]},
   {instruction:"A fourth participant independently submits an individual objection and refuses to speak for either committee or visiting group. Reconstruct the precise original single-speaker Hanzi excerpt without inventing additional source words.",
    quote:"我",sourceId:source(0,"我"),wrongQuotes:["我们","你们"],feedback:[
      "我们 includes a team with the speaker, while this fourth participant states only a personal view. The exact original first-person singular is 我.",
      "你们 refers to plural addressees, not an independent person's self-reference. The source word for the individual speaker is 我."
    ]},
   {instruction:"Type the original tone-marked written Pinyin for the attested group-inclusive 我们, retaining its exact original accent, not the reading for plural listeners.",
    quote:"我们",sourceId:source(0,"我们"),reading:"wǒmen",sourceMisreading:"nǐmen",
    sourceFeedback:"nǐmen is the authentic source reading for 你们, which addresses visitors. The requested committee-inclusive 我们 is written wǒmen.",
    unmarkedFeedback:"wǒmen contains a third-tone mark on its first syllable. The unmarked text women is not the exact original written reading."
   },
   {instruction:"Write a fifteenth independently authored meeting exchange containing two contradictory notes: the first falsely attributes the moderator's team report to visitors, the second corrects it, and the host then turns to those visitors. Revise twice, first changing which student joins the committee and then moving the independent witness earlier; keep source phrases distinct from authored dialogue.",
    criteria:[
      "Explain specifically which secretary made the incorrect group attribution and how the original first-person plural source resolves it.",
      "Use 我们 for the speaking committee, 你们 only when visitors become addressees and 我 for an independent individual.",
      "Compare the original and two distinct submitted revisions after changes to participant membership and turn order, preserving exact authenticated source quotations."
    ]}
  )
 },
 {
  ...earlier[1]!,
  id:"zh:phase37-contradictory-market-orders",
  title:"Two buyers dispute a market order",
  objective:"Resolve incompatible reports about a companion's tea request, a returning customer's fruit question, and a genuinely new buyer's arrival using precise original source Hanzi.",
  explanation:"Original 你喜欢喝茶吗？ (Nǐ xǐhuan hē chá ma?) asks tea preference; 这个苹果很好吃。 (Zhège píngguǒ hěn hǎochī.) reports apple quality; 你好 (nǐ hǎo) is a greeting. They are separate source excerpts.",
  transferSituation:"One buyer mistakenly records an apple statement as an answer to a question about drinking tea. Another asks for a fresh fruit description, and a third buyer later needs a first-contact greeting.",
  writingInstruction:"Write a three-customer vendor conversation with conflicting written orders; identify the actual request behind each line before a different person arrives.",
  reflection:"How does the same shopper change the appropriate response by switching from another person's tea preference to the quality of an apple?",
  writingChecks:["Distinguish an interrogative drink preference request from a declarative apple-quality statement.","Greet only a person who has just arrived rather than a returning shopper.","Keep full authentic punctuation, particularly 吗？ and 。."],
  chineseContestedClaim:claims(
   {context:"Two written market orders disagree. The first buyer explicitly asks the vendor to find out whether an already-present companion likes tea, but a cashier misfiles the request as a statement that this apple tastes good. The companion is not a new arrival.",
    question:"Which complete authenticated original question corrects the tea preference entry rather than describing fruit or greeting a customer?",
    correctQuote:"你喜欢喝茶吗？",wrongQuotes:["这个苹果很好吃。","你好"],feedback:[
      "这个苹果很好吃。 is a declarative apple-quality claim, not a question about a companion's tea preference. The authentic complete tea question is 你喜欢喝茶吗？.",
      "你好 greets a newcomer, but the companion has already arrived. The requested original yes-no question about tea ends with 吗？."
    ]},
   {context:"The tea request is closed. The same buyer returns and points to a particular apple, requesting a statement about how it tastes. The cashier mistakenly copies the earlier tea question into the new apple-quality order, despite the changed object and communicative goal.",
    question:"Which authentic original declarative sentence answers the now-current apple question rather than repeating a tea query or greeting?",
    correctQuote:"这个苹果很好吃。",wrongQuotes:["你喜欢喝茶吗？","你好"],feedback:[
      "你喜欢喝茶吗？ correctly served the previous drink question, but the current buyer points to a fruit and seeks an apple-quality statement. The full source is 这个苹果很好吃。.",
      "你好 is a first-contact greeting and says nothing about the apple's quality. The authentic statement 这个苹果很好吃。 is the correct reply."
    ]},
   {instruction:"A different shopper arrives for the first time after both orders have been corrected. Type the original exact Hanzi greeting only; it must not be the tea question or the apple-quality sentence.",
    quote:"你好",sourceId:source(1,"你好"),wrongQuotes:["你喜欢喝茶吗？","这个苹果很好吃。"],feedback:[
      "你喜欢喝茶吗？ asks for tea preference and does not greet this just-arriving visitor. The two-character original greeting is 你好.",
      "这个苹果很好吃。 describes a fruit, but this newly arriving customer needs an initial greeting, the original 你好."
    ]},
   {instruction:"Type the exact tone-marked original written Pinyin for 这个苹果很好吃。, retaining the source's complete punctuation; do not substitute the original tea question's reading.",
    quote:"这个苹果很好吃。",sourceId:source(1,"这个苹果很好吃。"),
    reading:"Zhège píngguǒ hěn hǎochī.",sourceMisreading:"Nǐ xǐhuan hē chá ma?",
    sourceFeedback:"Nǐ xǐhuan hē chá ma? reads the source tea question, not the apple quality sentence. The exact authenticated written apple reading is Zhège píngguǒ hěn hǎochī..",
    unmarkedFeedback:"The original fruit statement contains marked Mandarin vowel tones. Zhege pingguo hen haochi. is not the exact original written Pinyin."
   },
   {instruction:"Independently author a fifteenth four-person market dialogue from two contradictory vendor tickets: correct a tea question, handle a later apple request, and greet a new visitor. Produce two further distinct drafts: first move the returning buyer's apple question earlier, then let the companion ask it instead while retaining source quote custody.",
    criteria:[
      "Identify exactly which of the two tickets wrongly substitutes an apple-quality statement for a preference question.",
      "Keep complete original tea question, apple statement and greeting with their distinct addressees, timing and punctuation.",
      "Compare first, intermediate and final submitted independently authored conversations after changing the apple request's timing and speaker."
    ]}
  )
 },
 {
  ...earlier[2]!,
  id:"zh:phase37-registrar-conflicting-badges",
  title:"Two registrars dispute the same badge",
  objective:"Resolve a mistaken teacher assignment, a student self-identification and a later genuine third-person teacher introduction without conflating the three original utterances.",
  explanation:"The authentic 不是 (bú shì) rejects a false role, 我是学生。 (Wǒ shì xuésheng.) is a positive first-person role statement, and 他是老师。 (Tā shì lǎoshī.) describes a separate teacher.",
  transferSituation:"Two registrars hold inconsistent records: one attributes teacher status to a student, another has the actual student's file, and a genuinely different teacher walks in after the dispute.",
  writingInstruction:"Create a four-person registration dialogue from two contradictory badge records, explicitly noting which person each Chinese excerpt can describe.",
  reflection:"Why does confirming the student's actual role require a positive original statement after an earlier denial has already corrected a false teacher badge?",
  writingChecks:["Deny a specific false role rather than an unstated label.","Use first-person student identity only for the speaking student.","Introduce the genuine third-person teacher only as a different individual."],
  chineseContestedClaim:claims(
   {context:"Two school registrars dispute a visitor's name badge. The first accidentally identifies the speaking student as a teacher, while the second requests an explicit correction to that false role before entering any affirmative details in the actual record.",
    question:"Which exact original source expression directly denies the first clerk's incorrect teacher role for this student?",
    correctQuote:"不是",wrongQuotes:["我是学生。","他是老师。"],feedback:[
      "我是学生。 positively states the student's actual role, but the disputed field must first explicitly deny the incorrectly attributed teacher role using 不是.",
      "他是老师。 identifies a different teacher, not a denial of the incorrect role ascribed to this speaking student. The original negative excerpt is 不是."
    ]},
   {context:"The mistaken teacher label is removed. The second registrar now specifically requests an affirmative identity statement from the student themself for the enrollment entry, rather than any more denials or an identification of another person.",
    question:"Which complete authentic first-person statement should fill the student's actual positive role field?",
    correctQuote:"我是学生。",wrongQuotes:["不是","他是老师。"],feedback:[
      "不是 denied a false badge field, but the registrar now needs an affirmative first-person student identity. The original complete source is 我是学生。.",
      "他是老师。 describes a different actual teacher and cannot be entered as the speaking student's own student identity. Use authentic 我是学生。."
    ]},
   {instruction:"A genuinely separate teacher enters after the student record is corrected. Reconstruct the complete exact original third-person source sentence for this different teacher, including its final full stop.",
    quote:"他是老师。",sourceId:source(2,"他是老师。"),wrongQuotes:["不是","我是学生。"],feedback:[
      "不是 rejects an incorrect label but does not identify this different person as a teacher. The full attested statement is 他是老师。.",
      "我是学生。 identifies the currently speaking student, not the other genuine teacher. Source third-person 他是老师。 is required."
    ]},
   {instruction:"Enter the original exact tone-marked written Pinyin for the complete first-person student statement 我是学生。, not the separate teacher identification.",
    quote:"我是学生。",sourceId:source(2,"我是学生。"),
    reading:"Wǒ shì xuésheng.",sourceMisreading:"Tā shì lǎoshī.",
    sourceFeedback:"Tā shì lǎoshī. reads the source sentence about a different teacher. The student's own role has exact original written Pinyin Wǒ shì xuésheng..",
    unmarkedFeedback:"Wo shi xuesheng. omits the original source vowel tone marks. Retain the source's exact Wǒ shì xuésheng. and final punctuation."
   },
   {instruction:"Write a fifteenth original school registration dialogue from conflicting registrars' records: deny the false teacher title, give the positive student identity, then identify the different actual teacher. In one revised draft switch the genuine teacher's arrival time, and in another let the second clerk ask first; compare all three independently authored turns.",
    criteria:[
      "Show which registrar made the incorrect teacher inference about the speaking student and why the original denial is required.",
      "Use the complete authentic first-person student and third-person teacher statements with distinct pronoun referents and original punctuation.",
      "Compare first, intermediate and final independently drafted conversations when clerk order and genuine teacher arrival change."
    ]}
  )
 },
 {
  ...earlier[3]!,
  id:"zh:phase37-two-badge-claimants",
  title:"Two badge claimants give conflicting accounts",
  objective:"Verify item ownership, a coworker's genuine shared role and a separately mistaken visitor title using source-authenticated ownership, addition and denial.",
  explanation:"Original 我的 (wǒ de) identifies first-person belonging, 也是 (yě shì) confirms a second matching real role and 不是 (bú shì) denies an invalid title; all are independently attested fragments.",
  transferSituation:"Two employees claim the same badge, but only one is its rightful owner. A clerk then changes the question to professional identity; a new visitor later needs to deny a false title.",
  writingInstruction:"Independently create a badge-dispute dialogue that distinguishes object ownership, current custody and professional status across multiple coworkers.",
  reflection:"How could both coworkers truthfully share a job while only one can currently claim the badge as their own?",
  writingChecks:["Avoid treating temporary custody as ownership.","Confirm a genuinely shared professional role without claiming shared badge ownership.","Reject an unrelated visitor's incorrect job label separately."],
  chineseContestedClaim:claims(
   {context:"Two colleagues challenge the front desk's badge record. One is merely holding the badge for another, who speaks to confirm their rightful ownership. The clerk asks for the authenticated first-person possessive rather than a statement of professional identity or a denial of a job role.",
    question:"Which exact original Hanzi expression names the item as belonging to the current speaking owner despite the other person's temporary custody?",
    correctQuote:"我的",wrongQuotes:["也是","不是"],feedback:[
      "也是 affirms that another worker shares a role, but this original question asks who owns a particular badge. First-person possessive 我的 is correct.",
      "不是 denies a false title but does not positively identify the badge as belonging to the person speaking. Source 我的 expresses ownership."
    ]},
   {context:"The rightful owner has been verified and the badge is returned. The clerk now checks whether the second employee genuinely holds the same job as the first. Both do, so the question concerns a matching role rather than ownership of the item.",
    question:"Which attested expression confirms that the second employee also truly shares the colleague's job without claiming a badge or rejecting a title?",
    correctQuote:"也是",wrongQuotes:["我的","不是"],feedback:[
      "我的 was correct for the specific badge owner, but this question is now about a second employee with a matching true profession. The original additive identity form is 也是.",
      "不是 rejects a false title, whereas both colleagues genuinely have the same job. Original 也是 confirms this second authentic role."
    ]},
   {instruction:"A different visitor is wrongly assigned an employee title and explicitly rejects it. Type the exact original Hanzi negation, not item ownership or agreement about a real shared profession.",
    quote:"不是",sourceId:source(3,"不是"),wrongQuotes:["我的","也是"],feedback:[
      "我的 refers to the speaker's item, which does not deny a wrongly attributed job. The authentic original negation is 不是.",
      "也是 confirms a real shared profession, while this separate visitor rejects an incorrect title. The source negative expression is 不是."
    ]},
   {instruction:"Write the exact original tone-marked Pinyin for the first-person badge ownership fragment 我的, not the original denial or genuinely shared-role expression.",
    quote:"我的",sourceId:source(3,"我的"),reading:"wǒ de",sourceMisreading:"bú shì",
    sourceFeedback:"bú shì is the original denial reading of 不是, not a possession claim. The exact source reading for 我的 is wǒ de.",
    unmarkedFeedback:"wo de omits the third-tone mark on the authentic first-person possessive. Use the original tone-marked wǒ de."
   },
   {instruction:"Write a fifteenth independent reception-desk exchange where two coworkers contest custody of a badge, the owner identifies it, their matching true professional roles are clarified, and a separate guest rejects a false title. Revise once by changing who temporarily holds the item, then revise again by changing who actually owns it while keeping the original source expressions correct.",
    criteria:[
      "Clearly identify who owns the badge and who temporarily holds it at each point of the disputed record.",
      "Apply source 我的 only to the present owner, 也是 to a verified shared profession and 不是 to the unrelated visitor's incorrect role.",
      "Compare three independently submitted versions, preserving authentic Hanzi/Pinyin and explaining how the changed ownership shifts the speaker."
    ]}
  )
 }
] as const;
