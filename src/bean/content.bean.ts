/**
 * po文件解析后的类型
 *
 * @export
 * @interface ContentBean
 */
export interface ContentBean {
  charset: string;
  header: {
    [index: string]: string;
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
