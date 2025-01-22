const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Roblox configuration
const ROBLOSECURITY_COOKIE = "YOUR_ROBLOX_SECURE_COOKIE"; // Replace with your cookie
const GROUP_ID = 123456; // Replace with your Roblox Group ID

// Promote API endpoint
app.post("/promote", async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required." });
    }

    try {
        // Step 1: Fetch user ID from username
        const userResponse = await axios.get(
            `https://users.roblox.com/v1/users/search?keyword=${username}`,
            { headers: { Cookie: `.ROBLOSECURITY=${ROBLOSECURITY_COOKIE}` } }
        );
        const userId = userResponse.data.data[0]?.id;

        if (!userId) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Step 2: Get user's current rank in the group
        const rankResponse = await axios.get(
            `https://groups.roblox.com/v1/groups/${GROUP_ID}/users/${userId}`,
            { headers: { Cookie: `.ROBLOSECURITY=${ROBLOSECURITY_COOKIE}` } }
        );
        const currentRank = rankResponse.data.role.rank;

        // Step 3: Promote user by increasing rank by 1
        const promoteResponse = await axios.patch(
            `https://groups.roblox.com/v1/groups/${GROUP_ID}/users/${userId}`,
            { role: currentRank + 1 },
            { headers: { Cookie: `.ROBLOSECURITY=${ROBLOSECURITY_COOKIE}` } }
        );

        res.json({ success: true, message: `${username} promoted successfully.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error promoting the user." });
    }
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});
