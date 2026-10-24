import type {SourceAuthoredIntake,PinnedSourceQuote} from "./source-intake.ts";
const q=(lessonId:string,sourceId:string,quote:string):PinnedSourceQuote=>({lessonId,sourceId,quote});
const greeting="fr:a1-01:shared-pilot",identity="fr:a1-02:shared-pilot",objects="fr:a1-03:shared-pilot";
const a="fr-a1-01-original",b="fr-a1-02-original",c="fr-a1-03-original";
/** Authored new transfer contexts use only verbatim encounters of the pinned French A1 originals. */
export const PHASE23_FRENCH_AUTHORING:readonly SourceAuthoredIntake[]=[
 {
  id:"fr:phase23-register-day-evening",languageId:"fr",title:"Greetings across the day",
  objective:"Select familiar and polite French greetings according to addressee, time and social distance.",
  explanation:"Bonjour opens a daytime exchange, salut is familiar, and bonsoir is appropriate for evening arrivals. Time and relationship are distinct decisions; no single greeting fits every context.",
  transferSituation:"You greet a new course coordinator in daylight, an old classmate later, then an unfamiliar host at an evening reception.",
  writingInstruction:"Write an original three-scene dialogue: a polite daytime greeting, a familiar reply and an evening first encounter. Identify the reason for each register choice.",
  reflection:"Did the greeting change because the listener changed or because the time changed?",
  writingChecks:["Use polite daytime language for an unfamiliar person.","Use the familiar opening only with an acquaintance.","Choose an evening greeting for the later reception."],
  encounters:[q(greeting,a,"Bonjour ! Je m’appelle Inès."),q(greeting,a,"Salut, Inès. Moi, c’est Malik."),q(greeting,a,"Bonsoir, monsieur.")],
  guidedQuestion:"Which source utterance is the familiar greeting between two acquaintances?",guidedAnswer:"Salut, Inès. Moi, c’est Malik.",
  independentQuestion:"Which source utterance is the polite evening opening?",independentAnswer:"Bonsoir, monsieur.",
  frenchExpansion:{
   grammarHeading:"Register and time are separate choices",
   grammarExplanation:"The daytime first meeting begins with Bonjour while the familiar reply uses Salut. The evening utterance begins with Bonsoir. The name attached to the first greeting is not a required part of the word bonjour.",
   contrastCue:"Compare the source's polite opening and familiar reply: their register differs although both occur in the daytime.",
   cloze:{instruction:"Restore the original introductory construction after Bonjour.",quote:"Bonjour ! Je m’appelle Inès.",before:"Bonjour ! Je ",answer:"m’appelle",after:" Inès.",sourceId:a},
   situationalChoice:{question:"An unfamiliar host arrives at an evening reception. Which original opener fits?",correctQuote:"Bonsoir, monsieur."},
   dialogueBrief:"Give three distinct speakers appropriate original greetings in your own authored situation."
  }
 },
 {
  id:"fr:phase23-name-farewell",languageId:"fr",title:"Introductions and departures",
  objective:"Separate a polite evening arrival, a personal name introduction and a goodbye that anticipates tomorrow.",
  explanation:"Bonsoir opens an evening meeting; je m’appelle introduces your name; au revoir ends the encounter. À demain means that you expect to meet the listener again tomorrow.",
  transferSituation:"At a volunteer event, introduce yourself to a new organizer and leave after arranging to meet the same person tomorrow.",
  writingInstruction:"Write an original French multi-turn dialogue with the organizer: greet, give your own name and leave with a tomorrow-oriented farewell.",
  reflection:"Which utterance introduces you, and which changes the conversation from arriving to departing?",
  writingChecks:["Use the evening greeting before giving your name.","Keep the reflexive m’ in the name introduction.","Use a departure expression at the end."],
  encounters:[q(greeting,a,"Bonsoir, monsieur."),q(greeting,a,"Je m’appelle Inès."),q(greeting,a,"Au revoir, à demain.")],
  guidedQuestion:"Which source line states the speaker's name?",guidedAnswer:"Je m’appelle Inès.",
  independentQuestion:"Which source expression marks goodbye and tomorrow's meeting?",independentAnswer:"Au revoir, à demain.",
  frenchExpansion:{
   grammarHeading:"Je m’appelle is a name construction",
   grammarExplanation:"The m’ is required in je m’appelle, unlike a noun phrase after je suis. Bonsoir is an opening, while au revoir, à demain closes the encounter and anticipates a future one.",
   contrastCue:"An evening greeting opens a conversation; a name introduction provides identity rather than a new greeting.",
   cloze:{instruction:"Complete the original goodbye expression.",quote:"Au revoir, à demain.",before:"Au ",answer:"revoir",after:", à demain.",sourceId:a},
   situationalChoice:{question:"Which original line belongs when leaving after arranging tomorrow's meeting?",correctQuote:"Au revoir, à demain."},
   dialogueBrief:"Use a separate speaking turn for the name and a final speaking turn for the goodbye."
  }
 },
 {
  id:"fr:phase23-etre-speaker-group",languageId:"fr",title:"Être with a speaker and a group",
  objective:"Distinguish je suis, nous sommes and elles sont for personal occupations and statements about a group.",
  explanation:"Être is irregular: je suis accompanies the speaker, nous sommes a group including the speaker, and elles sont a feminine plural group. The plural ending of étudiantes is a separate agreement choice.",
  transferSituation:"A visiting class asks your occupation, where your study group meets, and what several women in that group study.",
  writingInstruction:"Compose a new three-turn French conversation identifying your role, a group's location and the identity of a female plural group. Explain which verb form each subject requires.",
  reflection:"What changes when the grammatical subject shifts from je to nous to elles?",
  writingChecks:["Pair the singular subject je with the irregular verb form suis.","Use the plural verb form sommes when the subject is nous.","Use sont with elles and notice feminine plural agreement."],
  encounters:[q(identity,b,"Je suis professeur."),q(identity,b,"Nous sommes à Lyon."),q(identity,b,"Elles sont étudiantes.")],
  guidedQuestion:"Which source sentence locates a group including the speaker?",guidedAnswer:"Nous sommes à Lyon.",
  independentQuestion:"Which source sentence describes a feminine plural student group?",independentAnswer:"Elles sont étudiantes.",
  frenchExpansion:{
   grammarHeading:"Être changes with its subject",
   grammarExplanation:"Je suis differs from nous sommes and elles sont. The source describes both an individual role and groups. Do not use sommes with je, or suis with elles. Étudiantes additionally marks feminine plural agreement.",
   contrastCue:"The source's singular je suis statement and plural nous sommes sentence contrast subject and verb form.",
   cloze:{instruction:"Complete the original group-location statement with the correct form of être.",quote:"Nous sommes à Lyon.",before:"Nous ",answer:"sommes",after:" à Lyon.",sourceId:b},
   situationalChoice:{question:"Which original statement describes several female students?",correctQuote:"Elles sont étudiantes."},
   dialogueBrief:"Distinguish the speakers and the group described rather than copying one source sentence as a complete dialogue."
  }
 },
 {
  id:"fr:phase23-etre-place-agreement",languageId:"fr",title:"Places, people and agreement",
  objective:"Distinguish the third-person est from direct-address es and notice feminine adjective agreement.",
  explanation:"Il est à Paris. locates a third person. Elle est française. gives feminine nationality. Tu es étudiante ? directly asks a familiar listener. Both subject agreement and the function of the statement change.",
  transferSituation:"A classmate asks about a visitor's location, a colleague's nationality and whether you are enrolled as a student.",
  writingInstruction:"Write a short original interview including one third-person location, one feminine nationality description and a familiar direct question. Explain why tu takes es.",
  reflection:"Who is being addressed in tu es, and who is only described in il/elle est?",
  writingChecks:["Retain the third-person est with il or elle.","Maintain feminine française with elle.","Use es rather than est after tu."],
  encounters:[q(identity,b,"Il est à Paris."),q(identity,b,"Elle est française."),q(identity,b,"Tu es étudiante ?")],
  guidedQuestion:"Which source sentence directly asks a familiar listener a question?",guidedAnswer:"Tu es étudiante ?",
  independentQuestion:"Which original sentence uses feminine nationality agreement?",independentAnswer:"Elle est française.",
  frenchExpansion:{
   grammarHeading:"Tu es versus il or elle est",
   grammarExplanation:"The second-person tu uses es; third-person il and elle use est. The adjective française agrees with the woman described and is independent of conjugating être.",
   contrastCue:"Contrast the description of elle with the direct tu question; the grammatical person and communicative act both change.",
   cloze:{instruction:"Complete the original second-person question.",quote:"Tu es étudiante ?",before:"Tu ",answer:"es",after:" étudiante ?",sourceId:b},
   situationalChoice:{question:"Which original line describes a woman's French nationality?",correctQuote:"Elle est française."},
   dialogueBrief:"Give the interviewer and respondents separate turns, without treating third-person statements as second-person questions."
  }
 },
 {
  id:"fr:phase23-un-des-le",languageId:"fr",title:"First mentions and known objects",
  objective:"Contrast indefinite un and des for new objects with definite le for one previously identified book.",
  explanation:"C’est un livre. introduces an unknown masculine book. Voici des stylos. introduces plural pens. Le livre est sur la table. refers to the same known book; this changes definiteness, not the book's grammatical gender.",
  transferSituation:"At a desk you introduce a book and several pens, then explain to a friend where the now-known book has been put.",
  writingInstruction:"Write an original two-person classroom dialogue introducing a new book and pens, then locating the book in a later speaking turn. Explain why the referent changes from un to le.",
  reflection:"Why does the listener understand which book le livre refers to at the end?",
  writingChecks:["Introduce a new masculine singular book using un.","Introduce new plural pens with des.","Use le to return to an already identifiable book."],
  encounters:[q(objects,c,"C’est un livre."),q(objects,c,"Voici des stylos."),q(objects,c,"Le livre est sur la table.")],
  guidedQuestion:"Which source phrase introduces new plural pens?",guidedAnswer:"Voici des stylos.",
  independentQuestion:"Which source sentence locates a previously introduced book?",independentAnswer:"Le livre est sur la table.",
  frenchExpansion:{
   grammarHeading:"Definiteness differs from number",
   grammarExplanation:"Un and le can both describe the same masculine singular noun livre but differ in whether it is already identified. Des presents indefinite plural objects. Le livre refers to a specific book and cannot stand in for any group of pens.",
   contrastCue:"The first mention C’est un livre. and later Le livre est sur la table. differ in definiteness, not the book's gender.",
   cloze:{instruction:"Complete the source's first introduction of the singular book.",quote:"C’est un livre.",before:"C’est ",answer:"un",after:" livre.",sourceId:c},
   situationalChoice:{question:"The listener knows which book is meant. Which source line says where it is?",correctQuote:"Le livre est sur la table."},
   dialogueBrief:"Make the same book identifiable through the whole conversation; distinguish introducing it from referring back to it."
  }
 },
 {
  id:"fr:phase23-une-elision-les",languageId:"fr",title:"Feminine, elision and plural reference",
  objective:"Use source contrasts to distinguish une for feminine introductions, l’ before a vowel and les for plural definite objects.",
  explanation:"Une table est ici. introduces a feminine singular noun. L’école est ouverte. uses a definite singular article elided before a vowel. Regarde : les stylos sont sur la table. shows definite plural reference; elision does not itself reveal gender.",
  transferSituation:"A host shows a newcomer a table, points out the school that both already know, then locates several known pens.",
  writingInstruction:"Write a three-step guided-tour conversation in original French using a feminine first mention, definite vowel-initial school reference and definite plural pens. Explain why l’ and les have different functions.",
  reflection:"Does l’ reveal the gender of école? How does that differ from definite plural les?",
  writingChecks:["Use une for a newly introduced feminine table.","Use l’ before the vowel in école.","Use les to refer to known plural pens."],
  encounters:[q(objects,c,"Une table est ici."),q(objects,c,"L’école est ouverte."),q(objects,c,"Regarde : les stylos sont sur la table.")],
  guidedQuestion:"Which original line shows definite l’ before a vowel?",guidedAnswer:"L’école est ouverte.",
  independentQuestion:"Which source utterance identifies several known pens?",independentAnswer:"Regarde : les stylos sont sur la table.",
  frenchExpansion:{
   grammarHeading:"Elision and plural definiteness are distinct",
   grammarExplanation:"L’ is a singular definite article before a vowel or mute h; its spelling alone does not determine gender. Les is definite plural for nouns of either gender. Une is feminine singular indefinite, so it does not have the same function as either definite form.",
   contrastCue:"The original feminine indefinite Une table est ici. contrasts with the definite vowel-initial L’école est ouverte.",
   cloze:{instruction:"Complete the exact original form with l’ before the vowel-initial noun.",quote:"L’école est ouverte.",before:"L’",answer:"école",after:" est ouverte.",sourceId:c},
   situationalChoice:{question:"Which original line refers to the already identified plural pens?",correctQuote:"Regarde : les stylos sont sur la table."},
   dialogueBrief:"Keep each stop of the tour in separate speaker turns; do not mislabel the constructed tour as an original source transcript."
  }
 }
] as const;
