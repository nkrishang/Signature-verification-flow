const { expect } = require("chai");
const { ethers } = require("@nomiclabs/buidler");

describe("Verification", function() {

    let verify;
    let signer;

    before(async () => {
        const Verification = await ethers.getContractFactory("Verification");
        verify = await Verification.deploy("Hash this message");
        await verify.deployed();

        const addresses = await ethers.getSigners();
        signer = addresses[1];
    })

    // Test objective: To check that signature generated here in the script is stored, as is, in the contract.
    it("Should verify that signature in the contract and the ethers script are identical", async function() {

        const _hash = await verify.hash();
        const _signature = await signer.signMessage(_hash);

        await verify.setSignature(_signature);

        expect(await verify.signature()).to.equal(_signature);
    });

    it("Should verify that the signer signed the hash the contract was deployed with.", async function() {

        const _hash = await verify.hash();
        const _signature = await signer.signMessage(_hash);

        await verify.setSignature(_signature);
        
        signerAddr = await signer.getAddress();
        //console.log(`Signer address: ${signerAddr}`);

        expect(await verify.verify(signerAddr)).to.equal(true);
    })
})
