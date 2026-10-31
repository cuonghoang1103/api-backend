// Check a real response against openapi.json: the status must be documented, the body must match its schema.
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const doc = JSON.parse(readFileSync(new URL('../../openapi.json', import.meta.url), 'utf8'));
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
const local = (schema) => JSON.parse(JSON.stringify(schema).replaceAll('#/components/schemas/', ''));
for (const [name, schema] of Object.entries(doc.components.schemas)) ajv.addSchema(local(schema), name);

export function contractErrors(method, path, res) {
  const operation = doc.paths[path]?.[method];
  if (!operation) return [method.toUpperCase() + ' ' + path + ' is not in the contract'];
  const documented = operation.responses[String(res.status)];
  if (!documented) return ['status ' + res.status + ' is not documented for ' + method.toUpperCase() + ' ' + path];
  const schema = documented.content?.['application/json']?.schema;
  if (!schema) return [];
  const validate = ajv.compile(local(schema));
  return validate(res.body) ? [] : validate.errors.map((e) => (e.instancePath || '(body)') + ' ' + e.message + (e.params.additionalProperty ? ': ' + e.params.additionalProperty : ''));
}
