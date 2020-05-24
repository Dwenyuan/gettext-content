import { TranslationsBean } from "gettext-lib";

/**
 *
 *
 * @export
 * @param {TranslationsBean} source 从po文件转换而来
 * @param {TranslationsBean} target 从excel或者json转换而来 一般没有 context
 */
/**
 *
 *
 * @export
 * @param {TranslationsBean} source 从po文件转换而来
 * @param {TranslationsBean} target 从excel或者json转换而来 一般没有 context
 * @param {boolean} [override=false] 是否强制覆盖，如果target的条目比source的多，强制覆盖下结果列表中会有target多出的条目
 * @returns
 */
export function mergeTranslation(
  source: TranslationsBean,
  target: TranslationsBean,
  override: boolean = false
) {
  const sourceContextKeys = Object.keys(source);
  const sourceContexts = sourceContextKeys.reduce((preContexts, contextKey) => {
    const targetContext = target[contextKey] || {};
    const sourceContext = source[contextKey] || {};
    const sourceMsgid = Object.keys(sourceContext);

    const sourceContextContent = sourceMsgid.reduce((preMessage, msgid) => {
      const sourceMessage = sourceContext[msgid] || {};
      const targetMessage = targetContext[msgid] || {};
      const {
        msgstr: sourceMsgstr = [],
        comments: sourceComments,
      } = sourceMessage;
      const {
        msgstr: targetMsgstr = [],
        comments: targetComments,
      } = targetMessage;
      return {
        ...preMessage,
        [msgid]: {
          msgctxt: contextKey || undefined,
          msgid,
          msgid_plural:
            targetMessage.msgid_plural || sourceMessage.msgid_plural,
          comments: {
            reference: targetComments?.reference || sourceComments?.reference,
            translator:
              targetComments?.translator || sourceComments?.translator,
            extracted: targetComments?.extracted || sourceComments?.extracted,
            flag: targetComments?.flag || sourceComments?.flag,
            previous: targetComments?.previous || sourceComments?.previous,
          },
          msgstr: (sourceMsgstr.length > targetMsgstr.length
            ? sourceMsgstr
            : targetMsgstr
          ).map((v, i) => targetMsgstr[i] || v),
        },
      };
    }, {});
    if (!override) {
      return {
        ...preContexts,
        [contextKey]: sourceContextContent,
      };
    }
    const restMsgids = Object.keys(targetContext).filter(
      (f) => !sourceMsgid.includes(f)
    );
    const rest = restMsgids.reduce(
      (pre, MsgidKey) => ({
        ...pre,
        [MsgidKey]: targetContext[MsgidKey],
      }),
      {}
    );
    return {
      ...preContexts,
      [contextKey]: { ...sourceContextContent, ...rest },
    };
  }, {});

  // 如果强制覆盖的话那么也要加上target中多出的条目
  const restkeys = Object.keys(target).filter(
    (f) => !sourceContextKeys.includes(f)
  );
  const rest = restkeys.reduce(
    (pre, contextKey) => ({ ...pre, [contextKey]: target[contextKey] }),
    {}
  );
  return override ? { ...sourceContexts, ...rest } : sourceContexts;
}
