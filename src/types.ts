import {
    Interaction,
    InteractionApplicationCommandCallbackData,
} from 'slash-commands/dist/structures';

export enum InteractionResponseType {
    // yes I know that this doesn't actually not send anything.
    None = 0,
    SendMessage = 1,

    // yes I know that you can still send a message with just this.
    DisplaySource = 2,
}

declare global {
    type InteractionResponse = {
        type: InteractionResponseType;
        data?: InteractionApplicationCommandCallbackData;
    };

    type InteractionRequest = { from: string } & Interaction;
}
