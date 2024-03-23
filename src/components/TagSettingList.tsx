import { For, Show } from "solid-js";
import Box from "@suid/material/Box";
import Button from "@suid/material/Button";
import Paper from "@suid/material/Paper";
import Stack from "@suid/material/Stack";
import Table from "@suid/material/Table";
import TableBody from "@suid/material/TableBody";
import TableCell from "@suid/material/TableCell";
import TableContainer from "@suid/material/TableContainer";
import TableHead from "@suid/material/TableHead";
import TableRow from "@suid/material/TableRow";
import Typography from "@suid/material/Typography";
import ErrorOutlineOutlinedIcon from "@suid/icons-material/ErrorOutlineOutlined";
import ReportProblemOutlinedIcon from "@suid/icons-material/ReportProblemOutlined";
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

const buttonColor = (environmentName: string) => {
  const colors = localStorage.getItem("tagButtonColor");
  if (!colors) {
    return "#616161";
  }
  const map = new Map<string, string>(Object.entries(JSON.parse(colors)));
  return map.get(environmentName) ?? "#616161";
};

const warningMessage = (pushedAt?: Date) => {
  if (!pushedAt) {
    return <></>;
  }
  const now = new Date();
  // 5ヶ月以上前→警告
  const alertLine = new Date(
    now.getFullYear(),
    now.getMonth() - 5,
    now.getDate()
  );
  if (new Date(pushedAt) <= alertLine) {
    return (
      <>
        <ErrorOutlineOutlinedIcon
          color="error"
          sx={{ padding: "2px", verticalAlign: "top", fontSize: "medium" }}
        />
        <Typography
          color="darkred"
          sx={{
            fontFamily: "monospace",
            fontSize: "0.8rem",
            fontWeight: "bolder",
          }}
        >
          プッシュから5か月以上経過しています
        </Typography>
      </>
    );
  }
  // 2ヶ月以上前→注意
  const warningLine = new Date(
    now.getFullYear(),
    now.getMonth() - 2,
    now.getDate()
  );
  if (new Date(pushedAt) <= warningLine) {
    return (
      <>
        <ReportProblemOutlinedIcon
          color="warning"
          sx={{ padding: "2px", verticalAlign: "top", fontSize: "medium" }}
        />
        <Typography
          color="darkgoldenrod"
          sx={{
            fontFamily: "monospace",
            fontSize: "0.8rem",
            fontWeight: "bolder",
          }}
        >
          プッシュから2か月以上経過しています
        </Typography>
      </>
    );
  }
  return <></>;
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
        <Stack spacing={2} direction="column">
          <Typography variant="h5">{headerTitle}</Typography>
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
                    <TableCell>
                      設定
                      {"　".repeat(10)}
                    </TableCell>
                    <TableCell>
                      リリース対象イメージタグ
                      {"　".repeat(48)}
                    </TableCell>
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
                            // color="primary"
                            onClick={() => {
                              openUriInNewTab(
                                `${uriPrefix}${settingItem.environment_name}${uriSuffix}`
                              );
                            }}
                            sx={{
                              textTransform: "none",
                              backgroundColor: `${buttonColor(
                                settingItem.environment_name
                              )}`,
                            }}
                            title={`${convertEnvironmentName(
                              settingItem.environment_name
                            )}環境のリリース設定画面を開く`}
                          >
                            {convertEnvironmentName(
                              settingItem.environment_name
                            )}
                            環境設定
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row">
                            <Typography
                              sx={{
                                fontFamily: "monospace",
                                fontSize: "0.8rem",
                              }}
                            >
                              {settingItem.tags.join(", ")}
                            </Typography>
                            {warningMessage(settingItem.pushed_at)}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    )}
                  </For>
                </TableBody>
              </Table>
            </TableContainer>
          </Show>
        </Stack>
      </Box>
    </Show>
  );
};
