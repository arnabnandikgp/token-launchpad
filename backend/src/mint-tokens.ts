import { mintTo } from "@solana/spl-token";
import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
const connection = new Connection(clusterApiUrl("devnet"));

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const user = getKeypairFromEnvironment("SECRET_KEY");
async function mintTokens() {
  // Substitute in your token mint account from create-token-mint.ts
  const tokenMintAccount = new PublicKey("96VdYqGjcPFgdDMsR5kQo1Hwiuf7iYdfsy57FuqzLn2X");

  // Substitute in your own, or a friend's token account address, based on the previous step.
  const recipientAssociatedTokenAccount = new PublicKey(
    "2MEfyoeVMEoZNdV8aKKdGa39MN5avrkDzdf76NshCi24"
  );

  const transactionSignature = await mintTo(
    connection,
    user, // from
    tokenMintAccount, //tokenMint
    recipientAssociatedTokenAccount, // to
    user, // mint authority
    10 * MINOR_UNITS_PER_MAJOR_UNITS
  );

  const link = getExplorerLink("transaction", transactionSignature, "devnet");

  console.log(`✅ Success! Mint Token Transaction: ${link}`);
}
mintTokens();
