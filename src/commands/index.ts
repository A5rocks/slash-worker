export { InteractionResponseType } from '../types';

import { handleOwO } from './owo';
import { handle8Ball } from './8ball';

export const handlers: {
    [id: string]: (_: InteractionRequest) => Promise<InteractionResponse>;
} = {
    '786838810297630740': handleOwO,
    '788133812575797278': handle8Ball,
};
