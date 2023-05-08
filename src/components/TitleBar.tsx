import AppBar from "@suid/material/AppBar";
import Box from "@suid/material/Box";
import IconButton from "@suid/material/IconButton";
import Stack from "@suid/material/Stack";
import Typography from "@suid/material/Typography";
import ReplayIcon from "@suid/icons-material/Replay";
import {
  fetchLocal,
  fetchRemote,
  fetchUriSettings,
} from "../api/fetchUriSettings";
import { fetchTagSettings } from "../api/fetchTagSettings";

const reload = () => {
  fetchUriSettings(fetchLocal);
  fetchUriSettings(fetchRemote);
  fetchTagSettings();
};

export const TitleBar = () => {
  return (
    <AppBar position="static">
      <Stack direction="row">
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            padding: "0 0 0 10px",
          }}
        >
          コンテナリリースイメージ一覧
        </Typography>
        <Box title="再読み込み">
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="reload"
            sx={{ mr: 1 }}
            onClick={() => reload()}
          >
            <ReplayIcon sx={{ fontSize: "large", padding: "2px" }} />
            Reload
          </IconButton>
        </Box>
      </Stack>
    </AppBar>
  );
};
