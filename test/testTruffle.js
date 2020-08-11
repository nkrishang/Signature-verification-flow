const { expect } = require("chai");
const Verification = artifacts.require("Verification");
const TEST_MESSAGE = web3.utils.sha3('OpenZeppelin');

contract("Verification", function([account1]) {

    let verify;

    before(async () => {
        verify = await Verification.new(TEST_MESSAGE);
    })

    // Test objective: To check that signature generated here in the script is stored, as is, in the contract.
    // it("Should verify that signature in the contract and the ethers script are identical", async function() {
    //
    //     const _hash = await verify.hash();
    //     const _signature = fixSignature(await web3.eth.sign(_hash, account1));
    //
    //     await verify.setSignature(_signature);
    //
    //     expect(await verify.signature()).to.equal(_signature);
    // });

    it("Should verify that the signer signed the hash the contract was deployed with.", async function() {

        const signature = fixSignature(await web3.eth.sign(TEST_MESSAGE, account1));
        console.log(TEST_MESSAGE);
        console.log(account1);
        console.log(signature);
        await verify.setSignature(signature);

        expect(await verify.recoverAddr(
          account1
        )).to.equal(true);
    })
})

function toEthSignedMessageHash (messageHex) {
  const messageBuffer = Buffer.from(messageHex.substring(2), 'hex');
  const prefix = Buffer.from(`\u0019Ethereum Signed Message:\n${messageBuffer.length}`);
  return web3.utils.sha3(Buffer.concat([prefix, messageBuffer]));
}

function fixSignature (signature) {
  // in geth its always 27/28, in ganache its 0/1. Change to 27/28 to prevent
  // signature malleability if version is 0/1
  // see https://github.com/ethereum/go-ethereum/blob/v1.8.23/internal/ethapi/api.go#L465
  let v = parseInt(signature.slice(130, 132), 16);
  if (v < 27) {
    v += 27;
  }
  const vHex = v.toString(16);
  return signature.slice(0, 130) + vHex;
}