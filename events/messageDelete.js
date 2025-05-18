const config = require('../logging.json')

module.exports = {
  name: 'messageDelete',

  async execute(message) {
    if (!config.enabled || !message.guild || message.author.bot) return
    const logChannel = message.guild.channels.cache.get(config.channel_id)
    if (!logChannel) return

    logChannel.send({
      content: `🗑️ **Message deleted**\n**User:** <@${message.author.id}>\n**Channel:** <#${message.channel.id}>\n**Content:** ${message.content || '*none*'}`
    })
  }
}
