const { SlashCommandBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Change nickname of a user')
    .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
    .addStringOption(option => option.setName('nickname').setDescription('New nickname').setRequired(true)),

  async execute(interactionOrMessage, args) {
    let member, nickname

    if (interactionOrMessage.reply) {
      if (!interactionOrMessage.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
        return interactionOrMessage.reply({ content: 'Permission denied', ephemeral: true })
      }

      member = interactionOrMessage.options.getUser('user')
      nickname = interactionOrMessage.options.getString('nickname')

      const guildMember = interactionOrMessage.guild.members.cache.get(member.id)
      if (!guildMember) {
        return interactionOrMessage.reply({ content: 'User not found', ephemeral: true })
      }

      try {
        await guildMember.setNickname(nickname)
        await interactionOrMessage.reply({ content: `Nickname changed to ${nickname}`, ephemeral: true })
      } catch {
        await interactionOrMessage.reply({ content: 'Failed to change nickname', ephemeral: true })
      }

    } else {
      // Prefix command
      if (!interactionOrMessage.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
        return interactionOrMessage.channel.send('Permission denied')
      }

      member = interactionOrMessage.mentions.members.first()
      if (!member) {
        return interactionOrMessage.channel.send('Mention a user to change nickname')
      }

      nickname = args.slice(1).join(' ')
      if (!nickname) {
        return interactionOrMessage.channel.send('Please provide a new nickname')
      }

      try {
        await member.setNickname(nickname)
        interactionOrMessage.channel.send(`Nickname changed to ${nickname}`)
      } catch {
        interactionOrMessage.channel.send('Failed to change nickname')
      }
    }
  }
}
