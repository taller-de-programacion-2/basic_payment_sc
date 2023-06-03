function schema() {
  return {
    params: {
      type: "object",
      properties: {
        senderKey: {
          type: "string",
        },
        receiverKey: {
          type: "string",
        },
        amountInEthers: {
          type: "string",
        },
      },
    },
    required: ["senderKey", "receiverKey", "amountInEthers"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req) {
    let deployerWallet = await walletService.getDeployerWallet();
    let tx1 = await contractInteraction.deposit(walletService.getWallet(req.body.senderKey), req.body.amountInEthers);
    let tx2 = await contractInteraction.payout(walletService.getWallet(req.body.receiverKey),req.body.amountInEthers, deployerWallet)
    let jsons = [];
    jsons.push(tx1);
    jsons.push(tx2);
    return jsons
  };
}

module.exports = { schema, handler };
