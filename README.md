## About

This project was based off of with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript).

I changed it then to update the eslint rules, add prettier, husky, lint-staged, commitizen and conventional commits, as well as tweaking the base structure to be more to my liking.

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
