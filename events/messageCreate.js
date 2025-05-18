const fs = require('fs')
const noprefix = require('../noprefix.json')
const prefix = '!' // apna prefix yaha set kar

module.exports = {
  name: 'messageCreate',

  async execute(message) {
    if (!message.guild || message.author.bot) return

    const userId = message.author.id
    const now = Date.now()
    const isNoPrefixUser = noprefix.users[userId] && noprefix.users[userId].expires > now
    const isBotMentioned = message.content.startsWith(`<@${message.client.user.id}>`)
    const isPrefixed = message.content.startsWith(prefix)

    // agar na prefix na mention na premium — return
    if (!isPrefixed && !isBotMentioned && !isNoPrefixUser) return

    const content = isPrefixed
      ? message.content.slice(prefix.length).trim()
      : isBotMentioned
      ? message.content.replace(`<@${message.client.user.id}>`, '').trim()
      : message.content.trim()

    const args = content.split(/ +/)
    const cmdName = args.shift()?.toLowerCase()

    const command = message.client.commands.get(cmdName)
    if (!command) return

    try {
      await command.execute(message, args)
    } catch (err) {
      console.error(`[CMD ERROR]`, err)
      message.reply('❌ koi error aaya command chalaate waqt')
    }
  }
}
