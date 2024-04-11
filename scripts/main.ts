import { AtlasEnvironment } from "atlas-ide";
import { Web3Provider, Contract} from 'zksync-web3';
import TokenArtifact from "../artifacts/TestToken";
import * as ethers from "ethers";

// WALLET TO MINT TOKENS TO
const TOKEN_CONTRACT_ADDRESS = ""
const RECEIVER_WALLET    = "0x5eE49779dC4bd4CA802660678a8E3F57FB5f4a2b";
const TOKEN_AMOUNT    = "333";

export async function main (atlas: AtlasEnvironment) {
    // @ts-ignore target zkSyncTestnet in config file which can be testnet or local
  const provider = new Web3Provider(atlas.provider);
  const wallet = provider.getSigner();

  const tokenContract= new Contract(TOKEN_CONTRACT_ADDRESS, TokenArtifact.TestToken.abi, wallet);

  console.log("Minting tokens...");
  const tx = await tokenContract.mint(RECEIVER_WALLET, ethers.utils.parseEther(TOKEN_AMOUNT));
  await tx.wait();
 
  console.log("Success!");
  console.log(`The account ${RECEIVER_WALLET} now has ${ethers.utils.parseEther(await tokenContract.balanceOf(RECEIVER_WALLET))} tokens`)

}
