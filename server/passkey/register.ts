export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body);

  return { message: "ok" };
  // ... Do whatever you want here
});