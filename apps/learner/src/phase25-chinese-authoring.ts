import type {SourceAuthoredIntake,PinnedSourceQuote} from "./source-intake.ts";
const q=(lessonId:string,sourceId:string,quote:string):PinnedSourceQuote=>({lessonId,sourceId,quote});
const greet="zh:ni-hao:shared-pilot",self="zh:wo:shared-pilot",identity="zh:shi:shared-pilot";
const ni="zh-ni-demo",hao="zh-hao-demo",wo="zh-wo-demo",shi="zh-shi-demo";
/** Internal only: all Hanzi and tone-marked readings are attested at Chinese 9688e735.
 * Situations and dialogue prompts are newly authored, never alleged native source transcripts. */
export const PHASE25_CHINESE_AUTHORING:readonly SourceAuthoredIntake[]=[
 {
  id:"zh:phase25-greeting-addressee",languageId:"zh",title:"Greeting one person or addressing a group",
  objective:"Distinguish the original singular greeting 你好, plural pronoun 你们 and speaker pronoun 我 without confusing addressee with speaker.",
  explanation:"你好 combines 你 and 好 as a greeting to an addressee. 你们 refers to multiple people addressed, while 我 identifies the speaker. The original inventory attests 你好 and 你们 separately; a composed group greeting must not be represented as a copied original source line.",
  transferSituation:"In a study group, greet one incoming learner, address several learners, and then identify yourself. Make the audience explicit instead of just recycling a single line.",
  writingInstruction:"Write an original three-turn beginner Mandarin exchange with one addressee, a group of addressees and the speaker. Use attested Hanzi where possible, and explain in English which pronouns are singular, plural and first person.",
  reflection:"How do 你, 你们 and 我 change the role of the person being referred to?",
  writingChecks:["Use 你好 only as the attested singular greeting and distinguish the target addressee.","Use 你们 to identify a plural group of listeners without claiming a new quote came from the source.","Use 我 to identify the speaker, not the people addressed."],
  encounters:[q(greet,ni,"你好"),q(greet,ni,"你们"),q(self,wo,"我")],
  guidedQuestion:"Which attested original expression greets one addressee?",guidedAnswer:"你好",
  independentQuestion:"Which original source item refers to plural addressees?",independentAnswer:"你们",
  chineseExpansion:{
   grammarHeading:"Person and plurality are independent meanings",
   grammarExplanation:"The source gives 你 in 你好 (nǐ hǎo), 你们 (nǐmen) for plural addressees and 我 (wǒ) for the speaker. The suffix 们 marks plurality of people in this original example. Tone-marked Pinyin identifies written syllables, not measured speaking accuracy.",
   contrastCue:"Compare 你好 (nǐ hǎo) with 你们 (nǐmen): one greets a person, while the other names more than one addressee.",
   cloze:{instruction:"Reconstruct the original attested singular greeting.",quote:"你好",before:"你",answer:"好",after:"",sourceId:ni},
   situationalChoice:{question:"Addressing several learners instead of one: which source item names the plural addressees?",correctQuote:"你们"},
   dialogueBrief:"Separate first-person speaker and second-person listeners across original short speaking turns; note when you have composed rather than quoted a line.",
   tone:{question:"Type the original tone-marked Pinyin for the singular greeting 你好.",quote:"你好",reading:"nǐ hǎo",sourceId:ni},
   toneCue:"Preserve the diacritic in both nǐ and hǎo; plain ni hao is not the attested tone-marked reading."
  }
 },
 {
  id:"zh:phase25-self-and-group",languageId:"zh",title:"Introducing the speaker and the study group",
  objective:"Distinguish first-person singular 我, inclusive plural 我们 and the original complete identity sentence 我是学生。",
  explanation:"我 is I; 我们 is we/us, containing the group-forming 们. 我是学生。 makes a complete nominal identity statement with 是. Treat the source's pinyin wǒ, wǒmen and Wǒ shì xuésheng. as orthographic evidence, not audio or pronunciation marks.",
  transferSituation:"A classmate asks whether you joined alone or are speaking on behalf of a study group. Then you explain who is a student.",
  writingInstruction:"Compose two original learner exchanges about arriving alone versus as part of a group, then write one identity sentence and explain why 我们 is not equivalent to 我.",
  reflection:"When does the listener learn that a group, not one person, is being discussed?",
  writingChecks:["Keep 我 as first-person singular when only you speak for yourself.","Use 我们 when describing a group that includes you.","Model a complete noun-identity statement on the attested 我是学生。 pattern without implying official HSK credit."],
  encounters:[q(self,wo,"我"),q(self,wo,"我们"),q(self,wo,"我是学生。")],
  guidedQuestion:"Which original item names the speaker together with a group?",guidedAnswer:"我们",
  independentQuestion:"Which source expression forms a complete statement that the speaker is a student?",independentAnswer:"我是学生。",
  chineseExpansion:{
   grammarHeading:"Pronoun plus 是 plus a noun phrase",
   grammarExplanation:"The short source item 我 (wǒ) marks one first-person speaker. Adding 们 produces 我们 (wǒmen), a first-person plural pronoun. In the complete attested line 我是学生。, 是 (shì) connects the first-person subject to a noun identity; do not translate 们 as the verb 是.",
   contrastCue:"Compare 我 (wǒ) and 我们 (wǒmen) to recognize plurality; the complete 我是学生。 adds a predicate.",
   cloze:{instruction:"Complete the original first-person student identity sentence.",quote:"我是学生。",before:"我",answer:"是",after:"学生。",sourceId:wo},
   situationalChoice:{question:"Which exact source line states that the speaker is a student?",correctQuote:"我是学生。"},
   dialogueBrief:"Write new group-introduction dialogue in your own context; separate pronoun choice from the content of the identity predicate.",
   tone:{question:"Type the original tone-marked Pinyin of 我们, the first-person plural pronoun.",quote:"我们",reading:"wǒmen",sourceId:wo},
   toneCue:"Preserve the third tone mark in wǒ and the original unmarked neutral syllable men."
  }
 },
 {
  id:"zh:phase25-possession-and-role",languageId:"zh",title:"Possession and identifying a teacher",
  objective:"Differentiate 我的 as possessive, 我是学生。 as self-identity and 他是老师。 as a third-person identity.",
  explanation:"我的 means my/mine. 我是学生。 is a complete statement that the speaker is a student. 他是老师。 describes a teacher other than the speaker. The linking verb 是 is attested in both original identity sentences.",
  transferSituation:"At enrollment, identify your belongings, describe yourself as a learner and indicate a teacher. Keep the persons being referred to separate.",
  writingInstruction:"Write a short original Mandarin registration dialogue about your own item, your student role and a teacher's role, and explain in English which expression marks possession instead of identity.",
  reflection:"Why can 我的 not replace 我是学生。 when the intention is to state an identity?",
  writingChecks:["Treat 我的 as a possessive expression, not a complete sentence stating a profession.","Use the attested first-person 是 identity form as a pattern.","Recognize 他 as third-person when identifying a teacher."],
  encounters:[q(self,wo,"我的"),q(self,wo,"我是学生。"),q(identity,shi,"他是老师。")],
  guidedQuestion:"Which attested expression marks first-person possession rather than role?",guidedAnswer:"我的",
  independentQuestion:"Which source sentence identifies another person as a teacher?",independentAnswer:"他是老师。",
  chineseExpansion:{
   grammarHeading:"的 marks possession, 是 links identity",
   grammarExplanation:"In 我的 (wǒ de), 的 (de) is a neutral-tone possessive particle. 我是学生。 contains 是 (shì), connecting a person to a noun identity. 他是老师。 changes the subject to the third-person pronoun 他 (tā). Do not conflate the particles 的 and 是.",
   contrastCue:"Compare 我的 and 我是学生。: the former indicates possession while the latter is a subject-predicate statement.",
   cloze:{instruction:"Reconstruct the possessive expression, not the identity verb.",quote:"我的",before:"我",answer:"的",after:"",sourceId:wo},
   situationalChoice:{question:"Which original complete sentence identifies the other person as a teacher?",correctQuote:"他是老师。"},
   dialogueBrief:"Keep the speaker and third-person teacher clearly identified in new speaking turns, and label novel vocabulary as your own writing.",
   tone:{question:"Type the exact tone-marked source Pinyin for the possessive expression 我的.",quote:"我的",reading:"wǒ de",sourceId:wo},
   toneCue:"Keep the mark on wǒ and leave de neutral, matching the original source reading."
  }
 },
 {
  id:"zh:phase25-affirm-negate-also",languageId:"zh",title:"Identity, negation and also",
  objective:"Differentiate the attested identity marker 是, negated identity 不是 and addition 也是 using literal source forms.",
  explanation:"是 is the linking verb used for noun identity; 不是 negates that relation, and 也是 adds also. The original source writes the negated expression with the context reading bú shì, displaying the tone change of 不 before fourth-tone 是.",
  transferSituation:"Two classmates compare their roles. One identifies someone, another corrects an incorrect assumption, and a third says that the same role also applies.",
  writingInstruction:"Write an original three-turn role-identification exchange distinguishing a positive statement, a correction and an also-identity statement. Explain which part denies a claim and which part adds another matching person.",
  reflection:"How does adding 不 versus 也 change the meaning of 是?",
  writingChecks:["Use 是 to link a person to a noun identity, not as an English all-purpose auxiliary.","Explain 不是 as a negation and do not silently drop 不.","Use 也是 for additionally shared identity, distinct from disagreement."],
  encounters:[q(identity,shi,"是"),q(identity,shi,"不是"),q(identity,shi,"也是")],
  guidedQuestion:"Which attested expression denies the identity statement?",guidedAnswer:"不是",
  independentQuestion:"Which original expression means 'also is'?",independentAnswer:"也是",
  chineseExpansion:{
   grammarHeading:"不 before fourth-tone 是 and the separate addition 也",
   grammarExplanation:"The source gives 是 (shì), 不是 (bú shì) and 也是 (yě shì). Bú here illustrates the contextual change of 不 before shì; it must not be mistaken for a new independently attested spoken recording. 也 adds 'also' whereas 不 denies the identity claim.",
   contrastCue:"Compare 是 (shì) with 不是 (bú shì); negation changes the proposition, while 也是 signals additional agreement.",
   cloze:{instruction:"Complete the original negated form of the identity verb.",quote:"不是",before:"不",answer:"是",after:"",sourceId:shi},
   situationalChoice:{question:"Which original form adds the meaning 'also' rather than denying an identity?",correctQuote:"也是"},
   dialogueBrief:"Use original short forms in a new conversational context, and keep correct, denied and additional identity claims distinct.",
   tone:{question:"Type the original source Pinyin for 不是, including the contextual tone mark.",quote:"不是",reading:"bú shì",sourceId:shi},
   toneCue:"The source writes bú shì; preserve both tone marks and do not substitute unmarked bu shi."
  }
 },
 {
  id:"zh:phase25-greeting-tea-question",languageId:"zh",title:"Greeting and asking about tea",
  objective:"Distinguish 你好 as an opening, 好吃 as a taste description and the source question 你喜欢喝茶吗？ as a question about tea.",
  explanation:"你好 is a greeting, while 好吃 evaluates food as tasty. In 你喜欢喝茶吗？, the pronoun 你 and final 吗 mark a question asking about a person's preference for drinking tea. A description of food does not answer that question by itself.",
  transferSituation:"At a small café, greet a new guest, ask if the guest likes tea and respond to a separate comment about the taste of an apple.",
  writingInstruction:"Write an original short café dialogue with a greeting, a question about tea and a separate food-quality observation. Explain why 好吃 cannot itself replace a yes/no question about drinking tea.",
  reflection:"Where does the source put 吗 when asking about a preference, and how does that differ from an adjective?",
  writingChecks:["Use 你好 to greet the guest before asking questions.","Preserve 吗 at the end of the attested tea-preference question.","Use 好吃 to evaluate food rather than as a question word."],
  encounters:[q(greet,ni,"你好"),q(greet,ni,"你喜欢喝茶吗？"),q(greet,hao,"好吃")],
  guidedQuestion:"Which original source item is the simple greeting?",guidedAnswer:"你好",
  independentQuestion:"Which complete source line asks about drinking tea?",independentAnswer:"你喜欢喝茶吗？",
  chineseExpansion:{
   grammarHeading:"A final 吗 marks the attested yes/no question",
   grammarExplanation:"The source question 你喜欢喝茶吗？ (Nǐ xǐhuan hē chá ma?) asks whether someone likes drinking tea. 吗 (ma) is the question particle. 好吃 (hǎochī) means tasty; it is not another tea question. 你好 (nǐ hǎo) serves as the greeting.",
   contrastCue:"Compare the greeting 你好 with 你喜欢喝茶吗？. A greeting addresses the visitor; the full sentence asks about a preference.",
   cloze:{instruction:"Supply the attested yes/no question particle in the original tea question.",quote:"你喜欢喝茶吗？",before:"你喜欢喝茶",answer:"吗",after:"？",sourceId:ni},
   situationalChoice:{question:"You need to ask whether a guest likes drinking tea. Which source line is the question?",correctQuote:"你喜欢喝茶吗？"},
   dialogueBrief:"Separate arrival, polite question and food-comment turns. Do not invent a claimed original answer to the tea question.",
   tone:{question:"Type the complete tone-marked original reading of 你喜欢喝茶吗？.",quote:"你喜欢喝茶吗？",reading:"Nǐ xǐhuan hē chá ma?",sourceId:ni},
   toneCue:"Preserve the exact source marks on Nǐ, xǐ, hē and chá; the question particle ma is unmarked."
  }
 },
 {
  id:"zh:phase25-hello-taste-apple",languageId:"zh",title:"Greeting and describing a tasty apple",
  objective:"Distinguish greeting 你好, adjective 好吃 and the attested full apple statement 这个苹果很好吃。",
  explanation:"好 appears inside the greeting 你好 but 好吃 is an expression for something tasty. The complete 这个苹果很好吃。 describes an apple and includes 很 in a quality statement; it is not a greeting or a yes/no question.",
  transferSituation:"You welcome a friend to a snack table, mention a tasty fruit and explain which apple you are talking about.",
  writingInstruction:"Write an original three-turn snack-table dialogue with a greeting, an expression about taste and a complete apple-description sentence. Explain which source expression refers to the listener and which refers to the apple.",
  reflection:"Why should the short greeting 你好 not be used as a description of apple taste?",
  writingChecks:["Use 你好 for the friend being greeted.","Use 好吃 for taste, not as a generic greeting.","Anchor the apple statement in the attested 这个苹果很好吃。 without treating the authored dialogue as an original transcript."],
  encounters:[q(greet,ni,"你好"),q(greet,hao,"好吃"),q(greet,hao,"这个苹果很好吃。")],
  guidedQuestion:"Which original item directly describes something as tasty?",guidedAnswer:"好吃",
  independentQuestion:"Which original complete sentence evaluates an apple's taste?",independentAnswer:"这个苹果很好吃。",
  chineseExpansion:{
   grammarHeading:"Describing a quality is not greeting an addressee",
   grammarExplanation:"你好 (nǐ hǎo) is used in a greeting, while 好吃 (hǎochī) means tasty. The original 这个苹果很好吃。 (Zhège píngguǒ hěn hǎochī.) uses 这个 to point to this apple and 很 before the adjective phrase. Keep the speaker's original written words distinct from authored follow-up dialogue.",
   contrastCue:"Compare 你好 and 好吃: the shared character 好 does not make these interchangeable in a conversation.",
   cloze:{instruction:"Complete the original full sentence about the apple's taste.",quote:"这个苹果很好吃。",before:"这个苹果很",answer:"好吃",after:"。",sourceId:hao},
   situationalChoice:{question:"Which attested complete source sentence specifically describes this apple as delicious?",correctQuote:"这个苹果很好吃。"},
   dialogueBrief:"Write new speaking turns for a guest and host. Preserve the source's exact Hanzi only when quoting the original.",
   tone:{question:"Type the attested full Pinyin of 这个苹果很好吃。, including source tone marks.",quote:"这个苹果很好吃。",reading:"Zhège píngguǒ hěn hǎochī.",sourceId:hao},
   toneCue:"Preserve the source's full tone-marked Pinyin, including Zhège, píngguǒ, hěn and hǎochī."
  }
 }
] as const;
