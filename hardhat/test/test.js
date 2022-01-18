const { expect } = require('chai');
const addresses = require('../../kryptosigned_addresses.json');

const { parseEther, formatEther } = ethers.utils;

describe('RollGreenList', function () {
	let ContractFactory, owner, bob, contract, contract2;
	const oneEther = ethers.BigNumber.from('1000000000000000000');

	beforeEach(async function () {
		ContractFactory = await ethers.getContractFactory('RollGreenList');
		[owner, bob] = await ethers.getSigners();
		contract = await ContractFactory.deploy(2900);
		contract2 = contract.connect(bob);

		await contract.initialize(addresses.slice(0, 100));
	});

	it('should roll a new address', async function () {
		expect((await contract.spotNum()).toNumber()).to.equal(2900);

		const address = await contract.signedAddresses(0);

		expect(address).to.equal(addresses[0]);

		const winned = address;

		// expect(await contract.rollGreenList()).to.emit(contract, "RollWinned").withArgs(addresses[1])

		await contract.batchRoll(100);

		expect((await contract.totalRuns()).toNumber()).to.equal(100);

		console.log('counts', (await contract.count()).toNumber())
	});
});
