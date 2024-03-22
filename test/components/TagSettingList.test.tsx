import { describe, expect, test, vi } from "vitest";
import { render } from "@solidjs/testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { TagSettingList } from "../../src/components/TagSettingList";
import { setTagSettings } from "../../src/signal";

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
      title: "リポジトリにレコード1つ（warning）",
      colors: '{"dev":"#616161","prod":"#212121"}',
      header: "ヘッダータイトル2",
      uriPrefix: "http://",
      uriSuffix: "-test.example.com",
      settings: [
        {
          environment_name: "prod",
          tags: ["release", "testtest"],
          pushed_at: new Date("2024-01-01T23:05:00+0900"),
        },
      ],
      expected: ["本番環境設定"],
    },
    {
      title: "リポジトリにレコード2つ（うち1つerror）",
      colors: '{"dev":"#616161","prod":"#212121"}',
      header: "ヘッダータイトル3",
      uriPrefix: "http://",
      uriSuffix: "-test.example.com",
      settings: [
        {
          environment_name: "dev",
          tags: ["hogefuga", "latest"],
          pushed_at: new Date("2024-03-01T23:05:00+0900"),
        },
        {
          environment_name: "prod",
          tags: ["release", "testtest"],
          pushed_at: new Date("2023-10-01T23:05:00+0900"),
        },
      ],
      expected: ["開発環境設定", "本番環境設定"],
    },
  ];
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.removeItem("tagButtonColor");
    localStorage.removeItem("tagSettingsHeaderTitle");
    localStorage.removeItem("tagSettingUriPrefix");
    localStorage.removeItem("tagSettingUriSuffix");
  });
  afterEach(() => {
    vi.useRealTimers();
    localStorage.removeItem("tagButtonColor");
    localStorage.removeItem("tagSettingsHeaderTitle");
    localStorage.removeItem("tagSettingUriPrefix");
    localStorage.removeItem("tagSettingUriSuffix");
  });
  tagSettingList.forEach((testCase) => {
    test(testCase.title, () => {
      const date = new Date("2024-03-22T23:05:00+0900");
      vi.setSystemTime(date);
      if (testCase.colors) {
        localStorage.setItem("tagButtonColor", testCase.colors);
      }
      localStorage.setItem("tagSettingsHeaderTitle", testCase.header);
      localStorage.setItem("tagSettingUriPrefix", testCase.uriPrefix);
      localStorage.setItem("tagSettingUriSuffix", testCase.uriSuffix);
      setTagSettings(testCase.settings);
      const { container, getByText, unmount } = render(() => (
        <TagSettingList />
      ));
      // css の名前が動的に変わるので固定値に置換
      const html = formatSnapshot(container.innerHTML);
      expect(html).toMatchSnapshot();
      // ヘッダータイトル
      const headerTitle = getByText(testCase.header) as HTMLElement;
      expect(headerTitle).toHaveTextContent(testCase.header);
      // 各ボタン（クリックしない）または「リポジトリにイメージがありません」
      testCase.expected.forEach((environment) => {
        const text = getByText(environment) as HTMLElement;
        expect(text).toHaveTextContent(environment);
      });
      // 各タグ
      if (testCase.settings) {
        testCase.settings.forEach((setting) => {
          const tags = setting.tags.join(", ");
          const text = getByText(tags) as HTMLElement;
          expect(text).toHaveTextContent(tags);
        });
      }
      unmount();
    });
  });
});
