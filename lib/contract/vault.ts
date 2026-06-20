import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import { REVEN_VAULT_ABI, REVEN_VAULT_ADDRESS } from "@/lib/contract/revenVault";

export async function getVaultContract(walletClient: any) {
  const provider = new BrowserProvider(walletClient.transport);
  const signer = await provider.getSigner();

  return new Contract(REVEN_VAULT_ADDRESS, REVEN_VAULT_ABI, signer);
}

export async function getCardBalance(walletClient: any, tokenId: number) {
  const contract = await getVaultContract(walletClient);
  const balance = await contract.balanceOfCard(tokenId);

  return formatEther(balance);
}

export async function reloadCard(walletClient: any, tokenId: number, amountEth: string) {
  const contract = await getVaultContract(walletClient);

  const tx = await contract.reload(tokenId, {
    value: parseEther(amountEth),
  });

  return await tx.wait();
}

export async function withdrawFromCard(walletClient: any, tokenId: number, amountEth: string) {
  const contract = await getVaultContract(walletClient);

  const tx = await contract.withdraw(tokenId, parseEther(amountEth));

  return await tx.wait();
}