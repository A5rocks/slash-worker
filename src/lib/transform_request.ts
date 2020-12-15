import {
    ApplicationCommandInteractionDataOption,
    Interaction,
} from 'slash-commands/dist/structures';
import { StringDictionary } from '../types';

// fixme: we ignore subgroups and subcommands
// maybe a way to solve: (?)
// https://discord.com/channels/110373943822540800/110373943822540800/788148728824463433
// (BrightSkyz)
function fixArguments(
    options: ApplicationCommandInteractionDataOption[],
    result: StringDictionary<InteractionOptionData>,
): StringDictionary<InteractionOptionData> {
    for (const option of options) {
        if (!('value' in option)) {
            fixArguments(option.options, result);
            continue;
        }

        result.set(option.name, option.value as InteractionOptionData);
    }

    return result;
}

// we want to transform the options into a mapping
export function transformRequest(
    interaction: Interaction,
    from: string,
): InteractionRequest {
    const optionsDict = new StringDictionary<
        ApplicationCommandInteractionDataOption
    >();
    return {
        ...interaction,
        from: from,
        options: fixArguments(
            interaction.data === undefined ? [] : interaction.data.options,
            optionsDict,
        ),
    };
}
