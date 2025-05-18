const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Whitelist yourself from Anti-Nuke'),

  async execute(interactionOrMessage) {
    const userId = interactionOrMessage.user?.id || interactionOrMessage.author.id
    const config = require('../antinuke.json')

    if (!config.whitelisted.includes(userId)) {
      config.whitelisted.push(userId)
      fs.writeFileSync('./antinuke.json', JSON.stringify(config, null, 2))
    }

    const reply = `Added <@${userId}> to whitelist!`

    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply({ content: reply, ephemeral: true })
    } else {
      interactionOrMessage.channel.send(reply)
    }
  }
}
