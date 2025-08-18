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
const helpers_1 = require("@solana-developers/helpers");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
require("dotenv/config");
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"));
const user = (0, helpers_1.getKeypairFromEnvironment)("SECRET_KEY");
console.log(`🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`);
function makeTokenMint() {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure that the mint authority(which is also the payer in this case has some 
        // balance to initialize the token mint)
        // TODO: add a function to airdrop some solana to the mint authority by first 
        // checking its balance.
        const balance = yield connection.getBalance(user.publicKey);
        console.log(balance);
        const tokenMint = yield (0, spl_token_1.createMint)(connection, user, user.publicKey, null, 2);
        const link = (0, helpers_1.getExplorerLink)("address", tokenMint.toString(), "devnet");
        console.log(`✅ Finished! Created token mint: ${link}`);
    });
}
makeTokenMint();
