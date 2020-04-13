import { TranslationsBean } from "../bean/content.bean";

/**
 *
 *
 * @export
 * @param {TranslationsBean} source 从po文件转换而来
 * @param {TranslationsBean} target 从excel或者json转换而来 一般没有 context
 */
export function mergeTranslation(
  source: TranslationsBean,
  target: TranslationsBean
) {
  const contextKeys = Object.keys(source);
  return contextKeys.reduce((preContexts, contextKey) => {
    const targetContext = target[contextKey] || {};
    const sourceContext = source[contextKey] || {};
    const msgidKeys = Object.keys(sourceContext);

    return {
      ...preContexts,
      [contextKey]: msgidKeys.reduce((preMessage, msgid) => {
        const sourceMessage = sourceContext[msgid];
        const targetMessage = targetContext[msgid];
        const { msgstr: sourceMsgstr = [], comments: sourceComments } =
          sourceMessage || {};
        const { msgstr: targetMsgstr = [] } = targetMessage || {};
        return {
          ...preMessage,
          [msgid]: {
            msgctxt: contextKey || undefined,
            msgid,
            msgid_plural: sourceMessage.msgid_plural || undefined,
            // 导入的情况下取消掉待处理的标示
            comments: { ...sourceComments, flag: undefined },
            msgstr: sourceMsgstr.map((v, i) => targetMsgstr[i] || v),
          },
        };
      }, {}),
    };
  }, {});
}
