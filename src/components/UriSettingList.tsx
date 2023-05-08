import { Show } from "solid-js";
import Box from "@suid/material/Box";
import Paper from "@suid/material/Paper";
import Stack from "@suid/material/Stack";
import Table from "@suid/material/Table";
import TableBody from "@suid/material/TableBody";
import TableCell from "@suid/material/TableCell";
import TableContainer from "@suid/material/TableContainer";
import TableHead from "@suid/material/TableHead";
import TableRow from "@suid/material/TableRow";
import Typography from "@suid/material/Typography";
import { ServiceSelector } from "./ServiceSelector";
import { UriSettingListParts } from "./UriSettingListParts";
import { service, uriRemoteSettings, uriSettings } from "../signal";

export const UriSettingList = () => {
  const headerTitle = localStorage.getItem("uriSettingsHeaderTitle");

  return (
    <Show
      when={uriRemoteSettings() !== undefined || uriSettings() !== undefined}
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
        <Stack spacing={2} direction="column">
          <Typography variant="h5">{headerTitle}</Typography>
          <ServiceSelector />
          <Show
            when={service()}
            fallback={
              <Typography variant="h6">
                リリース対象サービスが未選択です
              </Typography>
            }
          >
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
                    <UriSettingListParts settings={uriSettings()} />
                    <UriSettingListParts settings={uriRemoteSettings()} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Show>
          </Show>
        </Stack>
      </Box>
    </Show>
  );
};
