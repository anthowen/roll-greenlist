// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

contract RollGreenList {

    uint public count;
    uint public totalRuns;
    uint public spotNum;
    address public owner;
    bool public initialized;

    mapping(address => bool) public rollBook;
    address[] public signedAddresses;

    uint public constant MAX_BATCH_LIMIT = 200;

    event RollWinned(address indexed user);


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor () {
        owner = msg.sender;
    }

    function initialize(uint _spotNum, address[] calldata _lists) external onlyOwner {
        require(initialized == false, "Can be initialized only once");

        spotNum = _spotNum;
        signedAddresses = _lists;

        initialized = true;
    }

    function rollGreenList() public returns (address) {
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

    function batchRoll(uint _count) external {
        require(_count < MAX_BATCH_LIMIT, "Count exceeds MAX_BATCH_LIMIT");

        for (uint i = 0; i < _count; i ++)
            rollGreenList();
    }

    function updateSpotNum(uint _newNum) external onlyOwner {
        require(_newNum < signedAddresses.length, "Cannot exceed the max amount");

        spotNum = _newNum;
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, totalRuns)));
    }
}
