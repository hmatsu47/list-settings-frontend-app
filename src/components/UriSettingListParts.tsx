import { For, Show } from "solid-js";
import Box from "@suid/material/Box";
import Button from "@suid/material/Button";
import TableCell from "@suid/material/TableCell";
import TableRow from "@suid/material/TableRow";
import { service } from "../signal";
import { formatDateTimeDisplay } from "../formatDateTime";
import { UriSetting } from "../type";
import { openUriInNewTab } from "../openUri";

const convertEnvironmentName = (environmentName: string) => {
  switch (environmentName) {
    case "stg":
      return "ステージング";
    case "prod":
      return "本番";
  }
  return environmentName;
};

type Props = {
  settings: UriSetting[] | null | undefined;
};

export const UriSettingListParts = (props: Props) => {
  const uriPrefix = localStorage.getItem("uriSettingUriPrefix");
  const uriSuffix = localStorage.getItem("uriSettingUriSuffix");

  return (
    <Show when={props.settings} fallback={<></>}>
      <For each={props.settings} fallback={<></>}>
        {(settingItem) => (
          <Show when={settingItem.service_name === service()} fallback={<></>}>
            <TableRow>
              <TableCell component="th" scope="row">
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => {
                    openUriInNewTab(
                      `${uriPrefix}${settingItem.environment_name}${uriSuffix}`
                    );
                  }}
                  sx={{ textTransform: "none" }}
                  title={`${convertEnvironmentName(
                    settingItem.environment_name
                  )}環境のリリース設定画面を開く`}
                >
                  {convertEnvironmentName(settingItem.environment_name)}
                  環境設定
                </Button>
              </TableCell>
              <TableCell>
                {settingItem.next_release
                  ? `次回：${settingItem.next_release.image_uri}`
                  : settingItem.last_released
                  ? `前回：${settingItem.last_released.image_uri}`
                  : "（未設定）"}
              </TableCell>
              <TableCell>
                {settingItem.next_release
                  ? `次回：${formatDateTimeDisplay(
                      new Date(settingItem.next_release.release_at)
                    )}`
                  : settingItem.last_released
                  ? `前回：${formatDateTimeDisplay(
                      new Date(settingItem.last_released.released_at)
                    )}`
                  : "（未設定）"}
              </TableCell>
            </TableRow>
          </Show>
        )}
      </For>
    </Show>
  );
};
