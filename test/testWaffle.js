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

        const _signature = await signer.signMessage(hashMessage);
        

        await verify.setSignature(_signature);
        
        signerAddr = await signer.getAddress();
        console.log(hashMessage);
        console.log(signerAddr);
        console.log(_signature);
        //console.log(`Signer address: ${signerAddr}`);

        expect(await verify.recoverAddr(signerAddr)).to.equal(true);
    })
})