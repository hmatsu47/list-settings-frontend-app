import AppBar from "@suid/material/AppBar";
import Typography from "@suid/material/Typography";

export const TitleBar = () => {
  return (
    <AppBar position="static">
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
    </AppBar>
  );
};
