import type {SourceAuthoredIntake,PinnedSourceQuote} from "./source-intake.ts";

const q=(lessonId:string,sourceId:string,quote:string):PinnedSourceQuote=>({lessonId,sourceId,quote});
const greet="zh:ni-hao:shared-pilot",self="zh:wo:shared-pilot",identity="zh:shi:shared-pilot";
const ni="zh-ni-demo",hao="zh-hao-demo",wo="zh-wo-demo",shi="zh-shi-demo";
/** Original text is pinned DEMO_ONLY source; all new dialogues, scenes and revision tasks are authorial. */
export const PHASE27_CHINESE_TRANSFER:readonly SourceAuthoredIntake[]=[
 {
  id:"zh:phase27-group-reversal",languageId:"zh",title:"Switching who speaks for a study group",
  objective:"Track first-person speaker and second-person addressee as two group representatives reverse roles in a conversation.",
  explanation:"我 means the current speaker, 我们 includes their own group, and 你们 addresses another group. These three authentic original snippets are source quotations, but the alternating representatives in this lesson are a new practice scenario.",
  transferSituation:"A group representative asks a different group for directions. Later the other representative replies, so the referent of 我们 and 你们 changes with the current speaker.",
  writingInstruction:"Write two new short Chinese exchanges in which different representatives take turns. Mark who says each turn and explain how each first-person and second-person reference changes.",
  reflection:"If a second person takes the same speaking turn, which group does 我们 now include and which listeners are 你们?",
  writingChecks:["Identify 我 as the current speaker, not the addressee.","Track 我们 from the viewpoint of the current speaker's group.","Use 你们 when explicitly addressing the other group, rather than as a first-person plural."],
  encounters:[q(self,wo,"我"),q(self,wo,"我们"),q(greet,ni,"你们")],
  guidedQuestion:"Which original item includes the person speaking together with their group?",guidedAnswer:"我们",
  independentQuestion:"Which attested word addresses several listeners rather than naming the speaker?",independentAnswer:"你们",
  chineseExpansion:{
   grammarHeading:"Perspective changes while the original pronoun forms stay fixed",
   grammarExplanation:"我 (wǒ) means I; 我们 (wǒmen) means we; and 你们 (nǐmen) addresses several listeners. The original source distinguishes first and second person. Changing speakers changes who the group pronouns refer to in an original learner-authored exchange.",
   contrastCue:"When a new group representative becomes speaker, the first-person 我们 follows the new speaker; 你们 refers to the people being addressed.",
   cloze:{instruction:"Reconstruct the exact attested first-person plural form.",quote:"我们",before:"我",answer:"们",after:"",sourceId:wo},
   situationalChoice:{question:"A leader turns to address the other team. Which original item refers to that other team?",correctQuote:"你们"},
   dialogueBrief:"Write a new original dialogue with two representatives and switch the direction of address, without inventing an original source transcript.",
   tone:{question:"Type the exact source-attested tone-marked reading of 我们.",quote:"我们",reading:"wǒmen",sourceId:wo},
   toneCue:"The original writes wǒmen with an accented first syllable and neutral-tone men; no audio is attested."},
  chineseDepth:{
   guidedRepair:{
    question:"A speaker addresses another group's members but accidentally uses the word for their own group. Which original form repairs the referent?",
    correctQuote:"你们",wrongQuote:"我们",
    feedback:"我们 (wǒmen) includes the speaker's group. Addressing members of the other group requires 你们 (nǐmen)."
   },
   readingRepair:{
    context:"A new speaker has just taken over in an original training scene. The instruction requests an expression for that one speaker, not a plural group.",
    question:"Which exact attested source word refers to the current speaker alone?",
    correctQuote:"我",wrongQuote:"我们",
    feedback:"我们 includes a group, whereas 我 means only the current speaker. The role reversal changes the referent, not the source word."
   },
   writingTransfer:{
    instruction:"Rewrite your first exchange with the two representatives trading places, and clarify which group is addressed in every line of your newly authored conversation.",
    criteria:["Mark the speaker of each new turn before choosing a pronoun.","Use 我们 for the current speaker's own group after reversing roles.","Explain the addressee marked by 你们 without claiming a sourced conversation."]
   }
  },
  chineseReconstruction:{
   reconstruct:{
    instruction:"Restore the complete original Hanzi pronoun that addresses the other group, not the first-person plural.",
    quote:"你们",sourceId:ni,wrongQuote:"我们",
    feedback:"你们 is the original second-person plural; 我们 is the first-person plural and changes whose group is involved."
   },
   changedContext:{
    context:"In the final new group exchange, a representative now summarizes the group that includes themself. Earlier the representative was addressing the other group.",
    question:"Which original quoted word now refers to the representative's own group?",
    correctQuote:"我们",wrongQuote:"你们",
    feedback:"The requested group now includes the speaker, so 我们 is required. 你们 would keep pointing at the group being addressed."
   },
   independentDialogue:{
    instruction:"Write a third original dialogue after reversing speakers once more. Include a new arrival and label all speakers. Independently check that you have not carried the wrong-group pronoun into the changed situation.",
    criteria:["Give each speaker a clear identity and role.","Check 我们 and 你们 from the viewpoint of each speaker in turn.","Keep original Hanzi evidence separate from your new dialogue wording."]
   }
  }
 },
 {
  id:"zh:phase27-identify-referents",languageId:"zh",title:"Identifying a speaker, teacher and shared identity",
  objective:"Read a first-person student claim, a third-person teacher claim and the attested also-identity expression across changed addressees.",
  explanation:"我是学生。 identifies the current speaker as student; 他是老师。 identifies a different person as teacher. 也是 adds that an identity also holds, and cannot replace a complete speaker or teacher reference by itself.",
  transferSituation:"A new assistant at orientation hears one learner describe themself and a teacher nearby. The assistant then speaks to a different visitor who shares one role.",
  writingInstruction:"Create an original orientation exchange with a student, visitor and teacher. Separate the first-person student statement from a third-person teacher statement and explain the meaning of 也是.",
  reflection:"What changes if the visitor speaks in place of the student, and how does 也是 add agreement rather than choosing the grammatical subject?",
  writingChecks:["Keep the original speaker of 我是学生。 distinct from the teacher.","Recognize 他 as a third-person subject in 他是老师。.","Explain 也是 (yě shì) as also is and not as an identity-subject pronoun."],
  encounters:[q(self,wo,"我是学生。"),q(identity,shi,"他是老师。"),q(identity,shi,"也是")],
  guidedQuestion:"Which attested complete sentence refers to a teacher who is not the person speaking?",guidedAnswer:"他是老师。",
  independentQuestion:"Which attested source sentence has the first-person student as its subject?",independentAnswer:"我是学生。",
  chineseExpansion:{
   grammarHeading:"The subject identifies a person; 也 adds another matching identity",
   grammarExplanation:"我是学生。 (Wǒ shì xuésheng.) refers to the speaker. 他是老师。 (Tā shì lǎoshī.) refers to another person. 也是 (yě shì) adds 'also is'. The source snippets remain distinct even when a new learner dialogue changes which visitor is speaking.",
   contrastCue:"Compare the complete first-person and third-person identity statements. 也是 alone is not the same as a full sentence identifying who has the role.",
   cloze:{instruction:"Restore the attested copula in the original self-identity sentence.",quote:"我是学生。",before:"我",answer:"是",after:"学生。",sourceId:wo},
   situationalChoice:{question:"Which exact original form expresses an identity that also applies to another person?",correctQuote:"也是"},
   dialogueBrief:"Write a new multi-person dialogue without misquoting the original identity sentences or claiming the new setting was sourced.",
   tone:{question:"Type the complete original Pinyin for the third-person teacher identity.",quote:"他是老师。",reading:"Tā shì lǎoshī.",sourceId:shi},
   toneCue:"Use precisely the recorded orthographic diacritics Tā, shì and lǎoshī; this is not an audio/speech grade."},
  chineseDepth:{
   guidedRepair:{
    question:"A visitor points to the teacher but uses the line about themself as a student. Which original identity sentence repairs that referent error?",
    correctQuote:"他是老师。",wrongQuote:"我是学生。",
    feedback:"我是学生。 is first-person student identity. The requested third-person teacher identity is 他是老师。 with 他 as the subject."
   },
   readingRepair:{
    context:"An original learner-authored orientation scene changes to the student's own perspective. The reader is asked to identify the student who is speaking, not the nearby teacher.",
    question:"Which complete original line describes the person now speaking as a student?",
    correctQuote:"我是学生。",wrongQuote:"他是老师。",
    feedback:"The original student sentence starts with 我 (wǒ). 他是老师。 describes the other person rather than the current speaker."
   },
   writingTransfer:{
    instruction:"Rewrite the orientation dialogue with a visitor becoming the first speaker. Explain who is teacher, who is student, and when an additional identity warrants 也是.",
    criteria:["Change each person's perspective and label speaking turns.","Distinguish explicit subject plus 是 from the addition 也是.","Keep the source-attested sentences and self-created dialogue explicitly separate."]
   }
  },
  chineseReconstruction:{
   reconstruct:{
    instruction:"Type the full attested Hanzi student statement as a source quote, including its final punctuation.",quote:"我是学生。",sourceId:wo,wrongQuote:"他是老师。",
    feedback:"The source statement about the speaker being a student is 我是学生。, not the separate third-person teacher statement."
   },
   changedContext:{
    context:"At the end of the independently authored scene a third person asks who the teacher is, not who the first speaker is or who shares a role.",
    question:"Which original sentence explicitly identifies another person as a teacher?",
    correctQuote:"他是老师。",wrongQuote:"我是学生。",
    feedback:"The question now targets the teacher. 他是老师。 uses the correct third-person referent; 我是学生。 still identifies the speaker as student."
   },
   independentDialogue:{
    instruction:"Compose a new conversation between a staff member and two different visitors. Independently label the referent of every identity statement and explain one appropriate use of an added identity.",
    criteria:["Mark the person identified by each noun-identity sentence.","Explain how 也是 adds an identity without naming the subject by itself.","Do not present new conversational text as an original source quote."]
   }
  }
 },
 {
  id:"zh:phase27-tea-versus-apple",languageId:"zh",title:"Reconstructing a drink question versus a food statement",
  objective:"Distinguish a yes/no question about drinking tea, a specific statement about an apple, and an opening greeting when speakers switch settings.",
  explanation:"你好 is a greeting. 你喜欢喝茶吗？ contains the yes/no question particle 吗. 这个苹果很好吃。 is an affirmative description with 很 and no final question particle. Original source snippets are not themselves an attested conversation.",
  transferSituation:"A visitor arrives, answers a host's question about tea and separately hears a statement about a particular apple. Later the host meets a new visitor who already knows the food.",
  writingInstruction:"Write an original two-location dialogue: first ask a visitor whether they like tea, then make a statement about this apple. Explain which line is a question and which is not.",
  reflection:"Can a sentence about an apple answer a question about tea, and which attested final character distinguishes the question?",
  writingChecks:["Use 你好 only for greeting the visitor.","Identify the complete tea question by its final 吗？.","Identify 这个苹果很好吃。 as a statement about a specific apple."],
  encounters:[q(greet,ni,"你好"),q(greet,ni,"你喜欢喝茶吗？"),q(greet,hao,"这个苹果很好吃。")],
  guidedQuestion:"Which exact source utterance asks a yes/no question about a person's tea preference?",guidedAnswer:"你喜欢喝茶吗？",
  independentQuestion:"Which original line describes this apple without posing a question?",independentAnswer:"这个苹果很好吃。",
  chineseExpansion:{
   grammarHeading:"Question particle 吗 versus a descriptive affirmative statement",
   grammarExplanation:"The source 你喜欢喝茶吗？ (Nǐ xǐhuan hē chá ma?) uses final 吗 to ask about tea. 这个苹果很好吃。 (Zhège píngguǒ hěn hǎochī.) describes a particular apple and contains 很. 你好 (nǐ hǎo) is a separate greeting rather than either a food statement or drink question.",
   contrastCue:"The tea question ends with 吗？, whereas the apple statement ends with 。 and describes a different referent.",
   cloze:{instruction:"Reconstruct the exact attested tea-question particle at the end of the original line.",quote:"你喜欢喝茶吗？",before:"你喜欢喝茶",answer:"吗",after:"？",sourceId:ni},
   situationalChoice:{question:"The listener requests a statement about this specific apple, not a drink question. Which original line fits?",correctQuote:"这个苹果很好吃。"},
   dialogueBrief:"Compose two original host/guest interactions with distinct communicative functions and never attribute the new conversation to the native source.",
   tone:{question:"Type the complete original tone-marked Pinyin for the tea question.",quote:"你喜欢喝茶吗？",reading:"Nǐ xǐhuan hē chá ma?",sourceId:ni},
   toneCue:"Preserve Nǐ xǐhuan hē chá ma? exactly; the neutral ma and question mark are part of the source orthography."},
  chineseDepth:{
   guidedRepair:{
    question:"A host is meant to ask a guest whether they like tea, but chooses the statement about an apple. Which original line restores the correct speech act?",
    correctQuote:"你喜欢喝茶吗？",wrongQuote:"这个苹果很好吃。",
    feedback:"这个苹果很好吃。 reports that an apple is tasty; it does not ask a tea-preference question. Use 你喜欢喝茶吗？ with 吗."
   },
   readingRepair:{
    context:"In the second authored scene, the drink question is finished and the guest asks specifically about the apple already on the table. Identify the declarative answer.",
    question:"Which source line states that this apple is tasty rather than asking whether someone likes tea?",
    correctQuote:"这个苹果很好吃。",wrongQuote:"你喜欢喝茶吗？",
    feedback:"The tea expression is a question ending with 吗？. The apple statement names 这个苹果 and describes it with 很好吃。."
   },
   writingTransfer:{
    instruction:"Rewrite your original restaurant dialogue for a different guest who arrives after the drink choice is known; remove the repeated tea question and use the source to comment appropriately on the apple.",
    criteria:["Change the setting and addressee so the repeated tea question is no longer necessary.","Distinguish interrogative 吗？ from declarative 。.","Attribute only the attested Hanzi/Pinyin to the source; label all new dialogue as your own."]
   }
  },
  chineseReconstruction:{
   reconstruct:{
    instruction:"Type the complete attested Hanzi tea-preference question, including the final question punctuation.",quote:"你喜欢喝茶吗？",sourceId:ni,wrongQuote:"这个苹果很好吃。",
    feedback:"The original complete tea-preference question is 你喜欢喝茶吗？, not the apple-quality statement."
   },
   changedContext:{
    context:"The host now addresses a completely new visitor. Before any tea or food discussion, the host wants only to open the conversation politely.",
    question:"Which original source expression greets the new visitor before asking about tea?",
    correctQuote:"你好",wrongQuote:"你喜欢喝茶吗？",
    feedback:"The situation calls for an opening greeting 你好. The source tea sentence is a separate preference question and should follow contact."
   },
   independentDialogue:{
    instruction:"Draft a third source-aware conversation that starts with a new guest, asks about tea, and later shifts to apple taste. Explain why each turn is a greeting, question or declarative statement.",
    criteria:["Keep greeting, drink question and apple statement in a coherent new sequence.","Preserve the source question marker 吗 and distinguish the statement-ending 。.","Write an original exchange; do not assert a source recording or any pronunciation/HSK result."]
   }
  }
 },
 {
  id:"zh:phase27-ownership-or-correction",languageId:"zh",title:"Ownership, denial and additional identity",
  objective:"Choose possession 我的, noun-identity negation 不是, or adding a role with 也是 as a practical case changes.",
  explanation:"我的 means my or mine, not a denial or an additional identity. 不是 denies an identity, while 也是 adds also-is; each is an attested short original source expression, not a complete original exchange.",
  transferSituation:"A student checks which badge belongs to them. A staff member then denies an incorrect role, and someone else adds that a role also applies. These are three different communicative tasks.",
  writingInstruction:"Write three original service-desk mini-dialogues: one about whose badge it is, another correcting an assumed role, and a third adding a shared role. Explain the difference between 的, 不 and 也.",
  reflection:"When do you talk about possession rather than the truth of an identity, and how do 不 and 也 change the meaning of 是?",
  writingChecks:["Use 我的 (wǒ de) only for a first-person possessive relation.","Use 不是 (bú shì) to reject an asserted identity.","Use 也是 (yě shì) to add an identity, not to express ownership or denial."],
  encounters:[q(self,wo,"我的"),q(identity,shi,"不是"),q(identity,shi,"也是")],
  guidedQuestion:"Someone asks which badge belongs to you. Which exact original item marks first-person possession?",guidedAnswer:"我的",
  independentQuestion:"A staff member denies a mistaken identity. Which original form negates the identity?",independentAnswer:"不是",
  chineseExpansion:{
   grammarHeading:"Possession 的, identity denial 不, identity addition 也",
   grammarExplanation:"我的 (wǒ de) expresses my/mine. 不是 (bú shì) negates noun identity, and 也是 (yě shì) means also is. The original source readings use neutral-tone de and preserve the change to bú before shì; no oral result is inferred.",
   contrastCue:"Compare short original expressions by function: ownership is not negation, and a second matching identity is not the same as denial.",
   cloze:{instruction:"Restore the complete original first-person possessive expression in Hanzi.",quote:"我的",before:"我",answer:"的",after:"",sourceId:wo},
   situationalChoice:{question:"A different visitor has the same role as another person. Which original expression adds that shared identity?",correctQuote:"也是"},
   dialogueBrief:"Write newly authored turns about ownership and roles, clearly separating these from the source's short words.",
   tone:{question:"Type the exact source reading of the negated identity form 不是 with tone marks.",quote:"不是",reading:"bú shì",sourceId:shi},
   toneCue:"The pinned source's bú shì is tone-marked in writing; a learner's typed text is never assessed for actual pronunciation."},
  chineseDepth:{
   guidedRepair:{
    question:"A visitor is trying to identify a badge as theirs, but answers with the denial of a role. Which original form expresses possession instead?",
    correctQuote:"我的",wrongQuote:"不是",
    feedback:"不是 negates an identity claim. Ownership of the speaker's badge is expressed with 我的 (wǒ de), which contains possessive 的."
   },
   readingRepair:{
    context:"A staff member asks whether a role attribution is correct. The learner needs the form that explicitly rejects the mistaken identity, not one that adds another matching role.",
    question:"Which original expression signals that the identity assumption is false?",
    correctQuote:"不是",wrongQuote:"也是",
    feedback:"也是 adds that an identity also holds. To reject an identity claim, the original form is 不是 (bú shì)."
   },
   writingTransfer:{
    instruction:"Rewrite the reception-desk dialogue after the owner of the badge changes. Then add a separate identity correction and a third person's matching role, clearly labeling the turns.",
    criteria:["Use 我的 only when the possession belongs to the person speaking.","Distinguish explicit denial 不是 from additional identity 也是.","Keep source quotes separate from new role and badge dialogue."]
   }
  },
  chineseReconstruction:{
   reconstruct:{
    instruction:"Type the exact original Hanzi expression for adding a shared identity, not the negative identity form.",quote:"也是",sourceId:shi,wrongQuote:"不是",
    feedback:"也是 means also is and adds a matching role; 不是 is a denial with the opposite communicative meaning."
   },
   changedContext:{
    context:"The learner first owned the badge, but the receptionist now asks whether the role on it is mistaken. The answer must reject the role claim, not identify its owner.",
    question:"Which exact source expression now denies an incorrect role?",
    correctQuote:"不是",wrongQuote:"我的",
    feedback:"This changed situation asks about the truth of a role rather than possession. 不是 denies the identity; 我的 only denotes ownership."
   },
   independentDialogue:{
    instruction:"Create a new three-person badge-desk dialogue where possession is clarified, one identity mistake is corrected, and a second person shares the role. Keep the scenario original.",
    criteria:["State who owns the item and distinguish that from a role.","Include a logically appropriate denial and a separate additional identity.","Identify all new words as learner-created, not the source's verbatim conversation."]
   }
  }
 }
] as const;
