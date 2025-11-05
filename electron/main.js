const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "../assets/icon.ico"),
    webPreferences: {
      contextIsolation: true,
    },
  });

  const frontendPath = path.join(__dirname, "../frontend-ui/build/index.html");

  // Debug log to verify correct path
  console.log("Loading frontend from:", frontendPath);

  // Load frontend
  win.loadFile(frontendPath);

  // Uncomment this if you want devtools for debugging
  // win.webContents.openDevTools();
}

function startBackend() {
  const backendPath = path.join(__dirname, "../backend");
  console.log("Starting backend from:", backendPath);

  backendProcess = spawn("uvicorn", ["app:app", "--host", "127.0.0.1", "--port", "8000"], {
    cwd: backendPath,
    shell: true,
  });

  backendProcess.stdout.on("data", (data) => {
    console.log(`[BACKEND]: ${data}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`[BACKEND ERROR]: ${data}`);
  });

  backendProcess.on("close", (code) => {
    console.log(`[BACKEND EXITED] Code: ${code}`);
  });
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on("window-all-closed", () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== "darwin") app.quit();
});