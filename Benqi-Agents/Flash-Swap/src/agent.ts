import { 
  Finding, 
  HandleTransaction, 
  TransactionEvent
} from 'forta-agent';
import { utils } from "ethers";
import {
  PGL_CONTRACT,
  SWAP_ABI,
  createFinding
} from "./utils";



export const provideHandleTransaction = (pglContract: string): HandleTransaction =>
async (txEvent: TransactionEvent): Promise<Finding[]> => {
  const findings: Finding[] = [];

  const txns: utils.TransactionDescription[] = txEvent.filterFunction(SWAP_ABI, pglContract);

  txns.forEach(txn => {
    if(txn.args["data"].length > 0) {
      findings.push(createFinding(
        txn.args["amount0Out"].toString(),
        txn.args["amount1Out"].toString(),
        txn.args["to"]
      ));
    }
  });

  return findings;
}

export default {
  handleTransaction: provideHandleTransaction(PGL_CONTRACT)
}