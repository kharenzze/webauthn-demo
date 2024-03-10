import { getAuthCookie } from "~/src/auth";

export default defineEventHandler(async (event) => {
  event.node.res.setHeader("Set-Cookie", getAuthCookie(""));

  return { message: "ok" };
});
