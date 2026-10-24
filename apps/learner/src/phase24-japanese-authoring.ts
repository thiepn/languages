import type {SourceAuthoredIntake,PinnedSourceQuote} from "./source-intake.ts";
const q=(lessonId:string,sourceId:string,quote:string):PinnedSourceQuote=>({lessonId,sourceId,quote});
const greeting="ja:cf-a1-01-01:shared-pilot",polite="ja:cf-a1-01-02:shared-pilot",first="ja:cf-a1-01-03:shared-pilot";
const g="ja-cf-a1-01-01-original",p="ja-cf-a1-01-02-original",f="ja-cf-a1-01-03-original";
/** Source-spelling and translation must match the pinned unmerged Japanese course-first owner.
 * Context labels 朝, 昼, 夜 and 寝る前 are not themselves part of spoken greetings. */
export const PHASE24_JAPANESE_AUTHORING:readonly SourceAuthoredIntake[]=[
 {
 id:"ja:phase24-morning-day-evening",languageId:"ja",title:"Time-specific polite greetings",
 objective:"Select a polite Japanese morning, daytime or evening greeting without speaking the written context labels.",
 explanation:"朝, 昼 and 夜 are labels for the context in the source, not parts of what the speaker says. The greeting itself changes with time: おはようございます in the morning, こんにちは in daytime and こんばんは in the evening.",
 transferSituation:"A school visitor first meets a teacher in the morning, a classmate in the afternoon and a host after sunset.",
 writingInstruction:"Write three distinct original Japanese greeting turns for morning, afternoon and evening. Identify the contextual kanji label corresponding to each, without adding the label to the spoken phrase.",
 reflection:"Which kanji indicate the time rather than the actual greeting? Why does the speaker choose another expression in the evening?",
 writingChecks:["Reserve おはようございます for the teacher in the morning.","Use こんにちは for an afternoon first greeting.","Use こんばんは for the evening encounter; do not speak the kanji time labels."],
 encounters:[q(greeting,g,"朝：おはようございます。"),q(greeting,g,"昼：こんにちは。"),q(greeting,g,"夜：こんばんは。")],
 guidedQuestion:"Which original example identifies the daytime greeting by its context label?",guidedAnswer:"昼：こんにちは。",
 independentQuestion:"Which original context-and-expression pair is appropriate after sunset?",independentAnswer:"夜：こんばんは。",
 japaneseExpansion:{
  grammarHeading:"Read the kanji label, speak the kana expression",
  grammarExplanation:"The characters 朝 (morning), 昼 (daytime) and 夜 (night/evening) name the setting. The punctuation ： divides each label from the utterance. A learner says the kana greeting, not the preceding time label.",
  contrastCue:"Contrast 朝：おはようございます。 and 昼：こんにちは。; the time labels and corresponding utterances must not be exchanged.",
  cloze:{instruction:"Supply the exact attested morning greeting after the context label 朝.",quote:"朝：おはようございます。",before:"朝：",answer:"おはようございます",after:"。",sourceId:g},
  situationalChoice:{question:"Which original example would fit greeting a new neighbor after sunset?",correctQuote:"夜：こんばんは。"},
  dialogueBrief:"Write three separate learner-created speaking turns and label them in English with times of day, not with falsely attributed source dialogue."
 }
 },
 {
 id:"ja:phase24-evening-versus-bedtime",languageId:"ja",title:"Arriving in the evening or going to bed",
 objective:"Separate an evening-arrival greeting from a bedtime expression and an ordinary daytime greeting.",
 explanation:"こんばんは opens an encounter during the evening, whereas おやすみなさい is said before bed. 寝る前 literally labels the pre-sleep situation; saying the bedtime formula on arrival at an evening event would change the speech act.",
 transferSituation:"You arrive at a family gathering at dusk, greet a friend the next afternoon and later say goodnight before sleeping.",
 writingInstruction:"Write an original three-part Japanese exchange showing evening arrival, afternoon meeting and bedtime. Explain the distinct meanings of 夜 and 寝る前 as written source context labels.",
 reflection:"Why is the bedtime formula not interchangeable with the evening greeting despite both happening after daylight?",
 writingChecks:["Use こんばんは to open the evening arrival.","Use こんにちは when meeting someone the following afternoon.","Use おやすみなさい only before sleep, not at the entrance."],
 encounters:[q(greeting,g,"夜：こんばんは。"),q(greeting,g,"寝る前：おやすみなさい。"),q(greeting,g,"昼：こんにちは。")],
 guidedQuestion:"Which original example is explicitly used before going to bed?",guidedAnswer:"寝る前：おやすみなさい。",
 independentQuestion:"Which original example opens a normal evening encounter?",independentAnswer:"夜：こんばんは。",
 japaneseExpansion:{
  grammarHeading:"夜 and 寝る前 mark different situations",
  grammarExplanation:"The kanji 夜 marks evening or night as a time setting. The source's 寝る前 means before sleeping. Its kana phrase おやすみなさい is a bedtime expression rather than a greeting at an evening arrival.",
  contrastCue:"Compare 夜：こんばんは。 with 寝る前：おやすみなさい。; both refer to nighttime but require different social actions.",
  cloze:{instruction:"Reconstruct the attested bedtime expression after the source context label.",quote:"寝る前：おやすみなさい。",before:"寝る前：",answer:"おやすみなさい",after:"。",sourceId:g},
  situationalChoice:{question:"Someone arrives to meet guests at an evening party, not to sleep. Which original example fits?",correctQuote:"夜：こんばんは。"},
  dialogueBrief:"Create the sequence using three practical situations and describe when each expression would be heard."
 }
 },
 {
 id:"ja:phase24-attention-and-thanks",languageId:"ja",title:"Asking for help and thanking",
 objective:"Distinguish the polite attention request すみません from gratitude and an appropriate acknowledgment.",
 explanation:"すみません can get a staff member's attention or mean a mild apology. ありがとうございます thanks someone after assistance; どういたしまして is one possible reply to thanks. Context and order determine the function.",
 transferSituation:"You need the library information desk to locate a room. Ask for attention, receive assistance, thank the worker and acknowledge their response.",
 writingInstruction:"Create a four-turn original Japanese service-desk exchange with an attention request, help, thanks and an acknowledgment. Explain the job of each source expression.",
 reflection:"Has the person helped yet when you say すみません? When does ありがとうございます become appropriate?",
 writingChecks:["Use すみません before the help to request attention.","Say ありがとうございます after receiving help.","Use a source-supported reply such as どういたしまして after gratitude."],
 encounters:[q(polite,p,"すみません。"),q(polite,p,"ありがとうございます。"),q(polite,p,"どういたしまして。")],
 guidedQuestion:"Which attested phrase gets a worker's attention before the request?",guidedAnswer:"すみません。",
 independentQuestion:"Which original expression is one reply to a thank-you?",independentAnswer:"どういたしまして。",
 japaneseExpansion:{
  grammarHeading:"Politeness is not one universal expression",
  grammarExplanation:"すみません often prepares a request; ありがとうございます acknowledges assistance; どういたしまして responds to gratitude. These separate conversational turns cannot replace one another just because all are polite.",
  contrastCue:"Compare the opening すみません。 with ありがとうございます。: the first solicits attention, while the second recognizes completed help.",
  cloze:{instruction:"Complete the attested expression for getting assistance.",quote:"すみません。",before:"すみ",answer:"ません",after:"。",sourceId:p},
  situationalChoice:{question:"The worker has now helped you; which original phrase expresses your gratitude?",correctQuote:"ありがとうございます。"},
  dialogueBrief:"Give each turn a communicative purpose; add any new location vocabulary as unverified, not an original quotation."
 }
 },
 {
 id:"ja:phase24-giving-and-acknowledging",languageId:"ja",title:"Giving an item and responding politely",
 objective:"Contrast giving an item, receiving it with thanks and acknowledging that thanks.",
 explanation:"はい、どうぞ accompanies handing something over. ありがとうございます follows receiving help or an item. どういたしまして can acknowledge gratitude. Ordering these forms gives a coherent service exchange.",
 transferSituation:"At a reading room counter a staff member hands you a requested item; you thank them and they respond.",
 writingInstruction:"Write an original short Japanese counter dialogue with a staff handoff, customer gratitude and the worker's reply. Identify which person says each line.",
 reflection:"Does the person handing over the item express thanks first, or does the recipient?",
 writingChecks:["Have the giver use はい、どうぞ for the handoff.","Have the recipient use ありがとうございます after receiving the item.","Make どういたしまして the response to gratitude, not the request for the item."],
 encounters:[q(polite,p,"はい、どうぞ。"),q(polite,p,"ありがとうございます。"),q(polite,p,"どういたしまして。")],
 guidedQuestion:"Which original phrase can accompany giving something to another person?",guidedAnswer:"はい、どうぞ。",
 independentQuestion:"Which original expression is a response acknowledging thanks?",independentAnswer:"どういたしまして。",
 japaneseExpansion:{
  grammarHeading:"Sequence matters in an exchange",
  grammarExplanation:"はい、どうぞ is a response associated with handing an item to another person. ありがとうございます is said by the grateful recipient, and どういたしまして is one possible acknowledgment by the person who helped.",
  contrastCue:"Compare はい、どうぞ。 and ありがとうございます。: the giver's and recipient's speech acts differ.",
  cloze:{instruction:"Complete the original polite expression of gratitude.",quote:"ありがとうございます。",before:"ありが",answer:"とうございます",after:"。",sourceId:p},
  situationalChoice:{question:"The visitor receives the requested book. Which phrase expresses the visitor's thanks?",correctQuote:"ありがとうございます。"},
  dialogueBrief:"Use a clear three-turn exchange and identify which role speaks, without copying a fictional source transcript."
 }
 },
 {
 id:"ja:phase24-first-meeting-name",languageId:"ja",title:"Opening a first introduction",
 objective:"Combine first-contact greeting, a short です name statement and goodwill in a clear introductory sequence.",
 explanation:"はじめまして opens a first encounter. ミナです。 states a name using the polite です construction; replace the model's name when writing your own dialogue. よろしくお願いします。 expresses goodwill about the relationship or cooperation.",
 transferSituation:"On the first day of a study group you meet a new partner, exchange names and agree to work together next week.",
 writingInstruction:"Write three or four Japanese speaking turns for a first encounter: first-contact opening, your actual name using a short です expression and future cooperation. Explain why you would not repeat はじめまして every day.",
 reflection:"Which source form is the first-contact greeting, which identifies a speaker and which expresses goodwill for working together?",
 writingChecks:["Only use はじめまして for the first encounter.","Introduce your own name with the attested noun + です pattern.","Use よろしくお願いします for goodwill rather than as literal gratitude."],
 encounters:[q(first,f,"はじめまして。"),q(first,f,"ミナです。"),q(first,f,"よろしくお願いします。")],
 guidedQuestion:"Which source phrase identifies the speaker by name?",guidedAnswer:"ミナです。",
 independentQuestion:"Which original expression communicates goodwill after an introduction?",independentAnswer:"よろしくお願いします。",
 japaneseExpansion:{
  grammarHeading:"です closes a simple polite name statement",
  grammarExplanation:"ミナです is a short name statement and です supplies its polite ending. はじめまして is specifically first-contact language, while よろしくお願いします expresses willingness for a good ongoing relationship. Neither is an automatic thank-you.",
  contrastCue:"Compare はじめまして。 with ミナです。; one opens the first meeting and the other explicitly supplies a name.",
  cloze:{instruction:"Complete the attested short polite name statement.",quote:"ミナです。",before:"ミナ",answer:"です",after:"。",sourceId:f},
  situationalChoice:{question:"Which original expression would conclude a first introduction by expressing goodwill?",correctQuote:"よろしくお願いします。"},
  dialogueBrief:"Use your own name rather than Mina in the learner-authored introduction and label who speaks each line."
 }
 },
 {
 id:"ja:phase24-first-meeting-to-help",languageId:"ja",title:"From meeting a classmate to requesting help",
 objective:"Switch politely between first-contact expressions, requesting a stranger's attention and thanking after assistance.",
 explanation:"A first meeting calls for はじめまして. At a desk, すみません requests the assistant's attention. After the assistant helps, ありがとうございます shows gratitude. These are three different speech functions, not interchangeable greetings.",
 transferSituation:"Meet a new classmate at orientation, then ask a separate service-desk worker for the correct room and thank them.",
 writingInstruction:"Write two distinct original Japanese interactions: introduce yourself to the new classmate, then politely request attention and thank the desk worker. Explain when the addressee changes.",
 reflection:"Why does the second exchange not need はじめまして before every request? What happens before gratitude?",
 writingChecks:["Reserve はじめまして for the classmate's first introduction.","Use すみません to request the worker's attention.","Place ありがとうございます after the worker helps you."],
 encounters:[q(first,f,"はじめまして。"),q(polite,p,"すみません。"),q(polite,p,"ありがとうございます。")],
 guidedQuestion:"Which source expression initiates a first meeting with a new classmate?",guidedAnswer:"はじめまして。",
 independentQuestion:"Which expression appropriately follows successful assistance?",independentAnswer:"ありがとうございます。",
 japaneseExpansion:{
  grammarHeading:"The addressee and speech act both change",
  grammarExplanation:"はじめまして marks a first introduction between classmates. すみません, in the counter scenario, gets the worker's attention rather than stating a name. ありがとうございます comes later once assistance has occurred.",
  contrastCue:"Compare はじめまして。 and すみません。: a first-contact social opening is not identical to a practical attention request.",
  cloze:{instruction:"Complete the source's polite expression for getting the worker's attention.",quote:"すみません。",before:"すみ",answer:"ません",after:"。",sourceId:p},
  situationalChoice:{question:"The receptionist has given the correct room; which expression thanks them?",correctQuote:"ありがとうございます。"},
  dialogueBrief:"Write separate interlocutor-labeled scenes, without claiming the new conversation is a verbatim original dialogue."
 }
 }
] as const;
