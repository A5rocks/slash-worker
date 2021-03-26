import { InteractionResponse as TrueInteractionResponse } from 'slash-commands/dist/src/structures';
import { InteractionResponseType } from '../types';

// we do some stuff for library UI. let's undo those
export function transformResponse(
    resp: InteractionResponse,
): TrueInteractionResponse {
    var actualType: number = 2;

    switch (resp.type) {
        case InteractionResponseType.None:
            actualType = 2;
            break;
        case InteractionResponseType.SendMessage:
            actualType = 3;
            break;
        case InteractionResponseType.SendMessage |
            InteractionResponseType.DisplaySource:
            actualType = 4;
            break;
        case InteractionResponseType.DisplaySource:
            actualType = 5;
            break;
    }

    return {
        ...resp,
        type: actualType,
    };
}
