import "dotenv/config";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
// const secretKey = process.env.SECRET_KEY;
// const user = getKeypairFromEnvironment(secretKey as string);
const user = getKeypairFromEnvironment("SECRET_KEY");

console.log(
  `🔑 We've loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
);
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const tokenMintAccount = new PublicKey(
  "96VdYqGjcPFgdDMsR5kQo1Hwiuf7iYdfsy57FuqzLn2X"
);

async function makeTokenMetadata() {
  const metadataData = {
    name: "primal token",
    symbol: "PRML",
    uri: "somehting",
    // Arweave / IPFS / Pinata etc link using metaplex standard for offchain data
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  };

  const metadataPDAAndBump = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      tokenMintAccount.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  console.log(metadataPDAAndBump[0]);

  const metadataPDA = metadataPDAAndBump[0];

  const transaction = new Transaction();

  const createMetadataAccountInstruction =
    createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataPDA,
        mint: tokenMintAccount,
        mintAuthority: user.publicKey,
        payer: user.publicKey,
        updateAuthority: user.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          collectionDetails: null,
          data: metadataData,
          isMutable: true,
        },
      }
    );

  transaction.add(createMetadataAccountInstruction);

  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [user]
  );

  const transactionLink = getExplorerLink(
    "transaction",
    transactionSignature,
    "devnet"
  );

  console.log(`✅ Transaction confirmed, explorer link is: ${transactionLink}`);

  const tokenMintLink = getExplorerLink(
    "address",
    tokenMintAccount.toString(),
    "devnet"
  );

  console.log(`✅ Look at the token mint again: ${tokenMintLink}`);
}
makeTokenMetadata();
