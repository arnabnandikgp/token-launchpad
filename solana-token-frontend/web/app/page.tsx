import { BalanceDisplay } from '../components/tokenaccount/BalanceDisplay';
import { CreateMintForm } from '../components/tokenaccount/CreateMint';
import { CreateTokenAccountForm } from '../components/tokenaccount/CreateTokenAccount';
import { MintToForm } from '../components/tokenaccount/MintToForm';
import { AddTokenMetaDataForm } from '../components/tokenaccount/AddTokenMetaData';

export default function Page() {
  return (
    <>
      <BalanceDisplay />
      <CreateMintForm />
      < AddTokenMetaDataForm />
      <CreateTokenAccountForm />
      <MintToForm />
    </>
  );
}
