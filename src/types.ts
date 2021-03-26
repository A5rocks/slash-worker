import {
    ApplicationCommandOptionValue,
    Interaction,
    InteractionApplicationCommandCallbackData,
    User,
} from 'slash-commands/dist/src/structures';

export enum InteractionResponseType {
    // yes I know that this doesn't actually not send anything.
    None = 0,
    SendMessage = 1,

    // yes I know that you can still send a message with just this.
    DisplaySource = 2,
}

// todo: better errors
export class StringDictionary<V> {
    private backing: { [id: string]: V } = {};

    public get(k: string): V {
        if (!(k in this.backing)) {
            throw new Error(
                `Cannot get key that does not exist in dictionary: ${k}`,
            );
        }

        return this.backing[k];
    }

    public set(k: string, v: V): V | null {
        var prev = null;
        if (k in this.backing) {
            prev = this.backing[k];
        }

        this.backing[k] = v;

        return prev;
    }

    public delete(k: string) {
        if (!(k in this.backing)) {
            throw new Error(
                `Cannot delete key that does not exist in dictionary: ${k}`,
            );
        }

        delete this.backing[k];
    }
}

declare global {
    type InteractionResponse = {
        type: InteractionResponseType;
        data?: InteractionApplicationCommandCallbackData;
    };

    type InteractionRequest = Interaction & {
        from: string;
        // fixme: as it is, we pretend subcommands and groups don't exist
        options: { [id: string]: ApplicationCommandOptionValue };
    };
}
