const { expect } = require("chai");
const { ethers } = require("@nomiclabs/buidler");
const hashMessage = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("OpenZeppelin"));

describe("Verification", function() {

    let verify;
    let signer;

    before(async () => {
        const Verification = await ethers.getContractFactory("Verification");
        verify = await Verification.deploy(hashMessage);
        await verify.deployed();

        const addresses = await ethers.getSigners();
        signer = addresses[0];
    })

    it("Should verify that the signer signed the hash the contract was deployed with.", async function() {

        const _signature = fixSignature(await signer.signMessage(hashMessage));
        

        await verify.setSignature(_signature);
        
        signerAddr = await signer.getAddress();
        console.log(hashMessage);
        console.log(signerAddr);
        console.log(_signature);
        //console.log(`Signer address: ${signerAddr}`);

        expect(await verify.recoverAddr(signerAddr)).to.equal(true);
    })
})

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
