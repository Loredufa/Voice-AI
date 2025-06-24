

## Install dependencies

```bash
npm install
```

## Setup environment variables

Copy `.env.example` to `.env` and replace the placeholders with your
ElevenLabs credentials:

```bash
cp .env.example .env
# then edit .env
```

## Run the app

1. `npx expo prebuild --clean`
2. `npx expo start --tunnel`
3. `npx expo run:ios --device`

The microphone button now includes a pulsating animation while the
conversation is active so you can easily see when the app is listening.
