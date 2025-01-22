cconst axios = require("axios");

const ROBLOSECURITY_COOKIE = "_|WARNING:-DO-NOT-SHARE-THIS..."; 
const GROUP_ID = 34353316; // Replace with your Roblox Group ID

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed." });
    }

    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required." });
    }

    try {
        const userResponse = await axios.get(
            `https://users.roblox.com/v1/users/search?keyword=${username}`,
            { headers: { Cookie: `.ROBLOSECURITY=${ROBLOSECURITY_COOKIE}` } }
        );
        const userId = userResponse.data.data[0]?.id;

        if (!userId) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const rankResponse = await axios.get(
            `https://groups.roblox.com/v1/groups/${GROUP_ID}/users/${userId}`,
            { headers: { Cookie: `.ROBLOSECURITY=${ROBLOSECURITY_COOKIE}` } }
        );
        const currentRank = rankResponse.data.role.rank;

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
};
