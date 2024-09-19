import { setLocalStorage, getLocalStorage } from '../../../../../../utils/setLocalStorage';

const AUTO_TRACKING_DEV_MODE = 'auto-tracking-dev-mode';

const useDevModeSetting = () => {
  const [devMode, setDevMode] = useState(false);

  const getDevMode = async () => {
    console.log('Get Dev mode!');
    const devMode = await getLocalStorage(AUTO_TRACKING_DEV_MODE);
    if(!devMode || devMode === 'false') return setDevMode(false);
    setDevMode(true);
  }

  const toggleDevMode = () => {
    console.log('Toggling dev mode!');
    const newDevMode = String(devMode ? false : true);
    console.log('New dev mode:', newDevMode);
    setLocalStorage(AUTO_TRACKING_DEV_MODE, newDevMode);

    if(newDevMode === 'true') return setDevMode(true);
    setDevMode(false);
  }

  const setupTabChangeListener = () => {
    console.log('start tab change listener');
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
      console.log('Tab activated:', activeInfo.tabId);

      await getDevMode();
      console.log('finish dev mode');
    });
  }

  useEffect(() => {
    setupTabChangeListener();
  }, []);
  
  return {
    devMode,
    getDevMode,
    toggleDevMode,
  };
};

export default useDevModeSetting;