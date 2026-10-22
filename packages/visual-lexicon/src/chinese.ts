import type {VisualBinding} from "./types.js";
/** Source-verified Chinese canonicalWordKey(hanzi, pinyin), original demo lessons/P31.
 * Source: thiepn/chinese 9688e7354142b7127fd5f6eb69b03b595a437008. No generic translation joins or official HSK assertions.
 * The artwork depicts a particular scene; consumers must opt in to visual cues.
 */
export const CHINESE_VISUAL_BINDINGS:readonly VisualBinding[]=[
  {
    "languageId": "chinese",
    "lexemeId": "书|shu",
    "conceptId": "object.book"
  },
  {
    "languageId": "chinese",
    "lexemeId": "水|shui",
    "conceptId": "beverage.water"
  },
  {
    "languageId": "chinese",
    "lexemeId": "喝|he",
    "conceptId": "action.drink-from-cup"
  },
  {
    "languageId": "chinese",
    "lexemeId": "吃|chi",
    "conceptId": "action.eat-food"
  },
  {
    "languageId": "chinese",
    "lexemeId": "大|da",
    "conceptId": "relation.larger-box"
  },
  {
    "languageId": "chinese",
    "lexemeId": "小|xiao",
    "conceptId": "relation.smaller-box"
  },
  {
    "languageId": "chinese",
    "lexemeId": "人|ren",
    "conceptId": "person.standing"
  },
  {
    "languageId": "chinese",
    "lexemeId": "写|xie",
    "conceptId": "action.write-with-pencil"
  },
  {
    "languageId": "chinese",
    "lexemeId": "读|du",
    "conceptId": "action.read-book"
  },
  {
    "languageId": "chinese",
    "lexemeId": "商店|shangdian",
    "conceptId": "place.retail-shop"
  },
  {
    "languageId": "chinese",
    "lexemeId": "绿茶|lucha",
    "conceptId": "beverage.green-tea"
  },
  {
    "languageId": "chinese",
    "lexemeId": "冬天|dongtian",
    "conceptId": "season.winter-snow"
  }
];
