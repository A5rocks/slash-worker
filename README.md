## /worker

Put your slash commands on Cloudflare's Worker service.

#### Usage

1. `git clone https://github.com/A5rocks/slash-worker.git`
2. `cd slash-worker`
3. Edit `wrangler.toml`, putting in your account id and the public key Discord
   provides in the application portal.
4. (you might not need to do this) `wrangler login` or `wrangler config`
5. `wrangler publish`
6. Put the URL `wrangler` told you as the `Interactions Endpoint URL` in the
   application portal.

Then, you can run any command
([see "Registering a command"](#Registering-a-command)) and it will work!

#### Registering a command

You can either use a library for a 1-use script or use a binary, your choice:
 - Library: try out
   [`slash-commands`](https://www.npmjs.com/package/slash-commands).
 - Binary: none yet, try searching GitHub! <https://github.com/NurMarvin> had
   one in the works, not sure of its status.

Or... You can read the documentation and manually construct a request in
Insomnia or Postman... This is not recommended, though.

#### This one simple trick may save you 180kb!

I could not figure out how to configure webpack to do this, but if you just
edit `node_modules/@stablelib/ed25519/lib/ed25519.js` with the following:

-   Remove the line that imports `@stablelib/random`
-   Remove the `generateKeyPair` function

Then you can prevent having to polyfill `crypto`, saving 180kb!
