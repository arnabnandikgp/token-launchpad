"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const spl_token_1 = require("@solana/spl-token");
require("dotenv/config");
const helpers_1 = require("@solana-developers/helpers");
const web3_js_1 = require("@solana/web3.js");
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"));
const user = (0, helpers_1.getKeypairFromEnvironment)("SECRET_KEY");
console.log(`🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`);
function makeATA() {
    return __awaiter(this, void 0, void 0, function* () {
        // Substitute in your token mint account from create-token-mint.ts
        const tokenMintAccount = new web3_js_1.PublicKey("96VdYqGjcPFgdDMsR5kQo1Hwiuf7iYdfsy57FuqzLn2X");
        // Here we are making an associated token account for our own address, but we can
        // make an ATA on any other wallet in devnet!
        // const recipient = new PublicKey("SOMEONE_ELSES_DEVNET_ADDRESS");
        const recipient = user.publicKey;
        const tokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, user, // payer
        tokenMintAccount, recipient);
        console.log(`Token Account: ${tokenAccount.address.toBase58()}`);
        const link = (0, helpers_1.getExplorerLink)("address", tokenAccount.address.toBase58(), "devnet");
        console.log(`✅ Created token Account: ${link}`);
    });
}
makeATA();
