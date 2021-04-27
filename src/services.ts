// the public keys to use to check payloads. This is accessed top to bottom,
//  which means the more likely keys should go to the top.
export const publicKeys: { [id: string]: string } = {
    discord: 'PUBLIC KEY HERE',
};

// these are prefixes to the follow up routes.
export const apiPrefix: { [id: string]: string } = {
    discord: 'https://discord.com/api/v8/webhooks',
};
