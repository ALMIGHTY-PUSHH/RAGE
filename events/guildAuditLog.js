const { AuditLogEvent } = require('discord.js')
const config = require('../antinuke.json')

module.exports = {
  name: 'guildAuditLogEntryCreate',

  async execute(entry, guild) {
    if (!config.enabled) return
    const executor = entry.executor
    if (config.whitelisted.includes(executor.id)) return

    let actionDetected = false

    // Detect dangerous actions
    switch (entry.action) {
      case AuditLogEvent.RoleDelete:
      case AuditLogEvent.ChannelDelete:
      case AuditLogEvent.BotAdd:
      case AuditLogEvent.MemberBanAdd:
      case AuditLogEvent.MemberKick:
      case AuditLogEvent.WebhookCreate:
        actionDetected = true
        break
    }

    if (actionDetected) {
      try {
        const member = await guild.members.fetch(executor.id)
        await member.kick('Nuke detected by Akatsuki Anti-Nuke')
        console.log(`[ANTINUKE] Kicked: ${executor.tag} for suspicious action`)
      } catch (err) {
        console.log(`[ANTINUKE] Failed to kick ${executor.tag}`)
      }
    }
  }
}
