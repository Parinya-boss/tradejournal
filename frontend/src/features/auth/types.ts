import type { CurrentUser } from "./api/getCurrentUser";

export type AuthSession = {
  accessToken: string;
  user: CurrentUser;
};
