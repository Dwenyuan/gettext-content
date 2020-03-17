import fetch from "fetch-jsonp";
import { stringify } from "querystring";
import { baiduUrl } from "./config";
import { MD5 } from "./md5";

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

/**
 * 不符合规范的语言对照表
 */
export const Lang: { [index: string]: Lang } = {
  "zh": "zh",
  "": "zh",
  "zh-cn": "zh",
  zh_CN: "zh",
  ko: "kor",
  en: "en"
};
interface queryParam {
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  query: string;
  from: Lang;
  to: Lang;
}

export function translatorByBaidu(param: {
  query: string;
  from: Lang;
  to: Lang;
}) {
  // FIXME: 这里APPID写死了，应该改动一下的，不过无所谓了
  const appid = "20200308000394792";
  const key = "_0Tw6r0QjfHnVLcp63hR";
  const salt = new Date().getTime();
  const { query, from, to } = param;
  const str1 = appid + query + salt + key;
  const sign = MD5(str1);
  const urlParam = stringify({
    q: query,
    appid,
    salt,
    from,
    to,
    sign
  });
  return fetch(`${baiduUrl}?${urlParam}`);
}
export default { translatorByBaidu };
