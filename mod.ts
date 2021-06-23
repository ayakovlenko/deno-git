interface GitExecResult {
  success: boolean;
  code: number;
  stdout: string;
  stderrOutput: string;
}

interface GitRunner {
  run(args: string[]): Promise<GitExecResult>;
}

class RealGitRunner implements GitRunner {
  #td = new TextDecoder();

  #decode = (data: Uint8Array): string => this.#td.decode(data);

  async run(args: string[]): Promise<GitExecResult> {
    const process = Deno.run({
      cmd: ["git", ...args],
      stdout: "piped",
      stderr: "piped",
    });

    const { success, code } = await process.status();

    const stdout = await process.output().then(this.#decode);
    const stderrOutput = await process.stderrOutput().then(this.#decode);

    process?.close();

    return {
      success,
      code,
      stdout,
      stderrOutput,
    };
  }
}

const run = (
  args: string[],
  runner: GitRunner = new RealGitRunner(),
): Promise<GitExecResult> => {
  return runner.run(args);
};

export { run };

export type { GitExecResult, GitRunner };
