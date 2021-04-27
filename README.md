## /worker

Put your slash commands on Cloudflare's Worker service.

#### Usage

1. `git clone https://github.com/A5rocks/slash-worker.git`
2. `cd slash-worker`
3. Edit `wrangler.toml`, putting in your account id.
4. Edit `public_keys.ts`, putting in the public key Discord provides in the
   application portal.
5. (optional) Edit `sentry.ts` with your values.
6. `npm i`
7. (you might not need to do this) `wrangler login` or `wrangler config`
8. `wrangler publish`
9. Put the URL `wrangler` told you as the `Interactions Endpoint URL` in the
   application portal.

Then, you can run any command
([see "Registering a command"](#Registering-a-command)) and it will work!

#### Registering a command

You can either use a library for a 1-use script or use a binary, your choice:

-   Library: try out
    [`slash-commands`](https://www.npmjs.com/package/slash-commands). Check
    `create_command.js` in this directory for an example.
-   Binary: none yet, try searching GitHub! <https://github.com/NurMarvin> had
    one in the works, not sure of its status.

Or... You can read the documentation and manually construct a request in
Insomnia or Postman... This is not recommended, though.

#### Handling a command

1. Write a function that takes an `InteractionRequest` and returns a
   `Promise<InteractionResponse>`. (or uses the endpoints to do equivalent)
2. Edit `commands/index.ts` to import the function and add it to `handlers`.

And then it should work! Make sure you have the slash command experiment
enabled, so you can actually run your command.
