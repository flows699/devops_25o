const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

function calculateResult(amount, rate) {
    if (amount < 0) return 0;
    return amount * rate;
}

app.get('/api/convert', async (req, res) => {
    try {
        const { amount, from, to } = req.query;

        if (!amount || !from || !to) {
            return res.status(400).json({ error: "Hiányzó paraméterek" });
        }

        const response = await axios.get(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
        const rate = response.data.rates[to];
        const resultValue = calculateResult(parseFloat(amount), rate);

        console.log(`Átváltás: ${amount} ${from} -> ${to} = ${resultValue}`);

        res.json({
            base: from,
            target: to,
            rate: rate,
            result: resultValue
        });

    } catch (error) {
        console.error("Hiba:", error.message);
        res.status(500).json({ error: "Nem sikerült lekérni az árfolyamot" });
    }
});

const PORT = 5000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Backend szerver fut a http://localhost:${PORT} címen`);
    });
}

module.exports = { app, calculateResult };