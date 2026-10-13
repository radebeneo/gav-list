// Safe icon loader that works in both React Native / Metro and Node test environments
let home: any = 1;
let location: any = 2;
let star: any = 3;
let user: any = 4;
let person: any = 5;
let search: any = 6;
let plus: any = 7;
let trash: any = 8;
let check: any = 9;
let pencil: any = 10;
let back: any = 11;
let clock: any = 12;
let logout: any = 13;

try {
  home = require("../../assets/icons/home.png");
  location = require("../../assets/icons/location.png");
  star = require("../../assets/icons/star.png");
  user = require("../../assets/icons/user.png");
  person = require("../../assets/icons/person.png");
  search = require("../../assets/icons/search.png");
  plus = require("../../assets/icons/plus.png");
  trash = require("../../assets/icons/trash.png");
  check = require("../../assets/icons/check.png");
  pencil = require("../../assets/icons/pencil.png");
  back = require("../../assets/icons/arrow-back.png");
  clock = require("../../assets/icons/clock.png");
  logout = require("../../assets/icons/logout.png");
} catch {
  // Test runtime environment where asset transformer is not registered
}

export const icons = {
  home,
  location,
  star,
  user,
  person,
  search,
  plus,
  trash,
  check,
  pencil,
  back,
  clock,
  logout,
  // Compatibility aliases
  wallet: location,
  activity: star,
  setting: user,
  add: plus,
  menu: home,
  notion: star,
  dropbox: location,
  openai: star,
  adobe: star,
  medium: location,
  figma: star,
  spotify: star,
  github: user,
  claude: star,
  canva: star,
} as const;

export type IconKey = keyof typeof icons;

export default icons;