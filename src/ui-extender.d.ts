declare module "@jahia/ui-extender" {
  export const registry: {
    add: (target: string, key: string, value: Record<string, unknown>) => void;
  };
}
