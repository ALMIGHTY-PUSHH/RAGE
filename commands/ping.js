const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),

  // interactionOrMessage can be either Interaction (slash) or Message (prefix)
  async execute(interactionOrMessage, args) {
    // Agar slash command hai (interaction)
    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply('🏓 Pong bhai!')
    } 
    // Agar prefix command hai (message)
    else {
      interactionOrMessage.channel.send('🏓 Pong bhai!')
    }
  }
}
