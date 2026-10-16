let avatar: any = 1;
let favicon: any = 2;
let emptyState: any = 3;
let logo: any = 4;

// Each asset is loaded independently so one missing file doesn't break the others.
try {
  avatar = require("../../assets/images/avatar.png");
} catch {
  // Missing asset or test runtime environment
}

try {
  favicon = require("../../assets/images/favicon.png");
} catch {
  // Missing asset or test runtime environment
}

try {
  emptyState = require("../../assets/images/empty-state.png");
} catch {
  // Test runtime environment
}

try {
  logo = require("../../assets/images/logo.png");
} catch {
  // Missing asset or test runtime environment
}

export default { avatar, favicon, emptyState, logo };


