import { Finding, HandleTransaction, TransactionEvent, LogDescription, getEthersProvider } from "forta-agent";
import {
  QI_TOKEN_CONTRACT,
  EVENT_ABI,
  createTransferFinding,
  createLargeBalanceFinding,
  TRANSFERRED_TOKEN_THRESHOLD,
  BALANCE_THRESHOLD,
} from "./utils";
import { BigNumber } from "ethers";
import DataFetcher from "./data.fetcher";

const FETCHER: DataFetcher = new DataFetcher(QI_TOKEN_CONTRACT, getEthersProvider());

export const provideHandleTransaction =
  (fetcher: DataFetcher): HandleTransaction =>
  async (txEvent: TransactionEvent): Promise<Finding[]> => {
    const findings: Finding[] = [];
    const logs: LogDescription[] = txEvent.filterLog(EVENT_ABI, fetcher.qiTokenAddress);

    for (const log of logs) {
      // get transferred token amount
      const tokenAmount = BigNumber.from(log.args.amount);

      // fetch balance of the destination address
      const toAddress = log.args.to;
      const balance = await fetcher.getBalance(toAddress);

      if (tokenAmount.gt(TRANSFERRED_TOKEN_THRESHOLD)) {
        findings.push(createTransferFinding(log));
      }

      if (balance.gt(BALANCE_THRESHOLD)) {
        findings.push(createLargeBalanceFinding(toAddress, balance));
      }
    }

    return findings;
  };

export default {
  handleTransaction: provideHandleTransaction(FETCHER),
};
