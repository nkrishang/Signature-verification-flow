//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/cryptography/ECDSA.sol";
import "@nomiclabs/buidler/console.sol";

contract Verification {

    bytes32 public hash;
    bytes public signature;

    constructor(string memory toHash) public {
        bytes32 temp = keccak256(abi.encode(toHash));
        hash = ECDSA.toEthSignedMessageHash(temp);
    }

    function setSignature(bytes calldata _signature) external {
        signature = _signature;
    }

    function verify(address signer) external view returns(bool) {
        
        address recoveredAddr = ECDSA.recover(hash, signature);
        //console.log(recoveredAddr);
        return recoveredAddr == signer;
    }

}