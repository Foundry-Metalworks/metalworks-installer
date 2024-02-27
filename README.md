## About

Simple Installer application for FoundryVTT.

Requires PM2, Node >=16 and Caddy to be installed in the system.

Must be run as root.

## Available Scripts

### `yarn dev`

Run the server in development mode.

### `yarn lint`

Check for linting errors.

### `yarn build`

Build the project for production.

### `yarn start`

Run the production build (Must be built first).

### `yarn start -- --env="name of env file" (default is production).`

Run production build with a different env file.

## Additional Notes

- If `yarn dev` gives you issues with bcrypt on MacOS you may need to run: `npm rebuild bcrypt --build-from-source`.
