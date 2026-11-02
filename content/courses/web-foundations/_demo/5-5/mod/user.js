// mod/user.js — one default export: "the main thing" of this file
export default class User {
  constructor(name) { this.name = name; }
  greet() { return `Hi, I am ${this.name}`; }
}
