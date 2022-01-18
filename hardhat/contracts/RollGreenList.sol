// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

contract RollGreenList {

    mapping(address => bool) public rollBook;
    address[] public signedAddresses;
    uint public count;
    uint public totalRuns;
    uint public spotNum;

    event RollWinned(address indexed user);

    constructor (uint _spotNum, address[] memory _lists) {
        signedAddresses = _lists;
        spotNum = _spotNum;
    }

    function rollGreenList() external returns (address) {
        require(count < spotNum, "All spots has been filled");

        totalRuns += 1;

        uint index = random() % signedAddresses.length;
        address selectedAddress = signedAddresses[index];

        if (rollBook[selectedAddress] == false) {
            rollBook[selectedAddress] = true;
            count ++;
            emit RollWinned(selectedAddress);

            return selectedAddress;
        }

        return address(0);
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, totalRuns)));
    }
}
