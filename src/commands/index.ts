// todo: should this go into types
export {
    createOriginal,
    followup,
    editFollowup,
    deleteFollowup,
} from '../lib/endpoints';

import { handleOwO } from './owo';
import { handle8Ball } from './8ball';

type complexCommand = (_: InteractionWithContext) => Promise<void>;
type simpleCommand = (_: InteractionRequest) => Promise<InteractionResponse>;

export const handlers: {
    [id: string]: complexCommand | simpleCommand;
} = {
    '786838810297630740': handleOwO,
    '788133812575797278': handle8Ball,
};
