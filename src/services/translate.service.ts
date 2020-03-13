export type Lang =
  | "zh" // 中文
  | "en" // 英文
  | "yue" // 粤语
  | "wyw" // 文言文
  | "jp" // 日语
  | "kor" // 韩语
  | "fra" // 法语
  | "spa" // 西班牙
  | "th" // 泰语
  | "ara" // 阿拉伯
  | "ru" // 俄语
  | "pt" // 葡萄牙
  | "de" // 德国
  | "it" // 意大利
  | "el" // 希腊
  | "cht"; // 繁体中文

interface queryParam {
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  query: string;
  from: Lang;
  to: Lang;
}
