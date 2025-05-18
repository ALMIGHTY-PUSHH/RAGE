require('dotenv').config()
const { Client, Collection, GatewayIntentBits } = require('discord.js')
const fs = require('fs')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

client.commands = new Collection()

// Load slash commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.data.name, command)
}

// Load events
const eventFiles = fs.readdirSync('./events')
for (const file of eventFiles) {
  const event = require(`./events/${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client))
  } else {
    client.on(event.name, (...args) => event.execute(...args, client))
  }
})

const prefix = '!' // apna prefix set kar

client.on('messageCreate', message => {
  if (!message.guild || message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  const args = message.content.slice(prefix.length).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()
  const command = client.commands.get(commandName)

  if (!command) return

  try {
    command.execute(message, args)
  } catch (error) {
    console.error(error)
    message.reply('Kuch to gadbad ho gaya bhai 😅')
  }
})

client.login(process.env.TOKEN)

const express = require('express');
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is online!");
});

app.listen(3000, () => {
  console.log("Express server active");
});
