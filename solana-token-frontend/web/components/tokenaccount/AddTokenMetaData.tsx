'use client';
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import { FC, useState } from 'react';
import styles from '../../app/styles/Home.module.css';


export const AddTokenMetaDataForm: FC = () => {
  const [txSig, setTxSig] = useState('');
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : '';
  };



  const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
  // Function to process and validate the token name
  const processTokenName = (name: string): string => {
    // Remove extra whitespace and limit length
    const processedName = name.trim().substring(0, 32);
    return processedName;
  };

  // Function to process and validate the token symbol
  const processTokenSymbol = (symbol: string): string => {
    // Convert to uppercase and limit length
    const processedSymbol = symbol.trim().toUpperCase().substring(0, 10);
    return processedSymbol;
  };

  // Function to create metadata JSON structure
  const createMetadataJson = (name: string, symbol: string, uri: string) => {
    return {
      name: processTokenName(name),
      symbol: processTokenSymbol(symbol),
      uri: uri,
      sellerFeeBasisPoints: 0, // Default to 0%
      creators: null, // Can be extended later
      collection: null,
      uses: null,
    };
  };

  const addTokenMetadata = async (event: any) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      return;
    }

    try {
      const tokenMintAccount = new web3.PublicKey(event.target.mint.value);
      const name = event.target.name.value;
      const symbol = event.target.symbol.value;
      const uri = event.target.uri.value;

      // Create metadata JSON
      const metadataJson = createMetadataJson(name, symbol, uri);

      console.log('Processed metadata:', metadataJson);

      const metadataPDAAndBump = web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from('metadata'),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          tokenMintAccount.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );

      console.log(metadataPDAAndBump[0]);

      const metadataPDA = metadataPDAAndBump[0];

      // Placeholder for transaction creation
      const transaction = new web3.Transaction();

      const createMetadataAccountInstruction =
      createCreateMetadataAccountV3Instruction(
        {
          metadata: metadataPDA,
          mint: tokenMintAccount,
          mintAuthority: publicKey,
          payer: publicKey,
          updateAuthority: publicKey,
        },
        {
          createMetadataAccountArgsV3: {
            collectionDetails: null,
            data: metadataJson,
            isMutable: true,
          },
        }
      );
  
    transaction.add(createMetadataAccountInstruction);

    sendTransaction(transaction, connection).then((sig) => {
        setTxSig(sig);
      });
  
      console.log('Metadata processing completed successfully');
    } catch (error) {
      console.error('Error processing metadata:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      alert('Error processing metadata: ' + errorMessage);
    }
  };

  return (
    <div>
      <br />
      {publicKey ? (
        <form onSubmit={addTokenMetadata} className={styles.form}>
          <label htmlFor="mint">Token Mint Address:</label>
          <input
            id="mint"
            type="text"
            className={styles.formField}
            placeholder="Enter token mint address"
            required
          />
          <label htmlFor="name">Token Name:</label>
          <input
            id="name"
            type="text"
            className={styles.formField}
            placeholder="Enter Token Name (max 32 characters)"
            required
          />
          <label htmlFor="symbol">Token Symbol:</label>
          <input
            id="symbol"
            type="text"
            className={styles.formField}
            placeholder="Enter Token Symbol (max 10 characters)"
            required
          />
          <label htmlFor="uri">Metadata URI:</label>
          <input
            id="uri"
            type="url"
            className={styles.formField}
            placeholder="Enter Metadata URI (https://...)"
            required
          />
          <button type="submit" className={styles.formButton}>
            Add Token Metadata
          </button>
        </form>
      ) : (
        <span></span>
      )}
      {txSig ? (
        <div>
          <p>View your transaction on </p>
          <a className={styles.link} href={link()}>
            Solana Explorer
          </a>
        </div>
      ) : null}
    </div>
  );
};
