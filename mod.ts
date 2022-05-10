interface GitExecResult {
  success: boolean;
  code: number;
  stdout: string;
  stderrOutput: string;
}

interface GitRunner {
  run(cwd: string, args: string[]): Promise<GitExecResult>;
}

class RealGitRunner implements GitRunner {
  #td = new TextDecoder();

  #decode = (data: Uint8Array): string => this.#td.decode(data);

  async run(cwd: string, args: string[]): Promise<GitExecResult> {
    const process = Deno.run({
      cmd: ["git", ...args],
      stdout: "piped",
      stderr: "piped",
      cwd,
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

type RunOpts = {
  args: string[];
  cwd?: string;
  runner?: GitRunner;
};

const run = ({
  args,
  cwd = ".",
  runner = new RealGitRunner(),
}: RunOpts): Promise<GitExecResult> => {
  return runner.run(cwd, args);
};

interface GitVersion {
  major: number;
  minor: number;
  patch: number;
  platform?: string;
}

const versionRegex = /^git version (\d+)\.(\d+)\.(\d+)( \((.+)\))?$/;

const version = async (runner: GitRunner = new RealGitRunner()) => {
  const { success, stdout, stderrOutput } = await run({
    args: ["version"],
    runner,
  });

  if (!success) {
    throw new Error(stderrOutput);
  }

  const match = stdout.trim().match(versionRegex);
  if (!match) {
    throw new Error(`git version does not match regex ${versionRegex}`);
  }

  const [major, minor, patch, _, platform] = match.slice(1);
  const version: GitVersion = {
    major: parseInt(major),
    minor: parseInt(minor),
    patch: parseInt(patch),
    platform,
  };
  return version;
};

export { run, version };

export type { GitExecResult, GitRunner, GitVersion };
