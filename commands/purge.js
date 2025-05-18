const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes messages')
    .addIntegerOption(option => 
      option.setName('amount')
            .setDescription('Number of messages to delete')
            .setRequired(true)),

  async execute(interactionOrMessage, args) {
    // Command logic for both interaction and prefix

    let amount
    // Slash command
    if (interactionOrMessage.reply) {
      amount = interactionOrMessage.options.getInteger('amount')
    } 
    // Prefix command
    else {
      amount = parseInt(args[0])
      if (!amount || amount < 1 || amount > 100) {
        return interactionOrMessage.channel.send('Please enter a number between 1 and 100')
      }
    }

    try {
      // Fetch messages and bulk delete
      const fetched = await interactionOrMessage.channel.messages.fetch({ limit: amount })
      await interactionOrMessage.channel.bulkDelete(fetched)

      if (interactionOrMessage.reply) {
        await interactionOrMessage.reply({ content: `Deleted ${amount} messages`, ephemeral: true })
      } else {
        interactionOrMessage.channel.send(`Deleted ${amount} messages`)
      }
    } catch (error) {
      console.error(error)
      if (interactionOrMessage.reply) {
        await interactionOrMessage.reply({ content: 'Error deleting messages', ephemeral: true })
      } else {
        interactionOrMessage.channel.send('Error deleting messages')
      }
    }
  }
}
