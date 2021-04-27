import {
    ApplicationCommandOptionValue,
    Interaction,
    InteractionApplicationCommandCallbackData,
    InteractionResponseType,
} from 'slash-commands/dist/src/structures';

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

type Context = {
    originalResp: (_: InteractionResponse) => void;
    haveResponded: boolean;
};

declare global {
    type InteractionResponse =
        | {
              type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE;
          }
        | {
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE;
              data?: InteractionApplicationCommandCallbackData;
          };

    type InteractionRequest = Interaction & {
        from: string;
        // fixme: as it is, this pretends subcommands and groups don't exist
        options: { [id: string]: ApplicationCommandOptionValue };
    };

    type InteractionWithContext = InteractionRequest & {
        context: Context;
    };
}
