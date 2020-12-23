# Twitch Oauth Token Generator for Twitch Bot

## Register application

On developer dashboard, use `http://localhost:PORT/oauth2/twitch` as redirect url. Set PORT in `config.json`

## Scope definition

Under scopes array in `config.json`. For a simple bot, use:

```json
["chat:read", "chat:edit"]
```

## Authorize yourself

On `http://localhost:PORT/api/verify` or any port defined in `config.json`
