# HUMBLE Downgrader — GitHub Pages

This is the static GitHub Pages version of the HUMBLE Downgrader website.

## Deploy

Push the contents of this folder to a GitHub repository, then enable:
Settings → Pages → Source → GitHub Actions.

GitHub Pages hosts static files. It cannot itself run the Node/After Effects conversion
worker. The Convert button in this version therefore does not fake a conversion.

To make conversion real, connect the frontend to a separately hosted secure API/worker
and replace the handler in `app.js` with a POST to that API.

The frontend supports:
- automatic .aep/.aex detection
- drag & drop
- target version selection
- responsive Windows/macOS browser layout
- HUMBLE branding and supplied assets

Do not claim a file is converted unless the backend worker actually performs and
validates the conversion.
