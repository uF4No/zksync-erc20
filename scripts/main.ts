import { AtlasEnvironment } from "atlas-ide";
import { ContractFactory, utils} from 'zksync-ethers';
import TokenArtifact from "../artifacts/MyToken";
import * as ethers from "ethers";

// WALLET TO MINT TOKENS TO
const RECEIVER_WALLET    = "0x5eE49779dC4bd4CA802660678a8E3F57FB5f4a2b";
const TOKEN_AMOUNT    = "333";

export async function main (atlas: AtlasEnvironment) {
    // @ts-ignore target zkSyncTestnet in config file which can be testnet or local
  const provider = new Web3Provider(atlas.provider);
  const wallet = provider.getSigner();

  const factory = new ContractFactory(
      TokenArtifact.MyToken.abi,
      TokenArtifact.MyToken.evm.bytecode.object,
      wallet,
      "create"
  );
  const additionalFactoryDeps = [`0x${TokenArtifact.MyToken.evm.bytecode.object}`]

  const additionalDeps = additionalFactoryDeps
            ? additionalFactoryDeps.map((val) => ethers.utils.hexlify(val))
            : [];
  const factoryDeps = [...additionalDeps];

  const tokenContract = await factory.deploy(
      ...[utils.hashBytecode(`0x${TokenArtifact.MyToken.evm.bytecode.object}`)],
      {
        customData: {
          factoryDeps,
        },
      }
  );
  console.log("tokenContract deploying...");
  await tokenContract.deployed();
  const receipt = await tokenContract.deployTransaction.wait();

  console.log(`tokenContract address: ${receipt.contractAddress}`);

  console.log("Success!");
}
