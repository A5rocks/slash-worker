## /worker

Put your slash commands on Cloudflare's Worker service.

#### Usage

1) `git clone https://github.com/A5rocks/slash-worker.git`
2) `cd slash-worker`
3) Edit `wrangler.toml`, putting in your account id and the public key Discord
   provides in the application portal.
4) (you might not need to do this) `wrangler login` or `wrangler config`
5) `wrangler publish`
6) Put the URL `wrangler` told you as the `Interactions Endpoint URL` in the
   application portal.

Then, you can run any command (TODO: docs on registering a command) and it
will work!

#### This one simple trick may save you 180kb!

I could not figure out how to configure webpack to do this, but if you just
edit `node_modules/@stablelib/ed25519/lib/ed25519.js` with the following:

-   Remove the line that imports `@stablelib/random`
-   Remove the `generateKeyPair` function

Then you can prevent having to polyfill `crypto`, saving 180kb!
