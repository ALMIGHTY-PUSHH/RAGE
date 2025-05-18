const antiraidConfig = require('../antiraid.json')
const loggingConfig = require('../logging.json')

let joinLogs = {}

module.exports = {
  name: 'guildMemberAdd',

  async execute(member) {
    // 🔐 Anti-Raid Section
    if (antiraidConfig.enabled && !antiraidConfig.whitelisted.includes(member.user.id)) {
      const now = Date.now()
      const guildId = member.guild.id

      if (!joinLogs[guildId]) joinLogs[guildId] = []
      joinLogs[guildId].push(now)

      // remove old joins
      joinLogs[guildId] = joinLogs[guildId].filter(t => now - t <= antiraidConfig.interval * 1000)
      const joinedCount = joinLogs[guildId].length

      if (joinedCount >= antiraidConfig.threshold) {
        try {
          if (antiraidConfig.action === 'ban') {
            await member.ban({ reason: 'Raid protection triggered' })
          } else {
            await member.kick('Raid protection triggered')
          }

          console.log(`[ANTIRAID] ${member.user.tag} was ${antiraidConfig.action}ed`)

          const logChannel = member.guild.channels.cache.get(loggingConfig.channel_id)
          if (logChannel) logChannel.send(`🚨 Anti-Raid Triggered\nUser: <@${member.user.id}> (${member.user.tag})`)
        } catch (err) {
          console.error(`[ANTIRAID] Failed to ${antiraidConfig.action}:`, err)
        }

        return // skip logging if auto kicked/banned
      }
    }

    // 📝 Logging Section
    if (loggingConfig.enabled) {
      const logChannel = member.guild.channels.cache.get(loggingConfig.channel_id)
      if (logChannel) {
        logChannel.send(`➕ **Member joined:** <@${member.id}>`)
      }
    }
  }
}
