import { assertEquals } from "./deps_test.ts";
import { GitVersion } from "./mod.ts";
import { MockGitRunner } from "./_mock/mod.ts";
import * as git from "./mod.ts";

Deno.test({
  name: "real git",
  fn: async () => {
    console.log(
      await git.run({
        args: ["log", "--oneline"],
      }),
    );
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

    assertEquals(
      await git.run({
        args: ["dummy"],
        cwd: ".",
        runner: mock,
      }),
      result,
    );
  },
});

Deno.test({
  name: "version",
  fn: async (t) => {
    const testcases: { input: string; output: GitVersion }[] = [
      {
        input: "git version 2.32.0 (Apple Git-132)",
        output: {
          major: 2,
          minor: 32,
          patch: 0,
          platform: "Apple Git-132",
        },
      },
      {
        input: "git version 2.36.0",
        output: {
          major: 2,
          minor: 36,
          patch: 0,
          platform: undefined,
        },
      },
    ];

    for (const { input, output } of testcases) {
      await t.step({
        name: input,
        fn: async () => {
          const mock = new MockGitRunner();
          mock.mock(["version"], {
            success: true,
            code: 0,
            stdout: input,
            stderrOutput: "",
          });
          const version = await git.version(mock);
          assertEquals(version, output);
        },
      });
    }
  },
});
