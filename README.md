# Docker Manager with Telegram Bot

[![license][license-image]][license-url]

NodeJS Telegram Bot to manage Docker containers.

You can start, stop, view status,... of your Docker containers through Telegram chat.

## Usage

1. **Clone repository**

   ```
   git clone git@github.com:dafo90/telegram-bot-docker-manager.git
   cd telegram-bot-docker-manager
   ```

2. **Create .env file and replace `YOUR-TELEGRAM-TOKEN` and `YOUR-BOT-CHAT-IDS-COMMASEPARATED` (or set as Environment Variables)**

   ```
   echo -e "TELEGRAM_TOKEN=<YOUR-TELEGRAM-TOKEN>\nCHAT_IDS=<YOUR-BOT-CHAT-IDS-COMMASEPARATED>" > .env
   ```

3. **Install the dependencies**

   ```
   npm install
   ```

4. **Run the application**

   ```
   npm start
   ```

5. **Build for deploy; remember to set `TELEGRAM_TOKEN` and `CHAT_IDS` as Environment Variables (or copy in the same directory the file `.env`)**

   ```
   webpack
   ```

[license-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: https://github.com/dafo90/telegram-bot-docker-manager/blob/master/LICENSE
