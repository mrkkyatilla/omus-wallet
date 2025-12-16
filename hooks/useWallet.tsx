
import { erc20Abi, ethereumProvider, solanaRPC, USDC_CONTRACT_ETHEREUM, USDC_MINT_SOLANA } from '../lib/wallet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from '@solana/spl-token';
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction as SolanaTransaction,
} from '@solana/web3.js';
import { ethers } from 'ethers';
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';

// --- TYPE DEFINITIONS ---
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  usdValue: number;
  icon: string;
  address?: string; // For ERC-20 or SPL tokens
  decimals?: number; // Token decimals
}

export interface Transaction {
  id: string;
  assetId: string;
  type: 'sent' | 'received';
  amount: number;
  usdValue: number;
  date: string;
  recipient?: string;
  sender?: string;
}

interface WalletContextType {
  solanaWallet: Keypair | null;
  ethereumWallet: any | null;
  assets: Asset[];
  transactions: Transaction[];
  loading: boolean;
  refreshData: () => void;
  sendTransaction: (asset: Asset, recipientAddress: string, amount: number) => Promise<boolean>;
}

// --- CONTEXT ---
export const WalletContext = createContext<WalletContextType | undefined>(undefined);

// --- HOOK ---
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// --- PROVIDER ---
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [solanaWallet, setSolanaWallet] = useState<Keypair | null>(null);
  const [ethereumWallet, setEthereumWallet] = useState<any | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    // ... (implementation remains the same)
  }, [solanaWallet, ethereumWallet]);

  const sendTransaction = async (asset: Asset, recipientAddress: string, amount: number) => {
    if (!solanaWallet || !ethereumWallet) {
      console.error("Wallets not initialized");
      return false;
    }

    setLoading(true);
    try {
      // Solana Transaction
      if (asset.id === 'solana' || asset.address === USDC_MINT_SOLANA.toBase58()) {
        const isToken = asset.address === USDC_MINT_SOLANA.toBase58();
        const toPubkey = new PublicKey(recipientAddress);
        const transaction = new SolanaTransaction();

        if (isToken) {
            const fromTokenAccount = await getAssociatedTokenAddress(USDC_MINT_SOLANA, solanaWallet.publicKey);
            const toTokenAccount = await getAssociatedTokenAddress(USDC_MINT_SOLANA, toPubkey);
            
            const toTokenAccountInfo = await solanaRPC.getAccountInfo(toTokenAccount);
            if (!toTokenAccountInfo) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(solanaWallet.publicKey, toTokenAccount, toPubkey, USDC_MINT_SOLANA)
                );
            }

            transaction.add(
                createTransferInstruction(
                    fromTokenAccount,
                    toTokenAccount,
                    solanaWallet.publicKey,
                    amount * (10 ** (asset.decimals || 6)) // Use provided decimals or default to 6 for USDC
                )
            );
        } else {
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: solanaWallet.publicKey,
                    toPubkey: toPubkey,
                    lamports: amount * LAMPORTS_PER_SOL,
                })
            );
        }

        // Note: The sendTransaction function has been updated to align with web3.js v1.73.0+
        // The first argument is the transaction, the second is the array of signers.
        const { blockhash, lastValidBlockHeight } = await solanaRPC.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight = lastValidBlockHeight;
        transaction.feePayer = solanaWallet.publicKey;

        const signature = await solanaRPC.sendRawTransaction(transaction.serialize());
        
        await solanaRPC.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight
        }, 'processed');

      // Ethereum Transaction
      } else if (asset.id === 'ethereum' || asset.address === USDC_CONTRACT_ETHEREUM) {
        const isToken = asset.address === USDC_CONTRACT_ETHEREUM;
        const ethWallet = ethereumWallet.connect(ethereumProvider);
        let tx;

        if (isToken) {
            const usdcContract = new ethers.Contract(USDC_CONTRACT_ETHEREUM, erc20Abi, ethWallet);
            const decimals = asset.decimals || 6;
            const amountToSend = ethers.parseUnits(amount.toString(), decimals);
            tx = await usdcContract.transfer(recipientAddress, amountToSend);
        } else {
            tx = await ethWallet.sendTransaction({
                to: recipientAddress,
                value: ethers.parseEther(amount.toString()),
            });
        }
        await tx.wait();
      } else {
        throw new Error("Unsupported asset for sending");
      }

      await refreshData(); // Refresh balances after sending
      return true;
    } catch (error) {
      console.error("Send transaction failed:", error);
      throw error; // Re-throw to be caught by the UI
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initWallets = async () => {
      // Solana
      let solKeypair: Keypair;
      const solKey = await AsyncStorage.getItem('solana_secret_key');
      if (solKey) {
        solKeypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(solKey)));
      } else {
        solKeypair = Keypair.generate();
        await AsyncStorage.setItem('solana_secret_key', JSON.stringify(Array.from(solKeypair.secretKey)));
      }
      setSolanaWallet(solKeypair);

      // Ethereum
      let ethWallet: any;
      const ethKey = await AsyncStorage.getItem('ethereum_private_key');
      if (ethKey) {
        ethWallet = new ethers.Wallet(ethKey);
      } else {
        ethWallet = ethers.Wallet.createRandom();
        await AsyncStorage.setItem('ethereum_private_key', ethWallet.privateKey);
      }
      setEthereumWallet(ethWallet);

      setLoading(false);
    };
    initWallets();
  }, []);

  useEffect(() => {
    if (solanaWallet && ethereumWallet) {
      refreshData();
    }
  }, [solanaWallet, ethereumWallet, refreshData]);

  const contextValue = {
    assets,
    transactions,
    solanaWallet,
    ethereumWallet,
    loading,
    refreshData,
    sendTransaction,
  };

  return (
    <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>
  );
};
