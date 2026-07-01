# @wusel-capture/host

Native messaging host for **Wusel Capture** (Tier B). It receives a capture from
the Chrome extension, writes it into the project folder mapped from the page URL
(`<project>/.wusel-capture/<id>/`), builds a prompt, and opens Claude Code in
VS Code via the `vscode://anthropic.claude-code/open?prompt=…` deep link.

Without this host the extension still works — it falls back to downloading the
capture and opening the same deep link (Tier A).

## Install (macOS / Linux)

1. Load the extension unpacked (`packages/wusel-capture/dist`) and copy its ID
   from `chrome://extensions`.
2. Register the host:

   ```bash
   pnpm --filter @wusel-capture/host install-host -- --extension-id <EXTENSION_ID>
   ```

   This builds the binary, writes the native-messaging manifest into every
   installed Chromium-family browser's `NativeMessagingHosts` directory (Chrome,
   Chromium, Brave, Edge), and writes an example config at
   `~/.wusel-capture/config.json` if none exists.
3. Edit `~/.wusel-capture/config.json` to map your URLs to project folders:

   ```json
   {
     "captureRoot": ".wusel-capture",
     "defaultProvider": "claude-code-vscode",
     "inbox": "~/wusel-capture-inbox",
     "projects": [
       { "name": "my-app", "match": ["http://localhost:5173/*"], "path": "/Users/me/dev/my-app" }
     ]
   }
   ```

   Captures from a matching URL land in `<project>/.wusel-capture/<id>/`; anything
   that doesn't match goes to `inbox`.
4. Reload the extension and use **Send to Claude Code**.

Windows uses a registry entry rather than a manifest directory — register
`com.wusel.capture` manually (see Chrome's native-messaging docs); the host
binary itself is cross-platform.

## Security

- The manifest's `allowed_origins` is locked to your extension ID.
- Capture IDs and asset filenames are sanitized; the host refuses to write
  outside `<project>/.wusel-capture`.
- The host reads one message and exits; the response stays well under Chrome's
  1 MiB host→extension limit.
