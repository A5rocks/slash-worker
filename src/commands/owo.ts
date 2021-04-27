import { InteractionResponseType } from "slash-commands/dist/src/structures";

export async function handleOwO(
    req: InteractionRequest,
): Promise<InteractionResponse> {
    return {
        type:
            InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
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
