# Running the app

From the repository root, install the Node.js dependencies and start both the
Flask API and Vite frontend:

```powershell
python -m pip install -r requirements.txt
npm install
npm run dev
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000). The Flask server redirects
the browser to the Vite frontend on port 5173 and proxies frontend API requests
to Flask on port 5000.

To create a production frontend bundle, run `npm run build` from the repository
root.
