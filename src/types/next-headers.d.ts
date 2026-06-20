declare module "next/headers" {
  export function cookies(): {
    get(name: string): { value: string } | undefined;
  };
}