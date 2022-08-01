import { Finding, HandleTransaction, TransactionEvent, getEthersProvider } from "forta-agent";
import { providers } from "ethers";
// import NetworkData from "./network";
// import NetworkManager from "./network";
import utils from "./utils";
import abi from "./abi";
import { NetworkManager } from "forta-agent-tools";

interface NetworkData {
  masterChef: string;
  num: number; 
}

const data: Record<number, NetworkData> = {
  56:{
    masterChef: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
    num: 1,
  },
  97:{
    masterChef: "0xbD315DA028B586f7cD93903498e671fA3efeF506", 
    num: 2, 
  },
};

const networkManager = new NetworkManager(data);

export const initialize = (provider: providers.Provider) => async () => {
  await networkManager.init(provider);  
  // const { chainId } = await provider.getNetwork();
  // networkManager.setNetwork(chainId);
};

export const handleTransaction =
  (contractAddress: NetworkData): HandleTransaction =>
  async (txEvent: TransactionEvent) => {
    const findings: Finding[] = [];
    const functionCalls = txEvent.filterFunction(abi.CAKE_ABI, contractAddress.masterChef);

    functionCalls.forEach((functionCall) => {
      findings.push(utils.createFinding(functionCall));
    });

    return findings;
  };

export default {
  initialize: initialize(getEthersProvider()),
  handleTransaction: handleTransaction(networkManager),
};
