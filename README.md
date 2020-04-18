# lusaka

lusaka is simple markdown based notebook. Markdown files are managed in a simple folder structure that may additionally reside in a git repository.The server can be configured to frequently execute a `git pull` in this directory.The menu is build directly from the folder structure. This results in a very lowmaintainance application. All you have to do to add a note is commit a markdownfile to a git repository.

## Development

After cloning the repository run `npm install` in the `client/` and `server/` folder. Also make sure `pm2` is installed, either localy in the `server/` folder or globaly.

The main scripts to run a development environment are located in the `server/` folder

### Start Development Environment

```bash
$ cd server && npm run dev
```

Per default the (client) application is served on `localhost:8080`. The backend is running on `localhost:3002`.

### Edit style

Edit the `<style></style>` sections of `client/src/components/*.vue` to adjust the style to your needs.

### Merge dev to master

Only relevant if separate `dev` branch is used

```bash
$ cd server && npm run merge
```

## Deployment

`pm2` is used for deployment to a remote host. To configure the deployment copy `server/ecosystem.config.example.js` to `server/ecosystem.config.js` and add/edit the fields `user`, `host` and `path`. Add `server/ecosystem.config.js` to your git used for deployment as this file is also needed on your host running lusaka. 

Then run the following to build and deploy lusaka to your host

```bash
$ cd server
$ pm2 deploy production setup #only on fresh install
$ pm2 deploy production update
$ pm2 deploy production exec "pm2 reload all"
```

Check the `pm2` documentation to find more information on how to manage and serve a node.js application.

## Configuration

Create and edit config file on the host. As this file may contain sensitiv information, it is per default not added to git. Edit `server/.gitignore` to change this if desired.

```bash
$ cd server/config && cp config.example.js config.js
$ vi config.js
```

### Change application title

Create `client/.env.local` file. This can be done either on your workstation or directly on the host that is running lusaka. Add 

```conf
VUE_APP_TITLE=My Notebook
```

to the file and redeploy lusaka from your wokstation or rebuild directly on the server with

```bash
$ cd client && npm run build
```

## Example

See https://notes.markuspetermann.net for an example.