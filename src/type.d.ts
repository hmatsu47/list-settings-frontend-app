export type TagSetting = {
  environment_name: string;
  tags: string[];
};
export type LastReleased = {
  image_uri: string;
  released_at: Date;
};
export type NextRelease = {
  image_uri: string;
  release_at: Date;
};
export type UriSetting = {
  environment_name: string;
  last_released: LastReleased;
  next_release: NextRelease;
  service_name: string;
};
export type ErrorResponse = {
  message: string;
};
