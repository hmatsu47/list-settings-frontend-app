import { describe, expect, test } from "vitest";
import { render } from "@solidjs/testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { TagSettingList } from "../../src/components/TagSettingList";
import { setTagSettings } from "../../src/signal";
import { TagSetting } from "../../src/type";

describe("<TagSettingList />", () => {
  const tagSettingList = [
    {
      title: "色設定なし・リポジトリにレコードなし",
      colors: undefined,
      header: "ヘッダータイトル1",
      uriPrefix: "http://",
      uriSuffix: "-test.example.com",
      settings: null,
      expected: ["リポジトリにイメージがありません"],
    },
    {
      title: "リポジトリにレコード1つ",
      colors: '{"dev":"#616161","prod":"#212121"}',
      header: "ヘッダータイトル2",
      uriPrefix: "http://",
      uriSuffix: "-test.example.com",
      settings: [{ environment_name: "prod", tags: ["release", "testtest"] }],
      expected: ["本番環境設定"],
    },
    {
      title: "リポジトリにレコード2つ",
      colors: '{"dev":"#616161","prod":"#212121"}',
      header: "ヘッダータイトル3",
      uriPrefix: "http://",
      uriSuffix: "-test.example.com",
      settings: [
        { environment_name: "dev", tags: ["hogefuga", "latest"] },
        { environment_name: "prod", tags: ["release", "testtest"] },
      ],
      expected: ["開発環境設定", "本番環境設定"],
    },
  ];
  beforeEach(() => {
    localStorage.removeItem("tagButtonColor");
    localStorage.removeItem("tagSettingsHeaderTitle");
    localStorage.removeItem("tagSettingUriPrefix");
    localStorage.removeItem("tagSettingUriSuffix");
  });
  afterEach(() => {
    localStorage.removeItem("selectedService");
  });
  tagSettingList.forEach((testCase) => {
    test(testCase.title, async () => {
      if (testCase.colors) {
        localStorage.setItem("tagButtonColor", testCase.colors);
      }
      localStorage.setItem("tagSettingsHeaderTitle", testCase.header);
      localStorage.setItem("tagSettingUriPrefix", testCase.uriPrefix);
      localStorage.setItem("tagSettingUriSuffix", testCase.uriSuffix);
      setTagSettings(testCase.settings);
      const { container, findByText, unmount } = render(() => (
        <TagSettingList />
      ));
      // css の名前が動的に変わるので固定値に置換
      const html = formatSnapshot(container.innerHTML);
      expect(html).toMatchSnapshot();
      // ヘッダータイトル
      const headerTitle = (await findByText(testCase.header)) as HTMLElement;
      expect(headerTitle).toHaveTextContent(testCase.header);
      // 各ボタン（クリックしない）または「リポジトリにイメージがありません」
      testCase.expected.forEach(async (environment) => {
        const text = (await findByText(environment)) as HTMLElement;
        expect(text).toHaveTextContent(environment);
      });
      unmount();
    });
  });
});
