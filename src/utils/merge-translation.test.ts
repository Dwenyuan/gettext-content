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
  it("测试强制覆盖时的合并", () => {
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
      B: {
        名B: {
          msgid: "名B",
          msgstr: ["B name"],
        },
      },
    };
    const result = mergeTranslation(source, target, true);
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
      B: {
        名B: {
          msgid: "名B",
          msgstr: ["B name"],
        },
      },
    });
  });

  it("测试从POT文件更新已有PO文件时的合并情况", () => {
    const target = {
      "": {
        姓: {
          msgid: "姓",
          msgstr: ["新项目 %d"],
        },
      },
      A: {
        名: {
          msgid: "名",
          msgstr: ["First name"],
        },
      },
    };
    const source = {
      "": {
        姓: {
          msgid: "姓",
          msgid_plural: "新建S %d",
          msgstr: [],
        },
        key: {
          msgid: "key",
          msgid_plural: "keys",
          msgstr: [],
        },
      },
      A: {
        名: {
          msgid: "名",
          msgstr: [],
        },
      },
    };
    const result = mergeTranslation(source, target, true);
    expect(result).toMatchObject({
      "": {
        姓: {
          msgid: "姓",
          msgid_plural: "新建S %d",
          msgstr: ["新项目 %d"],
        },
        key: {
          msgid: "key",
          msgid_plural: "keys",
          msgstr: [],
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
