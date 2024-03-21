export type TagSetting = {
  environment_name: string;
  tags: string[];
  pushed_at?: Date;
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
  last_released: LastReleased | null;
  next_release: NextRelease | null;
  service_name: string;
};
export type ErrorResponse = {
  message: string;
};
