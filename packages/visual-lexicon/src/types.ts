export interface VisualBinding{
 readonly languageId:string;
 readonly lexemeId:string;
 readonly conceptId:string;
 /** Required when the app has approved multiple imageable senses for one lexical ID. */
 readonly senseId?:string;
}
