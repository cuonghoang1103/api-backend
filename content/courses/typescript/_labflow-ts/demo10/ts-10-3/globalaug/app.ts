// With the augmentation, process.env.LABFLOW_PORT is string, not string | undefined.
const port: string = process.env.LABFLOW_PORT;
console.log('port set:', typeof port);
