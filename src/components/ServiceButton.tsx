import Button from "@suid/material/Button";
import { service, setService } from "../signal";

type Props = {
  serviceName: string;
};

export const ServiceButton = (props: Props) => {
  return (
    <Button
      variant={service() === props.serviceName ? "contained" : "outlined"}
      size="small"
      color={service() === props.serviceName ? "primary" : "inherit"}
      onClick={(e) => {
        setService(props.serviceName);
        // 選択肢をローカルストレージに記録しておく
        localStorage.setItem("selectedService", props.serviceName);
      }}
      sx={{ textTransform: "none" }}
      title={`${props.serviceName} を選択`}
    >
      {props.serviceName}
    </Button>
  );
};
