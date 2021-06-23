import { GitExecResult, GitRunner } from "../mod.ts";

class MockGitRunner implements GitRunner {
  #matches: Map<string, GitExecResult> = new Map();

  run(_cwd: string, args: string[]): Promise<GitExecResult> {
    const key = args.join(" ");
    const value = this.#matches.get(key);

    if (!value) {
      throw new Error(`no mocked behaviour found for args: ${key}`);
    }

    return Promise.resolve(value);
  }

  mock(args: string[], result: GitExecResult) {
    this.#matches.set(args.join(" "), result);
  }
}

export { MockGitRunner };
