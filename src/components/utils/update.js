export const checkForUpdates = async (setHasUpdate) => {
  try {
    const currentVersionResponse = await fetch('/version.json');
    const currentVersion = await currentVersionResponse.json();

    const remoteVersionResponse = await fetch('http://localhost:5173/version.json');
    const remoteVersion = await remoteVersionResponse.json();

    if (currentVersion.version !== remoteVersion.version) {
      setHasUpdate(true);
    }

  } catch (error) {
    console.error('Error al verificar actualizaciones:', error);
  }
};

export const applyUpdate = () => {
  if (window.require) {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.send('apply-update');
  } else {
    window.location.reload();
  }
};
