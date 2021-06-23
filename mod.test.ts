import { git } from "./mod.ts";

Deno.test({
  name: "not a real test",
  fn: async () => {
    console.log(await git("log"));
  },
});
