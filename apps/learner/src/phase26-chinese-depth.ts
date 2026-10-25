import type {SourceAuthoredIntake,PinnedSourceQuote} from "./source-intake.ts";

const q=(lessonId:string,sourceId:string,quote:string):PinnedSourceQuote=>({lessonId,sourceId,quote});
const greet="zh:ni-hao:shared-pilot",self="zh:wo:shared-pilot",identity="zh:shi:shared-pilot";
const ni="zh-ni-demo",hao="zh-hao-demo",wo="zh-wo-demo",shi="zh-shi-demo";

/** Phase 26 extends the original source-pinned authoring compiler.
 * Original phrases are exact DEMO_ONLY receipts; every scene and dialogue is newly authored.
 * These internal previews do not claim audio, official HSK, or independently reviewed competence. */
export const PHASE26_CHINESE_DEPTH:readonly SourceAuthoredIntake[]=[
 {
  id:"zh:phase26-tea-cafe-visitor",languageId:"zh",title:"Reading a café greeting and tea request",
  objective:"Interpret arrival, a guest's tea-preference question and a separate assessment of taste without mistaking one for another.",
  explanation:"At a café, 你好 opens contact, 你喜欢喝茶吗？ asks about liking tea and 好吃 evaluates food. The written source phrases are real, but their order here is an independently authored practice scenario, not an original recorded conversation.",
  transferSituation:"A visitor greets a café host, considers a tea order and then comments on a snack; later a different guest asks about tea before greeting.",
  writingInstruction:"Create two short original Chinese dialogue exchanges: one between a guest and host at arrival, and another after the guest tries a snack. Keep the question about tea distinct from the comment on food.",
  reflection:"When must the conversation switch from greeting someone to asking about a preference, and why can 好吃 not answer a tea question by itself?",
  writingChecks:["Use 你好 (nǐ hǎo) as a contact opening rather than an evaluation of food.","Preserve 吗 and the original question meaning when discussing tea.","Use 好吃 (hǎochī) only in the taste context; explain any new authored vocabulary."],
  encounters:[q(greet,ni,"你好"),q(greet,ni,"你喜欢喝茶吗？"),q(greet,hao,"好吃")],
  guidedQuestion:"A guest is asked whether they like tea. Which exact original utterance poses that preference question?",
  guidedAnswer:"你喜欢喝茶吗？",
  independentQuestion:"Before asking about the menu, which source expression greets the arriving customer?",
  independentAnswer:"你好",
  chineseExpansion:{
   grammarHeading:"A greeting, yes/no question and evaluative adjective",
   grammarExplanation:"The source distinguishes 你好 (nǐ hǎo) as a greeting, 你喜欢喝茶吗？ (Nǐ xǐhuan hē chá ma?) as a yes/no question marked by final 吗 and 好吃 (hǎochī) as a positive food-quality description. These cannot be swapped simply because they are familiar characters.",
   contrastCue:"Read the whole tea question rather than matching the shared character 好 to a greeting or taste expression.",
   cloze:{instruction:"Restore the attested question particle at the end of the original tea-preference question.",quote:"你喜欢喝茶吗？",before:"你喜欢喝茶",answer:"吗",after:"？",sourceId:ni},
   situationalChoice:{question:"After eating a snack, the visitor wishes to describe it as tasty. Which original expression serves that purpose?",correctQuote:"好吃"},
   dialogueBrief:"Write source-aware, independent café turns with clear speakers. Keep self-created replies separate from exact pinned source quotations.",
   tone:{question:"Type the exact attested tone-marked Pinyin for the complete tea question, including unmarked ma.",quote:"你喜欢喝茶吗？",reading:"Nǐ xǐhuan hē chá ma?",sourceId:ni},
   toneCue:"Nǐ, xǐhuan, hē and chá retain the source diacritics; ma is written without an accent and no spoken score follows."},
  chineseDepth:{
   guidedRepair:{
    question:"A learner uses a food-quality adjective to greet a new guest. Which original utterance repairs the greeting?",
    correctQuote:"你好",wrongQuote:"好吃",
    feedback:"好吃 describes food as tasty. For the new guest, the original greeting is 你好 (nǐ hǎo), not a taste evaluation."
   },
   readingRepair:{
    context:"An authored menu scene changes speakers: a host addresses a customer who has not chosen a drink. The task is to find an explicit question, not merely a greeting.",
    question:"Which quoted original line actually asks the customer whether they like drinking tea?",
    correctQuote:"你喜欢喝茶吗？",wrongQuote:"你好",
    feedback:"你好 only opens contact. The original tea question contains 你, 喜欢, 喝茶 and the final question marker 吗."
   },
   writingTransfer:{
    instruction:"Revise the café dialogue for a second visitor who has already been greeted: omit the redundant arrival greeting and ask about tea before referring to food. Draft an independent response without pretending the new line is quoted.",
    criteria:["Change the addressee's situation instead of reproducing the first dialogue unchanged.","Ask about tea using the source-attested question pattern before discussing taste.","Clearly identify which phrases are quoted from the original and which replies you authored."]
   }
  }
 },
 {
  id:"zh:phase26-student-teacher-correction",languageId:"zh",title:"Correcting a mistaken student or teacher identity",
  objective:"Read who is a student and who is a teacher, then distinguish an affirmative source statement from the negated identity form.",
  explanation:"我是学生。 refers to the speaker as student; 他是老师。 refers to another person as teacher; 不是 negates a noun identity. The negated form has the attested Pinyin bú shì, not an implied conversational correction dialogue.",
  transferSituation:"At registration, a visitor mistakes the student for the teacher. The student clarifies both roles; a second arrival makes the opposite mistake.",
  writingInstruction:"Author two short registration conversations using only original-backed identity patterns and independently composed corrections. Explain in English when the subject switches from 我 to 他 and when 不是 is required.",
  reflection:"How can you distinguish a statement about yourself, one about the teacher, and the correction that negates a mistaken role?",
  writingChecks:["Recognize 我是学生。 as about the speaker, not the teacher.","Recognize 他是老师。 as describing a third-person teacher.","Use or explain 不是 for denying an incorrect identity, with the exact source reading bú shì."],
  encounters:[q(self,wo,"我是学生。"),q(identity,shi,"他是老师。"),q(identity,shi,"不是")],
  guidedQuestion:"The person speaking identifies themself as a student. Which attested original sentence expresses this?",
  guidedAnswer:"我是学生。",
  independentQuestion:"The conversation now identifies another person as a teacher. Which original sentence fits?",
  independentAnswer:"他是老师。",
  chineseExpansion:{
   grammarHeading:"Subject switch: 我 and 他 with 是, then negate with 不",
   grammarExplanation:"The source attests 我是学生。 (Wǒ shì xuésheng.) and 他是老师。 (Tā shì lǎoshī.). Both are noun identities, but changing the subject changes the person described. 不是 (bú shì) rejects a noun identity; the attested tone form does not create a grade of speaking.",
   contrastCue:"Compare source student and teacher statements before interpreting 不是 as a correction: identity and subject are separate decisions.",
   cloze:{instruction:"Reconstruct the original self-identification as a student, preserving the full attested subject.",quote:"我是学生。",before:"我",answer:"是",after:"学生。",sourceId:wo},
   situationalChoice:{question:"Someone has assumed the wrong role. Which original form supplies identity negation?",correctQuote:"不是"},
   dialogueBrief:"Write your own source-informed correction, distinguishing authentic forms from the learner-authored interaction.",
   tone:{question:"Type the exact attested Pinyin for 不是, including contextual tone marking.",quote:"不是",reading:"bú shì",sourceId:shi},
   toneCue:"The original writes bú shì; both syllable tones matter in text but are not a recorded speech assessment."},
  chineseDepth:{
   guidedRepair:{
    question:"A learner points to the teacher but quotes the source statement about themself as a student. Which original line repairs this mistaken referent?",
    correctQuote:"他是老师。",wrongQuote:"我是学生。",
    feedback:"The source line 我是学生。 describes the speaker as a student. 他是老师。 uses 他 to identify another person as teacher."
   },
   readingRepair:{
    context:"An authored role-tag scene has a student speaking and a teacher standing nearby. A visitor requests the sentence describing the speaker, not the third person.",
    question:"Which exact source sentence describes the person speaking as a student?",
    correctQuote:"我是学生。",wrongQuote:"他是老师。",
    feedback:"The third-person teacher sentence starts with 他. The speaker's attested student statement starts with 我 and ends with 学生。."
   },
   writingTransfer:{
    instruction:"Rewrite the registration correction from the viewpoint of the arriving visitor: first describe the teacher, then politely correct a mistaken statement about the student. Keep each speaker and referent explicit.",
    criteria:["Change which person is speaking and which person is referred to.","Distinguish the correct positive identity from the mistaken one being denied.","Preserve only original-backed vocabulary as quoted source; label additional language as learner-authored."]
   }
  }
 },
 {
  id:"zh:phase26-group-addition",languageId:"zh",title:"Changing group, listener and shared role",
  objective:"Use source-attested 我们, 你们 and 也是 to distinguish the speaker's group, the addressed group and an additional identity.",
  explanation:"我们 includes the speaker among the group; 你们 addresses a group of listeners. 也是 adds that an identity also applies, rather than marking another group pronoun. These are three separate original vocabulary items, not a complete original dialogue.",
  transferSituation:"Two study groups meet before orientation. A representative speaks for the first group, addresses the second group and learns that both groups share a role.",
  writingInstruction:"Write a new dialogue between group representatives that changes who speaks and who listens. Use source-backed 我们 and 你们 and explain in English where 也是 indicates a shared identity.",
  reflection:"Which group does 我们 refer to for each speaker, and why is 也是 not another second-person pronoun?",
  writingChecks:["Use 我们 (wǒmen) only for a group including the current speaker.","Use 你们 (nǐmen) for the addressed group.","Use 也是 (yě shì) to indicate an additional shared identity, not to form a plural pronoun."],
  encounters:[q(self,wo,"我们"),q(greet,ni,"你们"),q(identity,shi,"也是")],
  guidedQuestion:"Which original pronoun includes the current speaker and their group?",
  guidedAnswer:"我们",
  independentQuestion:"Which original pronoun addresses several listeners without including the speaker?",
  independentAnswer:"你们",
  chineseExpansion:{
   grammarHeading:"们 marks person plurality; 也 adds a separate proposition",
   grammarExplanation:"我们 (wǒmen) and 你们 (nǐmen) differ by the first-person and second-person pronoun; both use 们 for plural people. 也是 (yě shì) adds 'also is' to an identity and is not a pronoun. The original sources attest these items individually.",
   contrastCue:"Compare 我们 and 你们 before interpreting 也是; group ownership depends on who currently speaks.",
   cloze:{instruction:"Reconstruct the original first-person plural pronoun completely.",quote:"我们",before:"我",answer:"们",after:"",sourceId:wo},
   situationalChoice:{question:"Which original item expresses additionally sharing an identity rather than addressing listeners?",correctQuote:"也是"},
   dialogueBrief:"Change the current speaker explicitly between turns and mark composed statements as new learner writing.",
   tone:{question:"Type the tone-marked Pinyin of the original plural addressed-group pronoun 你们.",quote:"你们",reading:"nǐmen",sourceId:ni},
   toneCue:"The attested nǐmen has third-tone nǐ and neutral-tone men; no tone is inferred from an audio recording."},
  chineseDepth:{
   guidedRepair:{
    question:"A representative is talking about their own study group, but has used the addressee-group pronoun. Which original source item corrects the referent?",
    correctQuote:"我们",wrongQuote:"你们",
    feedback:"你们 (nǐmen) points to the group being addressed, not the representative's own group. 我们 (wǒmen) includes the speaker."
   },
   readingRepair:{
    context:"The authored group dialogue changes direction: speaker A now addresses the other group's three visitors. The requested word must refer to listeners, not the speaker's group.",
    question:"Which source item identifies the group being addressed in this turn?",
    correctQuote:"你们",wrongQuote:"我们",
    feedback:"From speaker A's viewpoint, 你们 is the group they are speaking to. 我们 would include speaker A."
   },
   writingTransfer:{
    instruction:"Reverse the group representatives' speaking order and write an entirely new dialogue. Identify the speaker in each turn and explain any switch between 我们 and 你们.",
    criteria:["Change who speaks first and whose group is included in each 我们.","Avoid confusing 你们 with 我们 when speakers swap.","Use 也是 only for an additional identity, not as a greeting or plural form."]
   }
  }
 },
 {
  id:"zh:phase26-apple-taste-report",languageId:"zh",title:"Reading a fruit description beyond the greeting",
  objective:"Interpret 这个苹果很好吃。 as a complete report about this apple rather than a simple taste adjective or an address to a visitor.",
  explanation:"你好 addresses the visitor. 好吃 describes taste; 这个苹果很好吃。 gives the specific object, with 这个 and 苹果, and places 很 before the quality expression. A learner must identify which original source text answers an apple-specific question.",
  transferSituation:"At a small snack table, a visitor is greeted and asks about a particular apple. The host reports taste, then another visitor asks more generally whether the food is good.",
  writingInstruction:"Write two original Chinese snack-table dialogues: one asking about a specified apple, another about food generally. Use the exact source readings only for attested quotations and explain any additional vocabulary.",
  reflection:"Which original excerpt contains the identifiable apple, and why does greeting the customer not answer that question?",
  writingChecks:["Use 你好 (nǐ hǎo) to greet the person, not to describe fruit.","Differentiate the general 好吃 (hǎochī) from the specific full apple statement.","Retain 很 and the apple referent in 这个苹果很好吃。 when discussing that original source meaning."],
  encounters:[q(greet,ni,"你好"),q(greet,hao,"好吃"),q(greet,hao,"这个苹果很好吃。")],
  guidedQuestion:"Which source line is the full sentence that describes this specific apple as delicious?",
  guidedAnswer:"这个苹果很好吃。",
  independentQuestion:"Which original expression gives just a general description of tasty food?",
  independentAnswer:"好吃",
  chineseExpansion:{
   grammarHeading:"Specific referent 这个苹果 plus 很 and taste adjective",
   grammarExplanation:"The source 这个苹果很好吃。 (Zhège píngguǒ hěn hǎochī.) identifies a particular apple with 这个苹果 and describes it with 很好吃. The short 好吃 (hǎochī) only gives the taste expression. 你好 (nǐ hǎo) contains 好 but is a greeting instead of an adjective phrase about food.",
   contrastCue:"Read the source's entire apple statement and contrast it with the short 好吃; one includes the specific referent.",
   cloze:{instruction:"Complete the source sentence's adjective phrase about this apple.",quote:"这个苹果很好吃。",before:"这个苹果很",answer:"好吃",after:"。",sourceId:hao},
   situationalChoice:{question:"The listener only asks for the general quality 'tasty' without mentioning this apple. Which source item is the expression?",correctQuote:"好吃"},
   dialogueBrief:"Write two separate guest/host dialogues with a clearly established referent and distinguish short taste comments from complete descriptions.",
   tone:{question:"Type the full source-attested tone-marked Pinyin for the exact apple sentence.",quote:"这个苹果很好吃。",reading:"Zhège píngguǒ hěn hǎochī.",sourceId:hao},
   toneCue:"Preserve all original diacritics in Zhège píngguǒ hěn hǎochī.; this is written recall, not a speaking evaluation."},
  chineseDepth:{
   guidedRepair:{
    question:"A guest asks if the apple tastes good, but the reply is only a greeting. Which exact full original sentence repairs that mismatch?",
    correctQuote:"这个苹果很好吃。",wrongQuote:"你好",
    feedback:"你好 (nǐ hǎo) is a greeting to a person. 这个苹果很好吃。 explicitly describes the apple's taste."
   },
   readingRepair:{
    context:"In a new authored tasting scene, the listener asks about a specific apple already on the table. The answer must identify that apple instead of merely asserting tastiness.",
    question:"Which of the original excerpts explicitly identifies the apple and reports its taste?",
    correctQuote:"这个苹果很好吃。",wrongQuote:"好吃",
    feedback:"好吃 describes tastiness without the specific referent. 这个苹果很好吃。 names this apple and says it tastes good."
   },
   writingTransfer:{
    instruction:"Rewrite the snack-table exchange for a visitor who already knows the host: remove the repeated greeting, establish which apple is being discussed, and give an independently composed response.",
    criteria:["Adjust the greeting to suit a visitor who is already present.","Keep the apple referent identifiable before describing its taste.","Use the original source line exactly when quoting and label new sentences as learner-authored."]
   }
  }
 }
] as const;
