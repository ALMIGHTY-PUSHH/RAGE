const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows help for commands'),

  async execute(interactionOrMessage, args) {
    const helpMessage = `
**Available Commands**
- /ping or !ping : Pong reply
- /purge or !purge [amount] : Delete messages
- /nick or !nick @user [nickname] : Change nickname
- /help : This help message
`
    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply({ content: helpMessage, ephemeral: true })
    } else {
      interactionOrMessage.channel.send(helpMessage)
    }
  }
}
