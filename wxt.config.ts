import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    "name": "AT Event Marker Dev",
    "content_security_policy": {
      "sandbox": "sandbox allow-scripts; script-src 'self' https://www.gstatic.com/ https://*.firebaseio.com https://www.googleapis.com"
    },
    "permissions": [
      "offscreen"
    ],
    "host_permissions": [
      "https://at-marker-extension-dev.firebaseapp.com/*",
      "https://tw.staging-cs.amazingtalker.com/",
      "https://tw.staging-tt.amazingtalker.com/",
      "https://tw.staging.amazingtalker.com/"
    ],
    "content_scripts": [
      {
        "matches": [ "https://tw.staging-cs.amazingtalker.com/", "https://tw.staging-tt.amazingtalker.com/","https://tw.staging.amazingtalker.com/"],
        "js": ["content-scripts/content.js"]
      }
    ],
  },
});
