import * as git from "./mod.ts";
import { MockGitRunner } from "./_mock/mod.ts";
import { assertEquals } from "./deps_test.ts";

Deno.test({
  name: "real git",
  fn: async () => {
    console.log(await git.run(["log", "--oneline"]));
  },
});

Deno.test({
  name: "mock git",
  fn: async () => {
    const mock = new MockGitRunner();

    const result = {
      success: true,
      code: 0,
      stdout: "42",
      stderrOutput: "",
    };
    mock.mock(["dummy"], result);

    assertEquals(await git.run(["dummy"], ".", mock), result);
  },
});
