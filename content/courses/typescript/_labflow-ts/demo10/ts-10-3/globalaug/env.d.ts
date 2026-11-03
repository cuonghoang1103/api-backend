// Augment a global type from @types/node: declare that this env var always exists.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LABFLOW_PORT: string;
    }
  }
}
export {};
