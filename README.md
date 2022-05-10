# deno-git

[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)

Usage:

```typescript
import * as git from "https://raw.githubusercontent.com/ayakovlenko/deno-git/v$VERSION/mod.ts";
```

```typescript
await git.run({
  args: ["log", "--oneline"],
  cwd: "/path/to/repo/", // "." otherwise
});
```

```typescript
console.log(await git.version());
// { major: 2, minor: 36, patch: 0, platform: undefined }
```
