const config = require('../logging.json')

module.exports = {
  name: 'guildMemberRemove',

  async execute(member) {
    if (!config.enabled) return
    const logChannel = member.guild.channels.cache.get(config.channel_id)
    if (logChannel) logChannel.send(`➖ **Member left:** <@${member.id}>`)
  }
}
