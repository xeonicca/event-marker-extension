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
      "offscreen",
      "scripting",
      "activeTab",
    ],
    "host_permissions": [
      "http://tw.at.localhost:8080/*",
      "http://tw.at.localhost:8081/*",
      "http://tw.at.localhost:8082/*",
      "http://tw.at.localhost:8083/*",
      "https://at-marker-extension-dev.firebaseapp.com/*",
      "https://tw.staging-cs.amazingtalker.com/*",
      "https://tw.staging-tt.amazingtalker.com/*",
      "https://tw.staging.amazingtalker.com/*"
    ],
    "content_scripts": [
      {
        "matches": [ 
          "http://tw.at.localhost:8080/*",
          "http://tw.at.localhost:8081/*",
          "http://tw.at.localhost:8082/*",
          "http://tw.at.localhost:8083/*",
          "https://tw.staging-cs.amazingtalker.com/*", 
          "https://tw.staging-tt.amazingtalker.com/*",
          "https://tw.staging.amazingtalker.com/*"
        ],
        "js": ["content-scripts/content.js"]
      }
    ],
  },
});
