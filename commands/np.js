const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs')
const path = require('path')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('np')
    .setDescription('Manage no-prefix users')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Add user to no-prefix list')
        .addStringOption(o => o.setName('userid').setDescription('User ID').setRequired(true))
        .addStringOption(o => o.setName('duration').setDescription('e.g. 1d, 1h, 30m').setRequired(true))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand()
    const userId = interaction.options.getString('userid')
    const durationStr = interaction.options.getString('duration')

    if (sub === 'add') {
      const noprefixPath = path.join(__dirname, '..', 'noprefix.json')
      const noprefixData = require(noprefixPath)

      const durationMs = parseDuration(durationStr)
      if (!durationMs) return interaction.reply({ content: '❌ Invalid duration format', ephemeral: true })

      const expires = Date.now() + durationMs

      noprefixData.users[userId] = { expires }
      fs.writeFileSync(noprefixPath, JSON.stringify(noprefixData, null, 2))

      interaction.reply(`✅ <@${userId}> added to no-prefix users for ${durationStr}`)
    }
  }
}

// Parse duration like "1d", "30m", "2h"
function parseDuration(str) {
  const match = /^(\d+)([smhd])$/.exec(str)
  if (!match) return null

  const value = parseInt(match[1])
  const unit = match[2]

  switch (unit) {
    case 's': return value * 1000
    case 'm': return value * 60 * 1000
    case 'h': return value * 60 * 60 * 1000
    case 'd': return value * 24 * 60 * 60 * 1000
    default: return null
  }
}
