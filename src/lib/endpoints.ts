import { AllowedMentions, Embed } from 'slash-commands/dist/src/structures';
import { apiPrefix } from '..';

type _Message = {
    content?: string;
    tts?: boolean;
    embeds?: Embed[];
    allowed_mentions?: AllowedMentions;
};

type _EmbedMessage = _Message & {
    embeds: Embed[];
};

type _TextMessage = _Message & {
    content: string;
};

type Message = _TextMessage | _EmbedMessage;

// TODO: break this into two functions
export async function createOriginal(
    req: InteractionWithContext,
    msg: InteractionResponse,
) {
    if (!req.context.haveResponded) {
        req.context.haveResponded = true;
        req.context.originalResp(msg);
    } else if ('data' in msg && msg.data) {
        // oh no, accidentally ACK-ed earlier...
        await fetch(
            //@ts-expect-error
            `${apiPrefix[req.from]}/${req.application_id}/${
                req.token
            }/messages/@original`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: msg.data.content,
                    embeds: msg.data.embeds,
                    allowed_mentions: msg.data.allowedMentions,
                }),
            },
        );
    }
}

type FollowupID = string;

export async function followup(
    req: InteractionWithContext,
    msg: Message,
): Promise<FollowupID> {
    const blah = await fetch(
        // @ts-expect-error
        `${apiPrefix[req.from]}/${req.application_id}/${req.token}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(msg),
        },
    );

    return (await blah.json()).id;
}

export async function editFollowup(
    req: InteractionWithContext,
    id: FollowupID,

    msg: Message,
) {
    await fetch(
        // @ts-expect-error
        `${apiPrefix[req.from]}/${req.application_id}/${
            req.token
        }/messages/${id}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(msg),
        },
    );
}

export async function deleteFollowup(
    req: InteractionWithContext,
    id: FollowupID,
) {
    await fetch(
        // @ts-expect-error
        `${apiPrefix[req.from]}/${req.application_id}/${
            req.token
        }/messages/${id}`,
        {
            method: 'DELETE',
        },
    );
}
