import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "NFT Marketplace - Nosirov Mamurjon",
  projectId: "2554b95bb392008b45de6bc5a8c7adbb", // WalletConnect Project ID
  chains: [sepolia],
  ssr: true,
});
