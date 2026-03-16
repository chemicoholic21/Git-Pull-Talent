const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env.local") });

const sql = neon(process.env.DATABASE_URL);

async function main() {
    try {
        const res = await sql`SELECT count(*) FROM leaderboard`;
        console.log("Leaderboard count:", res[0].count);
        
        const res2 = await sql`SELECT count(*) FROM analyses`;
        console.log("Analyses count:", res2[0].count);
        
        if (res[0].count > 0) {
            const top = await sql`SELECT username, total_score FROM leaderboard LIMIT 5`;
            console.log("Top 5 users:", JSON.stringify(top, null, 2));
        }
    } catch (err) {
        console.error("Query failed!");
        console.error(err);
    }
}

main();
