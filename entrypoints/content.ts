export default defineContentScript({
  matches: ['*://*.google.com/*'],
  main() {
    console.log('Hello content.');

    window.addEventListener("message", function(event) {
      if (event.source != window) return;
      if(!event.data.type) return;
    
      if (event.data.type == "at-event") {
          console.log("Message received in the content script from the page:", event.data);
          chrome.runtime.sendMessage({
              type: "at-event-from-content",
              data: event.data.data
          });
      }
    });
  },
});