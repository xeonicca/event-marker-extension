export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  chrome.sidePanel.setPanelBehavior({
    openPanelOnActionClick: true,
  })

  const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html';

  // A global promise to avoid concurrency issues
  let creatingOffscreenDocument;

  // Chrome only allows for a single offscreenDocument. This is a helper function
  // that returns a boolean indicating if a document is already active.
  async function hasDocument() {
    // Check all windows controlled by the service worker to see if one
    // of them is the offscreen document with the given path
    const offscreenUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH);
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT'],
      documentUrls: [offscreenUrl]
    });

    return existingContexts.length > 0;
  }

  async function setupOffscreenDocument(path) {
    // If we do not have a document, we are already setup and can skip
    if (!(await hasDocument())) {
      // create offscreen document
      if (creatingOffscreenDocument) {
        await creatingOffscreenDocument;
      } else {
        creatingOffscreenDocument = chrome.offscreen.createDocument({
          url: path,
          reasons: [
            chrome.offscreen.Reason.DOM_SCRAPING
          ],
          justification: 'authentication'
        });
        await creatingOffscreenDocument;
        creatingOffscreenDocument = null;
      }
    }
  }

  async function closeOffscreenDocument() {
    if (!(await hasDocument())) {
      return;
    }
    await chrome.offscreen.closeDocument();
  }

  async function login() {
    console.log('login');
    await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);

    console.log('finish setupOffscreenDocument');
    return new Promise(async (resolve, reject) => {
      const auth = await chrome.runtime.sendMessage({
        actionType: 'auth',
        action: 'login',
        target: 'offscreen'
      });
      auth?.name !== 'FirebaseError' ? resolve(auth) : reject(auth);
    })
  }

  async function genericMessageHandler(request, sender, sendResponse) {
    console.log('handle actions', request);
    await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
    const response = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        actionType: request.actionType,
        action: request.action,
        params: request.params,
        target: 'offscreen'
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
    return response;
  }


  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('background receive', request);
    if (request.type === 'log') {
      console.dir(request.data);  
    } else {
      genericMessageHandler(request).then(res => {
        sendResponse(res)
      })
      return true;
    }
  });

  
});

