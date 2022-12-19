import arweave from '../utils';
import { generateMnemonic, getKeyFromMnemonic } from 'arweave-mnemonic-keys';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { BalanceProps, CreateProps, CreateReturnProps } from '../types/wallet';

/**
 * create wallet
 * @returns walletAddress, JWK, and seedPhrase if options.seedPhrase is passed in
 */

export async function createWallet(
  options: CreateProps
): Promise<CreateReturnProps> {
  if (options && options.seedPhrase) {
    const seedPhrase = await generateMnemonic();

    if (seedPhrase) {
      const key = await getKeyFromMnemonic(seedPhrase);
      const walletAddress = await arweave.wallets.jwkToAddress(key);

      return {
        key,
        walletAddress,
        seedPhrase,
      };
    }
  }

  const key = await arweave.wallets.generate();
  const walletAddress = await arweave.wallets.jwkToAddress(key);

  return {
    key,
    walletAddress,
  };
}

/**
 * get wallet address for a provate key
 * @return address
 */
export async function getAddress(key: JWKInterface): Promise<string> {
  if (!key) {
    return 'enter private key as argument';
  }

  const address = await arweave.wallets.jwkToAddress(key);
  return address;
}

/**
 * create wallet
 * @params options -> { walletAddress: string }
 * @returns walletBalance: string
 */

export async function getBalance(options: BalanceProps): Promise<string> {
  if (options.walletAddress.length === 0) {
    return 'Enter a valid wallet address as getBalance({ walletAddress: "WALLET_ADDRESS" }).';
  }

  if (options.walletAddress.length > 0 && options.walletAddress.length < 43) {
    return 'Entered wallet address is less than 43 characters. Enter a valid wallet address as getBalance({ walletAddress: "WALLET_ADDRESS" }).';
  }

  const walletBalance = arweave.wallets.getBalance(options.walletAddress);

  return walletBalance;
}
