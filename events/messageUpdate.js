const config = require('../logging.json')

module.exports = {
  name: 'messageUpdate',

  async execute(oldMsg, newMsg) {
    if (!config.enabled || !oldMsg.guild || oldMsg.author.bot) return
    if (oldMsg.content === newMsg.content) return
    const logChannel = oldMsg.guild.channels.cache.get(config.channel_id)
    if (!logChannel) return

    logChannel.send({
      content: `✏️ **Message edited**\n**User:** <@${oldMsg.author.id}>\n**Channel:** <#${oldMsg.channel.id}>\n**Before:** ${oldMsg.content}\n**After:** ${newMsg.content}`
    })
  }
}
