export class Lab {
  private seats = 40;
  free(): number { return this.seats; }
}
const lab = new Lab();
// seats is private; read it through the method.
export const n = lab.seats;
