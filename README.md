# Verena

Verena is your trusted and personalized AI Financial Assistant.

## Deployment

### App Deployment

App deployments are done through EAS and split between android and iOS. To deploy the web app, you need to deploy the server.

#### iOS Deployment

Run the following in the root

```bash
npm run submit:ios
```

#### Android Development

Run the following in the root

```bash
npm run submit:android
```

### Server Deployment

You can create a new image and deploy the image using the following script from the root

```bash
$ npm run build:deploy
```

You can trigger only a deployment using the following

```bash
$ npm run deploy
```

You can trigger just an image build using the following

```bash
$ npm run build:image
```

## TODO
- Verify Android app works
- Create a /support page that outlines how you can delete your account and your information
- Apple SSO
- Google SSO
