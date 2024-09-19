export const setLocalStorage = async (key: string, value: any) => {
  console.log(`Start to set local storage for key: ${key} and value: ${value}`);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.id) return console.log('Tab id is not found');
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [key, value],
    func: (key, value) => {
      localStorage.setItem(key, value);
      console.log(`Local storage for key: ${key} and value: ${value} is set`);
    },
  });
}

export const getLocalStorage = async (key: string) => {
  console.log(`Start to get local storage for key: ${key}`);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.id) return console.log('Tab id is not found');
  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [key],
    func: (key) => {
      console.log(`Local storage :::`, localStorage.getItem(key));
      return localStorage.getItem(key);
    },
  });

  console.log(`Local storage item of key: ${key} is: `, result);

  return result[0].result;
}