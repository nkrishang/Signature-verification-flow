//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/cryptography/ECDSA.sol";
import "@nomiclabs/buidler/console.sol";

contract Verification {

    
    bytes32 public hash;
    bytes public signature;

    constructor(bytes32 tempHash) public {
        hash = ECDSA.toEthSignedMessageHash(tempHash);
    }

    function setSignature(bytes calldata _signature) external {
        signature = _signature;
    }
    
    function recoverAddr(address vendor) external view returns(bool) {
        
        address recoveredAddr = ECDSA.recover(hash, signature);
        //console.log(recoveredAddr);
        return recoveredAddr == vendor;
    }

}
