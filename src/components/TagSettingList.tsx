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
import { openUriInNewTab } from "../openUri";
import { tagSettings } from "../signal";

const convertEnvironmentName = (environmentName: string) => {
  switch (environmentName) {
    case "dev":
      return "開発";
    case "prod":
      return "本番";
  }
  return environmentName;
};

export const TagSettingList = () => {
  const headerTitle = localStorage.getItem("tagSettingsHeaderTitle");
  const uriPrefix = localStorage.getItem("tagSettingUriPrefix");
  const uriSuffix = localStorage.getItem("tagSettingUriSuffix");

  return (
    <Show when={tagSettings() !== undefined} fallback={<></>}>
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
          when={tagSettings() !== null}
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
                  <TableCell>リリース対象イメージタグ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <For each={tagSettings()} fallback={<></>}>
                  {(settingItem) => (
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
                      <TableCell>{settingItem.tags.join(", ")}</TableCell>
                    </TableRow>
                  )}
                </For>
              </TableBody>
            </Table>
          </TableContainer>
        </Show>
      </Box>
    </Show>
  );
};
