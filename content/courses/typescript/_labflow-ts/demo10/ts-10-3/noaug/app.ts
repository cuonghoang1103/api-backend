// No augmentation, so process.env.X is string | undefined — assigning it to string is refused.
const port: string = process.env.LABFLOW_PORT;
export { port };
