// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
declare namespace Deno {
  interface Env {
    get(key: string): string | undefined;
  }
  const env: Env;
}
