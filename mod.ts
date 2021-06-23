interface GitExecResult {
  success: boolean;
  code: number;
  stdout: string;
  stderrOutput: string;
}

const git = async (...args: string[]): Promise<GitExecResult> => {
  const process = Deno.run({
    cmd: ["git", ...args],
    stdout: "piped",
    stderr: "piped",
  });

  const { success, code } = await process.status();

  const stdout = await process.output().then(decode);
  const stderrOutput = await process.stderrOutput().then(decode);

  process?.close();

  return {
    success,
    code,
    stdout,
    stderrOutput,
  };
};

const td = new TextDecoder();

const decode = (data: Uint8Array): string => td.decode(data);

export { git };
