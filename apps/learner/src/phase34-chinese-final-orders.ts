import type {ChineseSixthTransferV1,SourceAuthoredIntake} from "./source-intake.ts";
import {PHASE33_CHINESE_COUNTERFACTUALS} from "./phase33-chinese-counterfactuals.ts";

/** Entirely new internal editorial situations, never an original transcript,
 * source-authored recording, official HSK lesson or learner progress event. */
const prior=PHASE33_CHINESE_COUNTERFACTUALS;
const transfer=(decision:ChineseSixthTransferV1["decision"],
 sixthSequence:ChineseSixthTransferV1["sixthSequence"],
 exactPinyin:ChineseSixthTransferV1["exactPinyin"],
 writing:ChineseSixthTransferV1["writing"]):ChineseSixthTransferV1=>
 ({decision,sixthSequence,exactPinyin,writing});

export const PHASE34_CHINESE_FINAL_ORDERS:readonly SourceAuthoredIntake[]=[
 {
  ...prior[0]!,
  id:"zh:phase34-students-rotate-speakers",
  title:"Three students rotate the speaking role",
  objective:"Distinguish an individual representative, a shared student group and several visitors when the floor passes to three different speakers; rebuild the final unpractised evidence sequence.",
  explanation:"The authentic demo source separates 我 (wǒ), 我们 (wǒmen) and 你们 (nǐmen). The three items retain their exact original written reading even when the newly authored speakers shift.",
  transferSituation:"A new student representative first addresses the outside visitors, then discusses a team decision that did not include the visitors, and finally asks one delegate to report as an individual.",
  writingInstruction:"Independently compose a three-speaker seminar debate where an audience member becomes the presenter, the team makes a group claim and one delegate corrects an individual misunderstanding.",
  reflection:"Why does the last source order for the same three expressions begin by addressing listeners instead of first introducing the person who is speaking?",
  writingChecks:["Identify the current speaker before choosing first-person or second-person words.","Keep a statement about a team distinct from an address to visiting listeners.","Use the singular only when one individual actually takes the floor."],
  chineseSixthTransfer:transfer(
   {context:"A visiting representative begins by directing a question to several outside listeners, not speaking on behalf of the local team or naming themself. Another delegate challenges that interpretation and asks which original expression directly addresses a group of listeners.",
    question:"Which exact original Hanzi expression addresses those plural listeners, rather than naming the speaker alone or a team including the speaker?",
    correctQuote:"你们",wrongQuotes:["我","我们"],
    feedback:[
      "我 names the individual speaking but cannot address the several visiting listeners. The original plural addressee expression is 你们.",
      "我们 names a team that includes the speaker, whereas the representative now addresses an outside audience. The matching original source excerpt is 你们."
    ]},
   {instruction:"Rebuild an entirely new sixth situational order using the three unchanged original source items: address the visiting listeners first, report the local group's agreement second, and identify the individual final speaker last. All five previous orders were appropriate for other speaker arrangements but are wrong here.",
    expected:["你们","我们","我"],
    previousFeedback:[
      "The earliest speaker-first situation began with a single student, whereas the visitors must be addressed first in this independently changed scenario.",
      "The visitor-first second situation identified the individual immediately after addressing the audience. This scene instead reports the local group before identifying its delegate.",
      "The third situation began with an individual rather than an audience address, so it reverses the first turn's communicative purpose here.",
      "The fourth situation began with the moderator's own team instead of the visiting group. The new audience member is addressed before the local team's decision.",
      "The fifth situation also began with the local team's report, while this sixth one first addresses the visiting listeners."
    ]},
   {instruction:"Type the exact original tone-marked written Pinyin for the attested Hanzi 我们. Include every tone mark without relying on invented voice or pronunciation recordings.",
    quote:"我们",sourceId:"zh-wo-demo",reading:"wǒmen",
    sourceMisreading:"nǐmen",
    sourceFeedback:"nǐmen is the source-attested reading of 你们, which addresses plural listeners. The requested original 我们 is written wǒmen.",
    unmarkedFeedback:"Unmarked romanization drops the original source's third-tone vowel mark. Use the exact written Pinyin wǒmen for 我们."
   },
   {instruction:"Write a twelfth independently authored seminar conversation: address visiting students first, let the moderator describe their own team's decision second, and have a single delegate report last. Revise your own script after a new visitor changes which side the moderator represents; explain the three different referents explicitly.",
    criteria:[
      "State who is addressing the visitors first, who belongs to the local team and who speaks individually only in the last turn.",
      "Use the three unchanged source fragments 你们, 我们 and 我 with original meanings while identifying newly authored turns separately.",
      "Compare the two self-authored drafts after the speaker switches groups and explain why earlier source orders no longer match the new scene."
    ]}
  )
 },
 {
  ...prior[1]!,
  id:"zh:phase34-vendor-returns-to-first-customer",
  title:"A vendor returns to the first customer",
  objective:"Recover who is actually being addressed when a tea question, a fresh arrival and an apple report must be handled in a previously unused order.",
  explanation:"The separately authenticated snippets 你喜欢喝茶吗？ (Nǐ xǐhuan hē chá ma?), 你好 (nǐ hǎo) and 这个苹果很好吃。 (Zhège píngguǒ hěn hǎochī.) do not form a recorded source dialogue.",
  transferSituation:"A first customer asks whether a companion likes tea, a new customer arrives and is greeted, and finally the original first customer points to an apple to ask about its taste.",
  writingInstruction:"Independently write a market exchange with a vendor, a tea-loving companion and a new buyer; have the first customer return to ask about a fruit only after the new arrival is greeted.",
  reflection:"Why should the original question and greeting appear before the apple statement in this particular three-guest situation?",
  writingChecks:["Keep the tea preference request distinct from the returning buyer's apple question.","Only greet someone who actually just arrived.","Preserve the original interrogative 吗？ and the apple statement's declarative final 。."],
  chineseSixthTransfer:transfer(
   {context:"One already-present customer asks the vendor to inquire whether their companion likes tea. The companion has been introduced, so this is not a new-arrival greeting or a fruit-description request.",
    question:"Which original complete Hanzi source question should be addressed to the companion about drinking tea rather than greeting them or describing an apple?",
    correctQuote:"你喜欢喝茶吗？",wrongQuotes:["你好","这个苹果很好吃。"],
    feedback:[
      "你好 is a greeting and the companion is already present. The source-attested beverage preference question includes the final 吗？ and matches this intention.",
      "这个苹果很好吃。 describes a fruit and never asks whether this companion enjoys tea. The appropriate original question is 你喜欢喝茶吗？."
    ]},
   {instruction:"For the sixth previously unused authentic excerpt order, first ask the already-present companion about tea, then greet a new buyer who has just arrived, and only afterward describe the apple to the returning first customer. Each of the five earlier valid orders served a different arrival schedule.",
    expected:["你喜欢喝茶吗？","你好","这个苹果很好吃。"],
    previousFeedback:[
      "The earliest market encounter greeted someone before asking about a beverage, but the first companion in this new scene has already arrived.",
      "The next arrangement described the apple before the tea question; here the returning buyer does not ask about fruit until after the newer customer is welcomed.",
      "The third situation also started with a tea question but moved directly to describing an apple, ignoring the newcomer who must now be greeted in between.",
      "The fourth situation began with a greeting even though the initial question here comes from customers who were already present.",
      "The fifth situation described the apple first; this time the returning buyer's apple inquiry happens only at the end."
    ]},
   {instruction:"Type the exact original tone-marked written Pinyin for 你好, the source greeting to the newly arriving buyer, not the tea question or an apple statement.",
    quote:"你好",sourceId:"zh-ni-demo",reading:"nǐ hǎo",
    sourceMisreading:"Nǐ xǐhuan hē chá ma?",
    sourceFeedback:"The complete source question Nǐ xǐhuan hē chá ma? belongs to asking about tea. The simple original greeting 你好 has written Pinyin nǐ hǎo.",
    unmarkedFeedback:"ni hao loses both original third-tone marks. The authenticated original greeting is written with the marks in nǐ hǎo."
   },
   {instruction:"Write a twelfth learner-authored three-customer market dialogue where the vendor asks about a tea-loving companion, then greets an arriving buyer, and only afterward describes an apple to the returning original customer. Revise it after the first customer leaves early, moving the apple discussion to an independently authored later exchange.",
    criteria:[
      "Label each customer's arrival time and purpose, and keep the tea question, greeting and apple description attached to different conversational turns.",
      "Preserve the three original Hanzi snippets, including both distinct question and statement punctuation, without inventing a source transcript.",
      "Compare the revised and first draft and explain why the final apple description now belongs to a different participant."
    ]}
  )
 },
 {
  ...prior[2]!,
  id:"zh:phase34-clerk-checks-a-second-identity",
  title:"A clerk corrects a second identity dispute",
  objective:"Handle an explicit mistaken-identity denial, a third-person teacher identification and finally the student's self-introduction, rather than repeating an earlier registration order.",
  explanation:"The original 不是 (bú shì) denies a false role, 他是老师。 (Tā shì lǎoshī.) identifies a different person and 我是学生。 (Wǒ shì xuésheng.) identifies the current speaking student.",
  transferSituation:"A new registrar first incorrectly assigns a teacher title to the student. The student denies it, then indicates which separate person is actually a teacher, and finally registers as a student.",
  writingInstruction:"Write an original conversation between two staff members, a student and a teacher in which the student denies a false title before identifying the teacher and positively stating their own role.",
  reflection:"What speaker shift makes the source third-person teacher sentence appropriate between the initial denial and the later first-person student introduction?",
  writingChecks:["Deny a specific erroneous role, not an unstated assumption.","Keep the teacher's third-person identity separate from the student's first-person identity.","Retain the complete final 。 in each independently attested source sentence."],
  chineseSixthTransfer:transfer(
   {context:"A second clerk incorrectly marks the student as a teacher in the records. Before identifying the real teacher or entering the student's own role, the student must reject that specific mistake explicitly.",
    question:"Which original attested short Hanzi expression rejects the second clerk's false assignment rather than introducing the student positively or describing another teacher?",
    correctQuote:"不是",wrongQuotes:["他是老师。","我是学生。"],
    feedback:[
      "他是老师。 describes the real teacher in the third person, but it does not itself deny the incorrect title just assigned to the student. The exact source denial is 不是.",
      "我是学生。 states the speaker's positive status, but the current communicative step is the explicit denial of a false teacher assignment using 不是."
    ]},
   {instruction:"Arrange a sixth and previously unused source-authentic school exchange: the student first denies a mistaken teacher role, then points out the separate real teacher, and only last states their own positive student identity. All five previously correct orders were for different misidentification situations.",
    expected:["不是","他是老师。","我是学生。"],
    previousFeedback:[
      "The first practice introduced the student before another teacher. Here the student's response must begin by explicitly denying the new false role.",
      "The second practice identified the teacher before a denial, but this clerk's mistake must first be rejected by the student.",
      "The third practice began with denial but immediately followed with the student's own identification, whereas this scene identifies a different teacher next.",
      "The fourth practice introduced the teacher before the student instead of beginning with this new incorrect badge assignment.",
      "The fifth practice began with a positive student introduction. This new scenario requires an explicit denial before any correct identities."
    ]},
   {instruction:"Enter the exact original tone-marked written Pinyin for the source negation 不是 as used to deny the wrong role. Retain the original contextual tone before 是.",
    quote:"不是",sourceId:"zh-shi-demo",reading:"bú shì",
    sourceMisreading:"Tā shì lǎoshī.",
    sourceFeedback:"Tā shì lǎoshī. is the original reading of the third-person teacher sentence, not the source denial. The original 不是 is written bú shì.",
    unmarkedFeedback:"bu shi omits both attested tone marks and hides the contextual rising tone on 不 before 是. Retain the source form bú shì."
   },
   {instruction:"Author a twelfth school registration conversation with a student, a second clerk and the real teacher. The student first denies the wrong title, then points to the teacher, then identifies themself. Revise the conversation after the teacher arrives before the clerk's assumption; keep identities and original pronouns accurate.",
    criteria:[
      "Explicitly connect the original negation 不是 to the freshly mistaken teacher assignment, rather than an unspecified denial.",
      "Show the source third-person teacher identification and positive student first-person statement as distinct communicative acts.",
      "Revise speaker arrival order independently and label the three exact source quotations apart from all newly written dialogue lines."
    ]}
  )
 },
 {
  ...prior[3]!,
  id:"zh:phase34-guest-changes-badge-custody",
  title:"A visitor changes badge custody and job claims",
  objective:"Distinguish first rejecting an incorrect job label, then asserting who owns a badge and finally confirming that another worker genuinely shares a role.",
  explanation:"The original source expressions 不是 (bú shì), 我的 (wǒ de) and 也是 (yě shì) keep their separate negation, possession and shared-identity meanings.",
  transferSituation:"A guest first corrects a false professional title, then the badge owner claims the item and finally another employee states that their real work matches a coworker's job.",
  writingInstruction:"Compose a new reception discussion with a guest, actual badge owner, clerk and another employee; avoid confusing the three people's roles.",
  reflection:"What changes when the current speaking person moves from denying a title to identifying an item and then confirming a true job?",
  writingChecks:["Make the false role explicit before rejecting it.","Distinguish the current speaking badge owner from someone temporarily holding the item.","Use additive identity only if the next person really shares the earlier worker's role."],
  chineseSixthTransfer:transfer(
   {context:"An unrelated visitor approaches the reception desk and is mistakenly labelled an employee. The visitor is asked to deny that specific false role; no badge or genuinely shared job is being discussed in this first exchange.",
    question:"Which exact attested original short expression explicitly rejects the newly false professional title, rather than affirming ownership or an additional true role?",
    correctQuote:"不是",wrongQuotes:["我的","也是"],
    feedback:[
      "我的 is an original possessive expression for something belonging to the speaker, but no item is being claimed. To deny the mistaken role, use source 不是.",
      "也是 confirms a second matching role, whereas this visitor is denying a false title. The correct source negation is 不是."
    ]},
   {instruction:"Use the sixth untouched sequence of attested Hanzi source snippets: first deny an incorrectly assigned job title, then have the true badge owner identify their item, and finally let a distinct colleague confirm a genuinely shared professional role. Reject each of the five earlier source orders because speaker intent and timing are now different.",
    expected:["不是","我的","也是"],
    previousFeedback:[
      "The first reception scene claimed the badge before denying a role, but this visiting stranger first rejects a false title before any badge discussion.",
      "The second arrangement began by affirming a true shared job rather than correcting the new visitor's incorrect job title.",
      "The third scene also began with negation, but moved to a colleague's shared job before the badge claim; here the real owner identifies the item first.",
      "The fourth situation claimed the badge before affirming a colleague's identity, whereas the visitor's false role must now be rejected first.",
      "The fifth arrangement affirmed the coworker's job before addressing the badge; that true shared-role claim belongs at the end in this conversation."
    ]},
   {instruction:"Reconstruct the exact original tone-marked written Pinyin for the source expression 也是 confirming that a distinct employee really holds the same job.",
    quote:"也是",sourceId:"zh-shi-demo",reading:"yě shì",
    sourceMisreading:"bú shì",
    sourceFeedback:"bú shì is the attested reading of 不是 and explicitly denies a role. The unchanged additive shared-job expression 也是 has original Pinyin yě shì.",
    unmarkedFeedback:"ye shi removes the source's third- and fourth-tone marks. Preserve the original tone-marked yě shì for 也是."
   },
   {instruction:"Write a twelfth original four-speaker front-desk exchange where a visitor rejects a mistaken title, a badge owner claims an item, and a coworker confirms a real additional job. Revise it after the badge is temporarily handed to the clerk, distinguishing holding the badge from belonging to its owner.",
    criteria:[
      "Correct the false role before discussing the item and identify the speaker who actually owns the badge.",
      "Preserve the difference between source 不是 for denial, 我的 for current speaker possession and 也是 for a genuinely shared role.",
      "Compare first and revised independently authored turns after badge custody changes, without treating the exchange as a source recording."
    ]}
  )
 }
] as const;
