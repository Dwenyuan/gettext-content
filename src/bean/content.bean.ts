import { Lang } from "../services/translator.service";

/**
 * po文件解析后的类型
 *
 * @export
 * @interface TranslationBean
 */
export interface TranslationBean {
  charset: string;
  headers: {
    "Project-Id-Version"?: string;
    "POT-Creation-Date"?: string;
    "PO-Revision-Date"?: string;
    "Last-Translator"?: string;
    "Language-Team"?: string;
    Language?: string;
    "MIME-Version"?: string;
    "Content-Type"?: string;
    "Content-Transfer-Encoding"?: string;
    "X-Generator"?: string;
    "X-Poedit-Basepath"?: string;
    "Plural-Forms"?: string;
    "X-Poedit-KeywordsList"?: string;
    "X-Poedit-SearchPath-0"?: string;
  };
  translations: {
    [context: string]: {
      [msgid: string]: Translation;
    };
  };
}
export interface Translation {
  msgid?: string;
  comments?: Comment;
  msgstr?: string[];
}
export interface Comment {
  reference?: string;
  translator?: string;
  extracted?: string;
  flag?: string;
  previous?: string;
}

export interface TranslationHeaders {
  "Project-Id-Version"?: string;
  "POT-Creation-Date"?: string;
  "PO-Revision-Date"?: string;
  "Last-Translator"?: string;
  "Language-Team"?: string;
  Language?: string;
  "MIME-Version"?: string;
  "Content-Type"?: string;
  "Content-Transfer-Encoding"?: string;
  "X-Generator"?: string;
  "X-Poedit-Basepath"?: string;
  "Plural-Forms"?: string;
  "X-Poedit-KeywordsList"?: string;
  "X-Poedit-SearchPath-0"?: string;
}

export const sourceLanguage = "zh" as Lang;
