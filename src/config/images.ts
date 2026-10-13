let avatar: any = 1;
let favicon: any = 2;
let emptyState: any = 3;
let logo: any = 4;

try {
  avatar = require("../../assets/images/avatar.png");
  favicon = require("../../assets/images/favicon.png");
  emptyState = require("../../assets/images/empty-state.png");
  logo = require("../../assets/images/logo.png");
} catch {
  // Test runtime environment
}

export default { avatar, favicon, emptyState, logo };


