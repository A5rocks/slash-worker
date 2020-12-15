import { InteractionResponseType } from '.';

export async function handleOwO(
    req: InteractionRequest,
): Promise<InteractionResponse> {
    return {
        type:
            InteractionResponseType.SendMessage |
            InteractionResponseType.DisplaySource,
        data: {
            content: `<:slash:782701715479724063> Did I just hear someone... OwO??? From \`${
                req.from
            }\`!
rawr:
\`\`\`json
${JSON.stringify(req, null, 4)}
\`\`\``,
            flags: 64,
        },
    };
}
