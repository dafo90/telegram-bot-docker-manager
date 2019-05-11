# Docker status checker and Telegram Bot notifier

[![license][license-image]][license-url]

NodeJS Docker containers status checker and Telegram Bot notifier

## Usage

1. **Clone repository**

   ```
   git clone git@github.com:dafo90/docker-status-telegram-bot.git
   cd docker-status-telegram-bot
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
[license-url]: https://github.com/dafo90/docker-status-telegram-bot/blob/master/LICENSE
