const slashCommands = require('slash-commands');

const interaction = new slashCommands.DiscordInteractions({
    applicationId: "APPLICATION ID",
    authToken: "BOT TOKEN",
    publicKey: "DISCORD PUBLIC KEY",
  });


const command = {
    name: '8ball',
    description: 'weee',
    type: 2,
    options: [
      {
        name: 'question',
        description: 'what is your question?',
        type: slashCommands.ApplicationCommandOptionType.STRING
      }
    ]
  };


// 483409624100503562 is the guild id.
interaction.createApplicationCommand(command, '483409624100503562')
    .then(console.log)
    .catch(console.error)
