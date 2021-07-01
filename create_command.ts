import { DiscordInteractions } from 'slash-commands';

const interaction = new DiscordInteractions({
    applicationId: "your id here",
    authToken: "your token here",
    publicKey: "-----",
  });


const command = {
    name: 'obama',
    description: 'obama',
    type: 2
  };


interaction.createApplicationCommand(command, 'guild id, remove if you want.')
    .then(console.log)
    .catch(console.error)
