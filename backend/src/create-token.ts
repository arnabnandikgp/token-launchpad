import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { createMint } from "@solana/spl-token";
import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
import "dotenv/config";
const connection = new Connection(clusterApiUrl("devnet"));

const user: Keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(
  `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`,
);


async function makeTokenMint() {
    // Ensure that the mint authority(which is also the payer in this case has some 
// balance to initialize the token mint)

// TODO: add a function to airdrop some solana to the mint authority by first 
// checking its balance.

const balance = await connection.getBalance(user.publicKey);
console.log(balance);


const tokenMint = await createMint(
    connection,
    user,
    user.publicKey,
    null,
    2
);
const link = getExplorerLink("address", tokenMint.toString(), "devnet");
console.log(`✅ Finished! Created token mint: ${link}`);
}

makeTokenMint();





