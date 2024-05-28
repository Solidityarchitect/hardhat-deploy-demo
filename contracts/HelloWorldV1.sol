// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HelloWorldV1 {
    string public text;

    constructor() {}

    function setText(string memory _newText) public {
        text = _newText;
    }
}
