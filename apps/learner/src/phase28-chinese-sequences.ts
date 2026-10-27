import type {SourceAuthoredIntake,ChineseSequenceV1} from "./source-intake.ts";
import {PHASE27_CHINESE_TRANSFER} from "./phase27-chinese-transfer.ts";

/** Fresh learner situations extend, but never mutate, the original Phase 27 source-pinned drafts.
 * Reused excerpts are exact original DEMO_ONLY snippets, not alleged source dialogues. */
const parents=PHASE27_CHINESE_TRANSFER;
const sequence=(order:ChineseSequenceV1["order"],shiftedReading:ChineseSequenceV1["shiftedReading"],
  independentDialogue:ChineseSequenceV1["independentDialogue"]):ChineseSequenceV1=>({order,shiftedReading,independentDialogue});
export const PHASE28_CHINESE_SEQUENCES:readonly SourceAuthoredIntake[]=[
 {
  ...parents[0]!,
  id:"zh:phase28-new-group-orientation",
  title:"Reconstructing a new group orientation",
  objective:"Sequence source-backed speaker, own-group and other-group references at orientation, then handle a surprise change of speaking roles.",
  explanation:"我 (wǒ) identifies the individual speaking. 我们 (wǒmen) includes that speaker's group, while 你们 (nǐmen) addresses another group. The original source attests these words separately, not an entire orientation conversation; the three-source ordering is original pedagogical practice.",
  transferSituation:"Two school groups share a room. One representative introduces who speaks, identifies their own group, and then addresses the visiting group; a new representative interrupts and reverses the roles.",
  writingInstruction:"Compose a new three-person orientation conversation, mark speaker and listener on every turn, and explain how ownership of 我们 changes when another representative takes over.",
  reflection:"Which part of the newly authored orientation would reverse meaning if 我们 and 你们 switched places, even though the words themselves never change?",
  writingChecks:["Identify 我 as the current individual speaker in each turn.","Use 我们 when the speaker includes their group in the referent.","Direct 你们 toward the addressed group and explain changes after a role reversal."],
  guidedQuestion:"At the start of the orientation, which exact source word names the one person currently speaking?",
  guidedAnswer:"我",
  independentQuestion:"Which original expression identifies the listeners in the visiting group?",
  independentAnswer:"你们",
  chineseExpansion:{
   ...parents[0]!.chineseExpansion!,
   grammarHeading:"The current speaker owns the first-person group",
   grammarExplanation:"The attested written Pinyin is wǒ, wǒmen and nǐmen. The first-person form 我们 includes the speaker; 你们 addresses others. An authored dialogue can reorder these as discourse roles change, without altering the pinned original quotations.",
   contrastCue:"In the new orientation, check who speaks before assigning the group included by 我们, then identify the group addressed as 你们.",
   cloze:{instruction:"Restore the complete original first-person plural pronoun in Hanzi.",quote:"我们",before:"我",answer:"们",after:"",sourceId:"zh-wo-demo"},
   situationalChoice:{question:"When the first representative addresses members of the visiting team, which authentic expression refers to the listeners?",correctQuote:"你们"},
   dialogueBrief:"Make the turn-by-turn attribution explicit and keep any newly composed statements separate from the unchanged source snippets.",
   tone:{question:"Type the exact tone-marked Pinyin of the source pronoun 你们 used for plural listeners.",quote:"你们",reading:"nǐmen",sourceId:"zh-ni-demo"},
   toneCue:"The attested nǐmen includes a third-tone first syllable and an unmarked neutral second syllable; no audio is claimed."
  },
  chineseDepth:{
   guidedRepair:{
    question:"The representative says 'we' while intending to address the other group. Which original source item corrects the addressee?",
    correctQuote:"你们",wrongQuote:"我们",
    feedback:"我们 (wǒmen) refers to a group including the speaker. The addressed visitors are 你们 (nǐmen)."
   },
   readingRepair:{
    context:"A new representative takes the floor in a shared classroom. The question asks only for the word naming this individual speaker, not either group.",
    question:"Which exact original source snippet identifies the individual who now speaks?",
    correctQuote:"我",wrongQuote:"我们",
    feedback:"我 (wǒ) denotes the individual speaker. 我们 (wǒmen) includes their group rather than identifying only this person."
   },
   writingTransfer:{
    instruction:"Rewrite the orientation after a second student takes the microphone. Make each speaker's first-person group and each addressed group explicit in a newly composed Chinese exchange.",
    criteria:["Label the speaker each time before using first-person language.","Reassign 我们 when a new speaker's group becomes the subject.","Keep the original source quote and your authored dialogue distinct."]
   }
  },
  chineseReconstruction:{
   reconstruct:{
    instruction:"Type the full attested plural second-person Hanzi item to address several visitors, rather than the first-person group.",quote:"你们",sourceId:"zh-ni-demo",wrongQuote:"我们",
    feedback:"你们 addresses several listeners. 我们 would include the current speaker and belongs to a different role."
   },
   changedContext:{
    context:"In a changed welcome scene, the visiting representative is now talking about their own three teammates, not addressing the original hosts.",
    question:"Which exact source word now refers to the visiting representative's own team?",
    correctQuote:"我们",wrongQuote:"你们",
    feedback:"The visiting representative now speaks for their own group, so 我们 is correct. 你们 addresses the listener instead."
   },
   independentDialogue:{
    instruction:"Write an independently authored exchange in which a teacher asks one representative to address both groups in a different order. Explain whose group is included in every 我们.",
    criteria:["Identify every speaker and their own team.","Correctly distinguish singular 我 from plural 我们.","Use 你们 only to address the other listeners; never claim source-dialogue authenticity."]
   }
  },
  chineseSequence:sequence(
   {instruction:"Arrange the three unchanged original source words as evidence for a newly authored orientation: first name the individual speaker, then their own group, then the visiting listeners. These words are not a source transcript.",
    tokens:["你们","我","我们"],expected:["我","我们","你们"],misconception:["你们","我们","我"],
    feedback:"Starting with 你们 addresses the visitors before the intended speaker and their group have been identified. The authored sequence starts with 我, then 我们, then 你们."},
   {context:"After the initial orientation, a visiting representative takes over. Now the host requests a single term for the group being addressed by that visiting representative.",
    question:"Which original source expression points to listeners, regardless of which team they belong to?",
    correctQuote:"你们",wrongQuote:"我们",
    feedback:"你们 names plural listeners in the new turn. 我们 would include whichever representative is currently speaking."},
   {instruction:"Write a fourth, entirely new short exchange in which the original guest becomes the host for a later orientation. Track speaker changes, own-team references and addressed visitors without treating any invented turn as a source quotation.",
    criteria:["Introduce the changed host and visiting speakers clearly.","Use 我, 我们 and 你们 with consistent perspective after each reversal.","Separate authentic source words from any newly authored conversational sentences."]}
  )
 },
 {
  ...parents[2]!,
  id:"zh:phase28-market-tea-and-fruit",
  title:"Sequencing a tea question and a fruit description",
  objective:"Arrange authentic greeting, tea question and apple description for a new snack-counter exchange, then select a source phrase when the host's goal changes.",
  explanation:"你好 (nǐ hǎo) greets the guest, 你喜欢喝茶吗？ (Nǐ xǐhuan hē chá ma?) asks about tea, and 这个苹果很好吃。 (Zhège píngguǒ hěn hǎochī.) describes a particular apple. This sequence is a newly authored practice situation, not an attested source conversation.",
  transferSituation:"At a market stall, the host first greets a visitor, asks a tea preference, then describes an apple. Later a returning buyer has already greeted the host and only wants to discuss the apple.",
  writingInstruction:"Author a new market-stall interaction in which the host's purpose changes from greeting to asking a question to describing fruit. Label which phrases are exact source quotations and which turns you wrote.",
  reflection:"How does the question particle 吗 distinguish a guest-facing preference question from a sentence describing this apple?",
  writingChecks:["Start a first-contact interaction with the original greeting 你好.","Preserve the final 吗 in the original tea question.","Use the exact apple statement to describe a specific fruit and not to ask about a drink."],
  guidedQuestion:"Which complete original expression asks whether the visitor likes drinking tea?",
  guidedAnswer:"你喜欢喝茶吗？",
  independentQuestion:"Which original expression explicitly describes the taste of this particular apple?",
  independentAnswer:"这个苹果很好吃。",
  chineseExpansion:{
   ...parents[2]!.chineseExpansion!,
   grammarHeading:"Ordering a greeting, a yes/no question and a declarative description",
   grammarExplanation:"The original fragments have different grammatical functions. 你好 greets; 你喜欢喝茶吗？ ends with the question particle 吗; 这个苹果很好吃。 describes this apple with 很 before the adjective. Sequencing them in practice never implies the repository recorded that conversation.",
   contrastCue:"A meaningful new conversation first establishes contact, then asks about tea, then makes a distinct statement about an apple.",
   cloze:{instruction:"Restore the final question particle in the attested tea-preference sentence.",quote:"你喜欢喝茶吗？",before:"你喜欢喝茶",answer:"吗",after:"？",sourceId:"zh-ni-demo"},
   situationalChoice:{question:"A returning buyer asks only about the apple's taste. Which complete original statement responds to that request?",correctQuote:"这个苹果很好吃。"},
   dialogueBrief:"Write additional guest and host turns independently and mark all new writing as authored rather than source-copied.",
   tone:{question:"Type the original tone-marked Pinyin for the complete tea question.",quote:"你喜欢喝茶吗？",reading:"Nǐ xǐhuan hē chá ma?",sourceId:"zh-ni-demo"},
   toneCue:"Use exact attested marks on Nǐ, xǐ, hē, chá, and unmarked ma rather than unaccented Latin-only approximation."
  },
  chineseDepth:{
   guidedRepair:{
    question:"The host wants to greet the new customer but instead quotes a question about tea. Which original expression fits the arrival greeting?",
    correctQuote:"你好",wrongQuote:"你喜欢喝茶吗？",
    feedback:"The tea sentence asks about a drink and ends with 吗. 你好 (nǐ hǎo) is the original greeting used when contact begins."
   },
   readingRepair:{
    context:"After the visitor has selected tea, they ask specifically whether this apple is delicious. The original tea question does not answer the fruit question.",
    question:"Which attested statement identifies the apple and describes its taste?",
    correctQuote:"这个苹果很好吃。",wrongQuote:"你喜欢喝茶吗？",
    feedback:"The tea question contains 喝茶 and final 吗; the attested apple statement names 这个苹果 and says it is very tasty."
   },
   writingTransfer:{
    instruction:"Rewrite the counter exchange for a customer who already spoke to the host. Begin with the apple topic and use a tea question only if the visitor's drink preference is not yet known.",
    criteria:["Adjust the order of greeting and questions to the returning buyer.","Keep the question particle 吗 with the original tea form.","Distinguish original source text from independently authored responses."]
   }
  },
  chineseReconstruction:{
   reconstruct:{
    instruction:"Type the complete attested Hanzi tea question including the final question mark, not a declarative food-quality report.",quote:"你喜欢喝茶吗？",sourceId:"zh-ni-demo",wrongQuote:"这个苹果很好吃。",
    feedback:"The exact tea question ends with 吗？; 这个苹果很好吃。 is a separate statement about food quality."
   },
   changedContext:{
    context:"A new buyer reaches the stall. Before talking about tea or fruit, the host has only to greet that buyer.",
    question:"Which short original expression performs the first-contact greeting?",
    correctQuote:"你好",wrongQuote:"你喜欢喝茶吗？",
    feedback:"The visitor needs 你好 to open the interaction, not the full tea-preference question before contact is established."
   },
   independentDialogue:{
    instruction:"Compose a distinct, original stall dialogue with two visitors arriving at different times, specifying which visitor is being asked about tea and which is asking about fruit.",
    criteria:["Track different visitor arrival times and addressees.","Use a tea question only for the relevant preference request.","Keep the original apple statement as an independent description, not a source conversation."]
   }
  },
  chineseSequence:sequence(
   {instruction:"Arrange the three authentic but separately attested excerpts for a NEW authored stall scene: greet a buyer, ask about tea, and describe the apple. The resulting exchange is practice, not an original source transcript.",
    tokens:["这个苹果很好吃。","你好","你喜欢喝茶吗？"],
    expected:["你好","你喜欢喝茶吗？","这个苹果很好吃。"],
    misconception:["你好","这个苹果很好吃。","你喜欢喝茶吗？"],
    feedback:"The source apple statement is not a tea-preference question. In the authored scenario, greeting is followed by asking about tea and only then describing fruit."},
   {context:"In a changed stall scene the buyer has already chosen a drink and now requests an explicit report about the quality of this apple. The host should not restart the tea question.",
    question:"Which original excerpt supplies the requested complete apple-quality statement?",
    correctQuote:"这个苹果很好吃。",wrongQuote:"你喜欢喝茶吗？",
    feedback:"这个苹果很好吃。 identifies and describes an apple; 你喜欢喝茶吗？ instead asks whether the visitor likes tea."},
   {instruction:"Create a fourth source-aware market dialogue in which a returning customer discusses an apple first, then a new visitor arrives and is greeted. Explain why the speaking order has changed while the source excerpts stay exact.",
    criteria:["Give the returning visitor and new visitor different conversational purposes.","Distinguish the original question about tea from the declarative apple line.","Explicitly identify quoted original Hanzi versus your own new dialogue."]}
  )
 },
 {
  ...parents[1]!,
  id:"zh:phase28-student-teacher-repair-order",
  encounters:[
   parents[1]!.encounters[0],
   parents[1]!.encounters[1],
   {lessonId:"zh:shi:shared-pilot",sourceId:"zh-shi-demo",quote:"不是"}
  ],
  title:"Ordering identity statements before a role correction",
  objective:"Use exact first-person and third-person identity statements to reconstruct a new orientation sequence and correct a mistaken role without inventing source content.",
  explanation:"我是学生。 (Wǒ shì xuésheng.) is a statement about the speaker. 他是老师。 (Tā shì lǎoshī.) describes another person as teacher. 不是 (bú shì) denies an identity claim. Their sequence below is an original practice construction, not a copied Chinese conversation.",
  transferSituation:"A new visitor encounters a student, meets the nearby teacher and finally realizes they had mistakenly assigned the teacher's role to the student.",
  writingInstruction:"Write an original orientation dialogue about a student and teacher. Identify each speaker and explain what is being corrected, without treating 不是 as a fully attested negative sentence of its own.",
  reflection:"Why must the learner distinguish the subject of each identity statement before using the source negation form 不是?",
  writingChecks:["Attribute 我是学生。 to the current speaker, not a third party.","Use 他是老师。 to identify the nearby teacher.","Explain how 不是 negates a mistaken identity, without inventing a source verbatim correction sentence."],
  guidedQuestion:"Which complete original statement identifies another person as a teacher?",
  guidedAnswer:"他是老师。",
  independentQuestion:"Which complete source sentence identifies the speaker as student?",
  independentAnswer:"我是学生。",
  chineseExpansion:{
   ...parents[1]!.chineseExpansion!,
   grammarHeading:"First-person and third-person identity precede a specific correction",
   grammarExplanation:"The original first-person statement begins with 我; the original third-person teacher sentence begins with 他. The source form 不是 means is not. The different subject references must be interpreted before the correction can be meaningful.",
   contrastCue:"Distinguish who is being described by 我是学生。 and 他是老师。 first, then recognize 不是 as denial of a mistaken role.",
   cloze:{instruction:"Reconstruct the original copula in the first-person student sentence.",quote:"我是学生。",before:"我",answer:"是",after:"学生。",sourceId:"zh-wo-demo"},
   situationalChoice:{question:"Which attested short form signals denial of an incorrectly attributed identity?",correctQuote:"不是"},
   dialogueBrief:"Create new learner dialogue in the visitor's context, with explicit subjects instead of presenting original fragments as a full conversation.",
   tone:{question:"Type the exact source Pinyin for the teacher sentence 他是老师。.",quote:"他是老师。",reading:"Tā shì lǎoshī.",sourceId:"zh-shi-demo"},
   toneCue:"The source writes Tā shì lǎoshī. with the exact tonal diacritics and no recorded speech grade."},
  chineseDepth:{
   guidedRepair:{
    question:"The visitor wants to identify the teacher but quotes the sentence saying 'I am a student.' Which original statement names the teacher instead?",
    correctQuote:"他是老师。",wrongQuote:"我是学生。",
    feedback:"我是学生。 describes the speaker as a student. 他是老师。 is the attested third-person teacher statement."
   },
   readingRepair:{
    context:"A new learner is speaking on their own behalf and is asked for an explicit student-identity statement, not the statement about someone else's profession.",
    question:"Which exact original line identifies the person speaking as a student?",
    correctQuote:"我是学生。",wrongQuote:"他是老师。",
    feedback:"The first-person sentence begins with 我. The other line begins with 他 and describes a teacher."
   },
   writingTransfer:{
    instruction:"Rewrite the orientation from the visiting learner's perspective, emphasizing who is student and who is teacher before repairing a mistaken identity.",
    criteria:["Mark subject changes between 我 and 他.","Treat the bare source 不是 as a negation form, not a complete quoted dialogue.","Use exact quotes only for attested source fragments."]
   }
  },
  chineseReconstruction:{
   reconstruct:{
    instruction:"Type the complete original student self-identity sentence, including final punctuation.",quote:"我是学生。",sourceId:"zh-wo-demo",wrongQuote:"他是老师。",
    feedback:"The original student statement begins with 我, not the teacher's third-person pronoun 他."
   },
   changedContext:{
    context:"In a changed orientation, someone points at the teacher rather than the student. The listener needs an attested sentence about the other person.",
    question:"Which original sentence identifies the teacher by a third-person subject?",
    correctQuote:"他是老师。",wrongQuote:"我是学生。",
    feedback:"The third-person teacher claim is 他是老师。. 我是学生。 is about the person speaking."
   },
   independentDialogue:{
    instruction:"Write a third learner-owned conversation in which the staff member mistakenly calls the student a teacher and another visitor clarifies both people's roles.",
    criteria:["Label each person and keep the subject pronouns consistent.","Identify the mistaken role before using the meaning of 不是.","Keep composed replies clearly separate from the source's exact words."]
   }
  },
  chineseSequence:sequence(
   {instruction:"Arrange three unchanged source excerpts as evidence for a NEW orientation situation: identify the speaker as student, identify a third person as teacher, then show the short form used to deny the earlier mistaken role.",
    tokens:["不是","他是老师。","我是学生。"],
    expected:["我是学生。","他是老师。","不是"],
    misconception:["他是老师。","我是学生。","不是"],
    feedback:"The authored orientation begins with the student's own identity, then identifies the nearby teacher. Starting with 他是老师。 confuses which person first introduced themselves."},
   {context:"A second visitor arrives after the role error has been corrected. This visitor only asks who the teacher is, and the answer should identify someone other than the speaker.",
    question:"Which exact original source sentence now identifies the teacher?",
    correctQuote:"他是老师。",wrongQuote:"我是学生。",
    feedback:"他是老师。 is a third-person teacher statement. 我是学生。 refers only to the person speaking as student."},
   {instruction:"Write a fourth new classroom dialogue in which the visitor knows the teacher already but confuses another student's role. Revise the sequence to address only the genuine confusion.",
    criteria:["Identify all speakers and the role assigned to each person.","Use positive identity statements before or after a denial only where appropriate.","Do not fabricate an original quoted correction sentence from the standalone 不是 form."]}
  )
 },
 {
  ...parents[3]!,
  id:"zh:phase28-badge-role-correction",
  title:"Separating badge ownership, denial and shared identity",
  objective:"Sequence a first-person possessive expression, a negated role and an added shared identity while the badge holder or speaker changes.",
  explanation:"我的 (wǒ de) marks possession, 不是 (bú shì) denies an identity and 也是 (yě shì) adds also-is. The original source certifies these individual orthographic expressions as editorial demos; the badge office sequence is newly authored learner practice.",
  transferSituation:"At a reception desk, a visitor claims a badge, corrects a mistaken role and learns that another visitor holds the same role. A second desk clerk asks the same questions in a different order.",
  writingInstruction:"Write a newly authored service-desk exchange in which a visitor identifies a badge, denies a mistaken role and confirms another person's shared role; label exact source phrases separately.",
  reflection:"Which relationship is about possession, which about an identity being false, and which about a second person with the same identity?",
  writingChecks:["Use 我的 to express possession by the current speaker.","Use 不是 to indicate a mistaken role has been denied.","Explain how 也是 adds identity rather than changing the owner of the badge."],
  guidedQuestion:"Which original expression means that the badge or item belongs to the person speaking?",
  guidedAnswer:"我的",
  independentQuestion:"Which original expression explicitly denies an identity claim?",
  independentAnswer:"不是",
  chineseExpansion:{
   ...parents[3]!.chineseExpansion!,
   grammarHeading:"Three independent grammatical functions at reception",
   grammarExplanation:"我的 (wǒ de) contains the possessive particle 的. 不是 (bú shì) is identity denial, while 也是 (yě shì) indicates additional identity. The three attested forms remain distinct even when learner-authored reception dialogue sequences them.",
   contrastCue:"Read each original expression for its function in the new sequence: ownership does not deny a role, and a second shared role does not own the item.",
   cloze:{instruction:"Reconstruct the complete first-person possessive form, preserving the neutral-tone 的 in the source reading.",quote:"我的",before:"我",answer:"的",after:"",sourceId:"zh-wo-demo"},
   situationalChoice:{question:"A second visitor has the same role as a first visitor. Which original short form expresses 'also is'?",correctQuote:"也是"},
   dialogueBrief:"Write new clerk/visitor turns in your own words while retaining exact originals only when they are specifically quoted.",
   tone:{question:"Type the original tone-marked reading of 不是, the negated identity form.",quote:"不是",reading:"bú shì",sourceId:"zh-shi-demo"},
   toneCue:"The attested written source has bú shì with contextual tone change on 不 and explicit tone on 是."},
  chineseDepth:{
   guidedRepair:{
    question:"A visitor is asked to deny an incorrect job title but instead gives a possessive expression. Which attested form performs the denial?",
    correctQuote:"不是",wrongQuote:"我的",
    feedback:"我的 identifies possession of an item. 不是 (bú shì) is the source-backed form for denying the wrong identity."
   },
   readingRepair:{
    context:"In a new conversation the badge is already identified. A visitor adds that another colleague shares the same role, rather than rejecting it.",
    question:"Which original source form indicates additional agreement about an identity?",
    correctQuote:"也是",wrongQuote:"不是",
    feedback:"不是 negates an identity. 也是 adds that the same identity also applies to another person."
   },
   writingTransfer:{
    instruction:"Rewrite the dialogue when a different visitor claims the badge, making the possessive refer to the new speaker and separating it from the role correction.",
    criteria:["Identify the changed badge owner and speaker.","Keep role denial and role addition as separate communicative acts.","Explain source expressions without inventing a verbatim source conversation."]
   }
  },
  chineseReconstruction:{
   reconstruct:{
    instruction:"Type the original complete Hanzi expression for first-person possession, not a role denial.",quote:"我的",sourceId:"zh-wo-demo",wrongQuote:"不是",
    feedback:"The attested 我的 indicates my/mine. 不是 is a negated identity, not a marker for possession."
   },
   changedContext:{
    context:"The owner has been identified and the clerk asks whether the originally assigned role is false. The question is no longer about an item.",
    question:"Which exact attested expression denies the role?",
    correctQuote:"不是",wrongQuote:"我的",
    feedback:"Because the new question asks whether an identity is incorrect, the answer is 不是. 我的 only concerns whose item it is."
   },
   independentDialogue:{
    instruction:"Create a third independently authored reception exchange involving a badge owner, a clerk and a colleague with a matching role. Explain each source-backed function.",
    criteria:["Keep the badge ownership tied to the current speaker.","Give denial and addition different, correct communicative roles.","Label original source snippets as quotations and new dialogue as learner writing."]
   }
  },
  chineseSequence:sequence(
   {instruction:"Arrange these three original but separately sourced expressions for a NEW service-desk practice sequence: first identify a badge as yours, next deny an incorrect role, then say another role also applies.",
    tokens:["不是","也是","我的"],
    expected:["我的","不是","也是"],
    misconception:["我的","也是","不是"],
    feedback:"The authored service-desk case denies the mistaken role before adding a shared one. 也是 adds another identity and should not replace 不是 for the correction."},
   {context:"After the clerk has corrected the role, another visitor arrives with the same job. The clerk no longer needs to reject an incorrect identity, only to recognize an added matching identity.",
    question:"Which original source form now expresses additional shared identity?",
    correctQuote:"也是",wrongQuote:"不是",
    feedback:"The new scene adds an additional role using 也是, not the negation 不是 that would reject the identity."},
   {instruction:"Write a fourth distinct original badge-office exchange after the owner and clerk have exchanged speaking roles. Include ownership, an incorrect role and a genuine shared role without treating short source items as complete dialogues.",
    criteria:["Identify which visitor's possession is marked by 我的 after the role change.","Correct a mistaken identity explicitly before adding any shared identity.","Keep every original source phrase distinct from newly authored dialogue and make no official language-level claim."]}
  )
 }
] as const;
