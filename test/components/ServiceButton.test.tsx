import { describe, expect, test } from "vitest";
import { fireEvent, render } from "@solidjs/testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { ServiceButton } from "../../src/components/ServiceButton";
import { service } from "../../src/signal";

describe("<ServiceButton />", () => {
  beforeEach(() => {
    localStorage.removeItem("selectedService");
  });
  afterEach(() => {
    localStorage.removeItem("selectedService");
  });
  test("サービスボタン", async () => {
    const { container, findByText, unmount } = render(() => (
      <ServiceButton serviceName="service1" />
    ));
    // css の名前が動的に変わるので固定値に置換
    const htmlBefore = formatSnapshot(container.innerHTML);
    expect(htmlBefore).toMatchSnapshot();
    // ボタンクリック
    const button = (await findByText("service1")) as HTMLInputElement;
    expect(button).toHaveTextContent("service1");
    fireEvent.click(button);
    // ボタンクリック後の照合
    const htmlAfter = formatSnapshot(container.innerHTML);
    expect(htmlAfter).toMatchSnapshot();
    expect(service()).toBe("service1");
    unmount();
    localStorage.removeItem("selectedService");
  });
});
