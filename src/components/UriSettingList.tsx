import { For, Show } from "solid-js";
import Box from "@suid/material/Box";
import Button from "@suid/material/Button";
import Paper from "@suid/material/Paper";
import Table from "@suid/material/Table";
import TableBody from "@suid/material/TableBody";
import TableCell from "@suid/material/TableCell";
import TableContainer from "@suid/material/TableContainer";
import TableHead from "@suid/material/TableHead";
import TableRow from "@suid/material/TableRow";
import Typography from "@suid/material/Typography";
import { service, uriRemoteSettings, uriSettings } from "../signal";
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

export const UriSettingList = () => {
  const headerTitle = localStorage.getItem("uriSettingsHeaderTitle");

  return (
    <Show
      when={
        (service() && uriRemoteSettings() !== undefined) ||
        uriSettings() !== undefined
      }
      fallback={<></>}
    >
      <Box
        sx={{
          width: "100%",
          minWidth: "1024px",
          display: "flex",
        }}
        aria-live="polite"
      >
        <Typography variant="h3">{headerTitle}</Typography>
        <Show
          when={uriRemoteSettings() !== null && uriSettings() !== null}
          fallback={
            <Typography variant="h6">
              リポジトリにイメージがありません
            </Typography>
          }
        >
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>設定</TableCell>
                  <TableCell>イメージURI</TableCell>
                  <TableCell>リリース日時</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <SettingListParts settings={uriRemoteSettings()} />
                <SettingListParts settings={uriSettings()} />
              </TableBody>
            </Table>
          </TableContainer>
        </Show>
      </Box>
    </Show>
  );
};

type Props = {
  settings: UriSetting[] | null | undefined;
};

const SettingListParts = (props: Props) => {
  const uriPrefix = localStorage.getItem("uriSettingUriPrefix");
  const uriSuffix = localStorage.getItem("uriSettingUriSuffix");

  return (
    <Show when={props.settings} fallback={<></>}>
      <Box
        sx={{
          width: "100%",
          minWidth: "1024px",
          display: "flex",
        }}
        aria-live="polite"
      >
        <For each={props.settings} fallback={<></>}>
          {(settingItem) => (
            <Show
              when={settingItem.service_name === service()}
              fallback={<></>}
            >
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
                    ? settingItem.next_release.image_uri
                    : settingItem.last_released.image_uri
                    ? settingItem.last_released.image_uri
                    : ""}
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
                    : ""}
                </TableCell>
              </TableRow>
            </Show>
          )}
        </For>
      </Box>
    </Show>
  );
};
