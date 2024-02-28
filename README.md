## About

Simple Installer application for FoundryVTT.

Requires PM2, Node >=16 and Caddy to be installed in the system.

Must be run as root.

## Setup

The following script will get you set up for this to work.

```
# Setup Node prerequisites
curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
      
# Setup Caddy prerequisites
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' |
sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' |
sudo tee /etc/apt/sources.list.d/caddy-stable.list
apt update
      
# Install Caddy and Node
apt install -y libssl-dev unzip nodejs caddy

# Install PM2 for daemon management
npm install pm2@latest -g

# Install yarn
npm install yarn -g

# Clone repo & install
cd ~
git clone git@github.com:Foundry-Metalworks/metalworks-installer.git
cd ./metalworks-installer
yarn install
yarn build
sudo pm2 start dist/index.js --name foundry -- --env=production
sudo pm2 startup
```

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
