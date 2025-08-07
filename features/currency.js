// currency.js
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Your API key
const API_KEY = process.env.API_KEY;

async function handleCurrencyCommand(message) {
    const args = message.content.trim().split(/\s+/);

    if (args.length !== 4) {
        return message.reply("❌ Usage: `.convert <amount> <from_currency> <to_currency>`\nExample: ``convert 100 USD INR`");
    }

    const amount = parseFloat(args[1]);
    const from = args[2].toUpperCase();
    const to = args[3].toUpperCase();

    if (isNaN(amount)) {
        return message.reply("❌ The amount must be a number.");
    }

    try {
        // Fetch exchange rates for the "from" currency
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`);
        const data = await res.json();

        if (data.result !== "success") {
            return message.reply("❌ Could not fetch conversion. Check currency codes.");
        }

        const rate = data.conversion_rates[to];
        if (!rate) {
            return message.reply(`❌ Currency code "${to}" is not supported.`);
        }

        const convertedAmount = (amount * rate).toFixed(2);

        return message.channel.send(`💱 **${amount} ${from}** = **${convertedAmount} ${to}**`);
    } catch (error) {
        console.error(error);
        return message.reply("❌ Error fetching currency data. Please try again later.");
    }
}

module.exports = { handleCurrencyCommand };
