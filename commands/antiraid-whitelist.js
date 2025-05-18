const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antiraid-whitelist')
    .setDescription('Whitelist yourself from Anti-Raid'),

  async execute(interactionOrMessage) {
    const userId = interactionOrMessage.user?.id || interactionOrMessage.author.id
    const config = require('../antiraid.json')

    if (!config.whitelisted.includes(userId)) {
      config.whitelisted.push(userId)
      fs.writeFileSync('./antiraid.json', JSON.stringify(config, null, 2))
    }

    const reply = `✅ <@${userId}> added to anti-raid whitelist`

    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply({ content: reply, ephemeral: true })
    } else {
      interactionOrMessage.channel.send(reply)
    }
  }
}
