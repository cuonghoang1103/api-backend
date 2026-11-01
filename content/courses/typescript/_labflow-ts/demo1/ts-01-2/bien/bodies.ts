// Three request bodies, as a browser or Postman would send them.
export const BODIES: [string, string][] = [
  ['correct ', '{"lab":"BE-201","seats":31,"role":"LECTURER","start":"08:00","end":"10:00"}'],
  ['seats="31"', '{"lab":"BE-201","seats":"31","role":"LECTURER","start":"08:00","end":"10:00"}'],
  ['lecturer', '{"lab":"BE-201","seats":31,"role":"lecturer","start":"08:00","end":"10:00"}'],
];
