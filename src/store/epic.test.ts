import "lodash";
import configureStore from ".";
import { Store } from "redux";
import { PRE_TRANSLATOR, SET_CONTENT } from "./actions";
import { mock } from "mockjs";
import { baiduUrl } from "../services/config";
import { TestScheduler } from "rxjs/testing";
import { of } from "rxjs";
import { preTranslator, exactQueryStr, spliceStr } from "./epic";
import { sourceLanguage } from "../bean/content.bean";
import { translatorByBaidu, Lang } from "../services/translator.service";

// let testScheduler = new TestScheduler((actual, expected) => {
//   console.log("actural", actual);
// });
// let store: Store;

const state = {
  SelectedTranslation: { selectedId: undefined },
  ContentReducer: {
    charset: "utr-8",
    headers: {
      Language: "zh_CN"
    },
    translations: {
      "": {
        _未选择_: { msgstr: [] },
        "--请选择--": { msgstr: [] },
        "--请选择国家--(最多可选择10个国家)": { msgstr: [] },
        "--请选择APP连接跳转方式--": { msgstr: [] },
        "./advanceNotice-list.jsp": { msgstr: [] },
        "./resource-editAdvertPosType.jsp": { msgstr: [] },
        "./resource-hrefPositionDetail.jsp": { msgstr: [] },
        "(*非必选*没有选择线路默认支持所有线路可用)": { msgstr: [""] },
        "（不填表示无固定尺寸）": { msgstr: [] },
        "(非必填建议填入可使用此优惠券的商品/店铺列表页)": { msgstr: [] },
        "（可多填，以英文符号【;】隔开）": { msgstr: [] },
        "*非必选*没有选择国家默认支持所有国家可用": { msgstr: [] }
      }
    }
  }
};
beforeEach(() => {
  //   store = configureStore();
  //   mock(new RegExp(baiduUrl), {
  //     from: "AAA",
  //     to: "BBB",
  //     "trans_result|1-6": [{ src: "@paragraph(1,6)", dst: "@cparagraph(1,4)" }]
  //   });
});

// test("测试mock", async () => {
//   const res = await fetch("www.baidu.com");
//   const data = await res.json();
//   expect("AAA").toBe(data.from);
// });
test("测试预预翻译方法", () => {
  //   testScheduler.run(({ hot, cold, expectObservable }) => {
  //     const action$ = hot("-a", { a: { type: PRE_TRANSLATOR } });
  //     const state$ = of({
  //       SelectedTranslation: { selectedId: undefined },
  //       ContentReducer: {
  //         charset: "utr-8",
  //         headers: {
  //           Language: "zh_CN"
  //         },
  //         translations: {
  //           "": {
  //             _未选择_: { msgstr: [] },
  //             "--请选择--": { msgstr: [] },
  //             "--请选择国家--(最多可选择10个国家)": { msgstr: [] },
  //             "--请选择APP连接跳转方式--": { msgstr: [] },
  //             "./advanceNotice-list.jsp": { msgstr: [] },
  //             "./resource-editAdvertPosType.jsp": { msgstr: [] },
  //             "./resource-hrefPositionDetail.jsp": { msgstr: [] },
  //             "(*非必选*没有选择线路默认支持所有线路可用)": { msgstr: [""] },
  //             "（不填表示无固定尺寸）": { msgstr: [] },
  //             "(非必填建议填入可使用此优惠券的商品/店铺列表页)": { msgstr: [] },
  //             "（可多填，以英文符号【;】隔开）": { msgstr: [] },
  //             "*非必选*没有选择国家默认支持所有国家可用": { msgstr: [] }
  //           }
  //         }
  //       }
  //     });
  //     const output$ = preTranslator(action$, state$);
  //     expectObservable(output$).toBe("---------a", {
  //       a: {
  //         type: PRE_TRANSLATOR
  //       }
  //     });
  //   });
});

test("测试百度请求", async () => {
  const {
    headers: { Language }
  } = state.ContentReducer;
  const msgIds = exactQueryStr({
    ContentReducer: state.ContentReducer
  });
  const [query] = spliceStr(msgIds);
  const res = await translatorByBaidu({
    query,
    from: sourceLanguage,
    to: Lang[Language]
  });
  const data = await res.json();
  console.log(data);
});
