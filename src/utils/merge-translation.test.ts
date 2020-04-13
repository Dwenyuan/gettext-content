import { mergeTranslation } from "./merge-translation";

describe("测试合并方法", () => {
  it("测试合并方法-msgstr改", () => {
    const source = {
      "": {
        名: {
          msgid: "名",
          msgstr: ["First name"],
        },
        请填写收件人名: {
          msgid: "请填写收件人名",
          msgstr: ["Please enter first name"],
        },
        姓: {
          msgid: "姓",
          msgstr: ["Last name"],
        },
      },
    };
    const target = {
      "": {
        名: {
          msgid: "名",
          msgstr: ["First name"],
        },
        请填写收件人名: {
          msgid: "请填写收件人名",
          msgstr: ["Please enter first name"],
        },
        姓: {
          msgid: "姓",
          msgstr: ["hello name"],
        },
      },
    };
    const result = mergeTranslation(source, target);
    expect(result).toMatchObject({
      "": {
        名: {
          msgid: "名",
          msgstr: ["First name"],
        },
        请填写收件人名: {
          msgid: "请填写收件人名",
          msgstr: ["Please enter first name"],
        },
        姓: {
          msgid: "姓",
          msgstr: ["hello name"],
        },
      },
    });
  });
  it("测试合并方法-context/msgid多余", () => {
    const source = {
      "": {
        姓: {
          msgid: "姓",
          msgstr: ["Last name"],
        },
      },
    };
    const target = {
      "": {
        姓A: {
          msgid: "姓",
          msgstr: ["hello name"],
        },
      },
      A: {
        名: {
          msgid: "名",
          msgstr: ["First name"],
        },
      },
    };
    const result = mergeTranslation(source, target);
    expect(result).toMatchObject({
      "": {
        姓: {
          msgid: "姓",
          msgstr: ["Last name"],
        },
      },
    });
  });
  it("测试合并方法-context/msgid不足", () => {
    const source = {
      "": {
        姓: {
          msgid: "姓",
          msgstr: ["Last name"],
        },
      },
      A: {
        名: {
          msgid: "名",
          msgstr: ["First name"],
        },
      },
    };
    const target = {
      "": {
        姓: {
          msgid: "姓",
          msgstr: ["hello name"],
        },
      },
    };
    const result = mergeTranslation(source, target);
    expect(result).toMatchObject({
      "": {
        姓: {
          msgid: "姓",
          msgstr: ["hello name"],
        },
      },
      A: {
        名: {
          msgid: "名",
          msgstr: ["First name"],
        },
      },
    });
  });
});
