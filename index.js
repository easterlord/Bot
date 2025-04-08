const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Check for "Vouch [text] @user" format
  const vouchRegex = /^vouch\s+\[(.+)\]\s+<@!?(\d+)>$/i;
  const match = message.content.match(vouchRegex);

  if (match) {
    const [_, text, userId] = match;
    
    try {
      // Find the Customer role
      const customerRole = message.guild.roles.cache.find(
        role => role.name.toLowerCase() === 'customer'
      );

      if (!customerRole) {
        return message.reply('❌ The Customer role does not exist!');
      }

      // Assign role to the MESSAGE AUTHOR (person who typed)
      await message.member.roles.add(customerRole);
      
      // Reply with confirmation
      message.reply(
        `✅ Success! You received the **${customerRole.name}** role!\n` +
        `Vouch reason: ${text}\n` +
        `Mentioned user: <@${userId}>`
      );
      
    } catch (error) {
      console.error('Error assigning role:', error);
      message.reply('❌ Failed to assign role. Please check bot permissions.');
    }
  }
});

client.login(process.env.TOKEN);