export const AlertType = {
  confirm: "confirm",
  info: "info",
  success: "success",
  warning: "warning",
  error: "error",
};

export interface AlertConfig {
  title: string;
  content: string;
  accept: string;
  cancel?: string; // if empty no cancel button will shown
  type?: string;
  allowClose?: boolean; // defaults to false
  showIcon?: boolean; // defaults to true
}
