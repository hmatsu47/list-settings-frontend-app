import { describe, expect, test } from "vitest";
import { render } from "@solidjs/testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { Message } from "../../src/components/Message";
import { setMessage, setMessageSeverity } from "../../src/signal";

describe("<Message />", () => {
  const messageList = [
    {
      title: "正常処理",
      message: "これは正常に処理されたときのメッセージです",
      severity: "success",
    },
    {
      title: "エラー",
      message: "これはエラーが出たときのメッセージです",
      severity: "error",
    },
  ];
  messageList.forEach((testCase) => {
    test(testCase.title, async () => {
      setMessage(testCase.message);
      setMessageSeverity(testCase.severity === "success" ? "success" : "error");
      const { container, getByText, unmount } = render(() => <Message />);
      const message = (await getByText(testCase.message)) as HTMLElement;
      expect(message).toHaveTextContent(testCase.message);
      // css の名前が動的に変わるので固定値に置換
      const html = formatSnapshot(container.innerHTML);
      expect(html).toMatchSnapshot();
      unmount();
    });
  });
});
