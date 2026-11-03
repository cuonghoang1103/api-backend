export class Lab {
  private seats = 40;
  free(): number { return this.seats; }
}
const lab = new Lab();
console.log(lab.free());
