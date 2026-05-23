import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const electron = require('electron')
const { app, BrowserWindow } = electron
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const devServerUrl = process.env.VITE_DEV_SERVER_URL

const waitForDevServer = async (url) => {
    for (let attempt = 0; attempt < 50; attempt += 1) {
        try {
            const response = await fetch(url)
            if (response.ok) {
                return
            }
        } catch {
            await new Promise((resolve) => setTimeout(resolve, 100))
        }
    }
}

const createWindow = async () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    if (devServerUrl) {
        await waitForDevServer(devServerUrl)
        win.loadURL(devServerUrl)
    } else {
        win.loadFile(path.join(__dirname, 'dist', 'index.html'))
    }
}

app.whenReady().then(() => {
    createWindow()
})
