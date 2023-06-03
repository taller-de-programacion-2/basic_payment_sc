const ethers = require("ethers");
const getDepositHandler = require("../handlers/getDepositHandler");
const {getDeployerWallet} = require("./wallets");
const {walletService} = require("./services");

const getContract = (config, wallet) => {
  return new ethers.Contract(config.contractAddress, config.contractAbi, wallet);
};

const deposits = {};

const deposit =
  ({ config }) =>
  async (senderWallet, amountToSend) => {
    const basicPayments = await getContract(config, senderWallet);
    const tx = await basicPayments.deposit({
      value: await ethers.utils.parseEther(amountToSend).toHexString(),
    });
    tx.wait(1).then(
      receipt => {
        console.log("Transaction mined");
        const firstEvent = receipt && receipt.events && receipt.events[0];
        console.log(firstEvent);
        if (firstEvent && firstEvent.event == "DepositMade") {
          deposits[tx.hash] = {
            senderAddress: firstEvent.args.sender,
            amountSent: firstEvent.args.amount,
          };
        } else {
          console.error(`Payment not created in tx ${tx.hash}`);
        }
      },
      error => {
        const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
        const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
        console.error("reasons List");
        console.error(reasonsList);

        console.error("message");
        console.error(message);
      },
    );
    return tx;
  };

const payout = ({ config }) => async (receiverWallet, amountToSend, deployerWallet) => {
  const basicPayments = getContract(config, deployerWallet);
  let amount = ethers.utils.parseEther(amountToSend).toHexString();
  const tx = await basicPayments.sendPayment(receiverWallet.address, amount);
  tx.wait(1).then(receipt => {
    console.log("Transaction mined", receiverWallet.address, "\n");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    if (firstEvent && firstEvent.event == "PaymentMade") {
      console.log(`Successful deposit`);
    } else {
      console.error(`Payment not created in tx ${tx.hash}`);
    }
  });
  return tx;
};

const getDepositReceipt =
  ({}) =>
  async depositTxHash => {
    return deposits[depositTxHash];
  };

module.exports = dependencies => ({
  deposit: deposit(dependencies),
  getDepositReceipt: getDepositReceipt(dependencies),
  payout: payout(dependencies)
});
