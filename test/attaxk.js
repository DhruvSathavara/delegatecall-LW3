const { expect }  = require('chai');
const { ethers } = require('hardhat');

describe("delegatecall attack", function () {
    it("Should change owner of Good contract", async function () {
        // deploy Helper contract
        const Helper = await ethers.getContractFactory("Hepler");
        const helperContract = await Helper.deploy();
        await helperContract.deployed();
        console.log("helper contract address :",helperContract.address)
        
        // deploy Good contract
        const Good = await ethers.getContractFactory("Good");
        const goodContract = await Good.deploy(helperContract.address);
        await goodContract.deployed();
        console.log("good contract address :",goodContract.address)

        // deploy Attack contract
        const Attack = await ethers.getContractFactory("Attack");
        const attackContract = await Attack.deploy(goodContract.address);
        await attackContract.deployed();
        console.log("attack contract address :",attackContract.address)

        // start the attack
        let tx = await attackContract.attack();
        await tx.wait();

        expect(await goodContract.owner()).to.equal(attackContract.address);
    });
});