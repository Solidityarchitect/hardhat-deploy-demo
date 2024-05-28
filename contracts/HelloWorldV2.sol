// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract HelloWorldV2 is OwnableUpgradeable {
    constructor() {
        _disableInitializers();
    }

    //  Initializes the contract
    function initialize(address _owner) external initializer {
        __Ownable_init(_owner);
    }

    string public text;

    function setText(string memory _newText) public {
        text = _newText;
    }
}
