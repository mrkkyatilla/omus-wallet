
import { Connection, PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';

// --- Güvenli Ortam Değişkeni Erişimi ---
const INFURA_ID = process.env.EXPO_PUBLIC_INFURA_ID;
const SOLANA_URL = process.env.EXPO_PUBLIC_SOLANA_RPC;

// --- CONSTANTS ---
// Ortam değişkenleri yoksa, varsayılan (fallback) değerler kullanılır.
// UYARI: Bu varsayılan RPC URL'leri halka açıktır ve rate limitlere tabi olabilir.
// En iyi performans için kendi .env dosyanızı oluşturmanız önerilir.
export const SOLANA_RPC_URL = SOLANA_URL || 'https://api.mainnet-beta.solana.com';
export const ETHEREUM_RPC_URL = INFURA_ID ? `https://mainnet.infura.io/v3/${INFURA_ID}` : 'https://rpc.ankr.com/eth';

if (!INFURA_ID || !SOLANA_URL) {
  console.warn(
    "Uyarı: EXPO_PUBLIC_INFURA_ID veya EXPO_PUBLIC_SOLANA_RPC ortam değişkenleri ayarlanmamış. " +
    "Varsayılan, halka açık RPC endpoint'leri kullanılıyor. Bu, uygulamanızın performansını ve güvenilirliğini etkileyebilir. " +
    "Lütfen projenizin kök dizininde bir .env dosyası oluşturun ve bu değişkenleri tanımlayın."
  );
}

export const USDC_MINT_SOLANA = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
export const USDC_CONTRACT_ETHEREUM = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

// --- CONNECTIONS ---
// Bağlantıların yalnızca geçerli URL'ler ile oluşturulduğundan emin olunur.
export const solanaRPC = new Connection(SOLANA_RPC_URL);
export const ethereumProvider = new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);

// --- ERC20 ABI (for transfer function) ---
export const erc20Abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint amount) returns (bool)',
  'function decimals() view returns (uint8)',
];
