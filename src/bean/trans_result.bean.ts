import { Lang } from "../services/translator.service";

/**
 * 百度翻译返回结果
 *
 * @export
 * @interface BaiduTransResultBean
 */
export interface BaiduTransResultBean {
  from: Lang;
  to: Lang;
  trans_result?: Array<{ src: string; dst: string }>;
}
