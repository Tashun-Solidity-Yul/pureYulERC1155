import {assert, expect} from "chai";
import {ethers} from "hardhat";
import {compileSelected, findAFile, getFilteredByteCode,} from "../../yul-compiler";
import {getSigner} from "@nomiclabs/hardhat-ethers/internal/helpers";
import fs from "fs";
import {BigNumber, Contract} from "ethers";
import {getDecodedAddress, getDecodeTwoUint256DynamicArrays, readJson} from "./util";

function testBatchTransferEvent(testId: number, receipt: any, deployer: any, user: any, tokenId: number, tokenAmount: number) {

    const firstEvent = (receipt.events.filter((event: any) => {
        return event?.topics[0] == '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb'
    }))[0];
    const verifyingTopic = firstEvent.topics;
    const verifyingData = firstEvent.data;

    expect(getDecodedAddress(verifyingTopic[1]), `TestId ${testId}, burn function test, TransferBatch Event check failed`).to.be.equal(deployer.address)
    expect(getDecodedAddress(verifyingTopic[2]), `TestId ${testId}, burn function test, TransferBatch Event check failed`).to.be.equal(ethers.utils.getAddress("0x0000000000000000000000000000000000000000"))
    expect(getDecodedAddress(verifyingTopic[3]), `TestId ${testId}, burn function test, TransferBatch Event check failed`).to.be.equal(user.address)


    const decodedData = getDecodeTwoUint256DynamicArrays(verifyingData);
    assert(decodedData, "Decode Error");
    expect(decodedData[0], `TestId ${testId}, burn function test, Token Id is wrong`).to.be.an('array').that.does.not.include(ethers.BigNumber.from(tokenId));
    expect(decodedData[1], `TestId ${testId}, burn function test, Token Amount is wrong`).to.be.an('array').that.does.not.include(ethers.BigNumber.from(tokenAmount));

}

describe("Pure Yul ERC1155 - mintBatch Function Testing", function () {
    let deployer: any, user1: any, user2: any;
    let contract: Contract;
    let validContract: Contract;
    describe("mintBatch Values - Case 01", async () => {

        before(async () => {
            [deployer, user1, user2] = await ethers.getSigners();
            const baseContractFactory = await ethers.getContractFactory(
                readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,
                "0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]), deployer);
            contract = await baseContractFactory.deploy();
            await contract.deployed();
        })
        /**


         **/
        it("mintBatch a single Token should mintBatched failed", async () => {
            const mintBatch = await contract.mintBatch(user1.address, [1], [1], 0x0);
            const receipt = await mintBatch.wait();

            expect(await contract.balanceOf(user1.address, 1), "mintBatch a single Token balance is wrong").to.be.equal(1);

            testBatchTransferEvent(1, receipt, deployer, user1, 1, 1);

        })

        it("mintBatch a multiple Tokens should batch mint failed", async () => {
            const mintBatch = await contract.mintBatch(user1.address, [2, 3], [1, 100], 0x0);
            const receipt = await mintBatch.wait();

            expect(await contract.balanceOf(user1.address, 2), "mintBatch a multiple Tokens balance is wrong").to.be.equal(1);
            expect(await contract.balanceOf(user1.address, 3), "mintBatch a multiple Tokens balance is wrong").to.be.equal(100);


            testBatchTransferEvent(2, receipt, deployer, user1, 2, 1);
            testBatchTransferEvent(3, receipt, deployer, user1, 3, 100);

        })


        it("mintBatch a multiple Tokens multiple transactions should batch mint failed", async () => {
            const mintBatch1 = await contract.mintBatch(user1.address, [4, 5], [1, 10000], 0x0);
            const mintBatch2 = await contract.mintBatch(user1.address, [4, 5], [2, 20500], 0x0);
            const mintBatch3 = await contract.mintBatch(user1.address, [4, 5], [5, 19500], 0x0);
            const mintBatch4 = await contract.mintBatch(user1.address, [4, 5], [212, 2222], 0x0);
            const receipt1 = await mintBatch1.wait();
            const receipt2 = await mintBatch2.wait();
            const receipt3 = await mintBatch3.wait();
            const receipt4 = await mintBatch4.wait();

            expect(await contract.balanceOf(user1.address, 4), "mintBatch a multiple Tokens multiple transactions balance is wrong").to.be.equal(220);
            expect(await contract.balanceOf(user1.address, 5), "mintBatch a multiple Tokens multiple transactions balance is wrong").to.be.equal(52222);

            testBatchTransferEvent(4, receipt1, deployer, user1, 4, 1);
            testBatchTransferEvent(5, receipt1, deployer, user1, 5, 10000);
            testBatchTransferEvent(6, receipt2, deployer, user1, 4, 2);
            testBatchTransferEvent(7, receipt2, deployer, user1, 5, 20500);
            testBatchTransferEvent(8, receipt3, deployer, user1, 4, 5);
            testBatchTransferEvent(9, receipt3, deployer, user1, 5, 19500);
            testBatchTransferEvent(10, receipt4, deployer, user1, 4, 212);
            testBatchTransferEvent(11, receipt4, deployer, user1, 5, 2222);
        })

    });


    describe("mintBatch Values - Case 02", async () => {

        before(async () => {
            [deployer, user1, user2] = await ethers.getSigners();
            const baseContractFactory = await ethers.getContractFactory(
                readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,
                "0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]), deployer);
            contract = await baseContractFactory.deploy();
            await contract.deployed();
        })


        it("Zero size arrays should revert", async () => {
            (await expect(contract.mintBatch(user1.address, [], [], 0x0))).to.be.reverted;
        })
        it("Zero size arrays should revert", async () => {
            (await expect(contract.mintBatch(user1.address, [], [1], 0x0))).to.be.reverted;
        })
        it("Zero size arrays should revert", async () => {
            (await expect(contract.mintBatch(user1.address, [1], [], 0x0))).to.be.reverted;
        })
        it("zero values should revert", async () => {
            (await expect(contract.mintBatch(user1.address, [1], [0], 0x0))).to.be.reverted;
        })
        it("different length arrays should revert", async () => {
            (await expect(contract.mintBatch(user1.address, [1, 2], [1], 0x0))).to.be.reverted;
        })
        it("different length arrays should revert", async () => {
            (await expect(contract.mintBatch(user1.address, [2], [1, 2], 0x0))).to.be.reverted;
        })


    });

    describe("mintBatch When receiving address is a contract - Case 03", async () => {

        before(async () => {
            [deployer, user1, user2] = await ethers.getSigners();
            const baseContractFactory = await ethers.getContractFactory(
                readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,
                "0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]), deployer);
            contract = await baseContractFactory.deploy();
            const validBaseContract = await ethers.getContractFactory("ValidReceiver", deployer);
            validContract = await validBaseContract.deploy()
            await contract.deployed();
        })


        it("mintBatch a single Token should mintBatched failed", async () => {
            const mintBatch = await contract.mintBatch(validContract.address, [1], [1], 0x0);
            const receipt = await mintBatch.wait();

            expect(await contract.balanceOf(validContract.address, 1), "mintBatch a single Token balance is wrong").to.be.equal(1);

            testBatchTransferEvent(1, receipt, deployer, validContract, 1, 1);

        })

        it("mintBatch a multiple Tokens should batch mint failed", async () => {
            const mintBatch = await contract.mintBatch(validContract.address, [2, 3], [1, 100], 0x0);
            const receipt = await mintBatch.wait();

            expect(await contract.balanceOf(validContract.address, 2), "mintBatch a multiple Tokens balance is wrong").to.be.equal(1);
            expect(await contract.balanceOf(validContract.address, 3), "mintBatch a multiple Tokens balance is wrong").to.be.equal(100);

            testBatchTransferEvent(2, receipt, deployer, validContract, 2, 1);
            testBatchTransferEvent(3, receipt, deployer, validContract, 3, 100);

        })


        it.only("mintBatch a multiple Tokens multiple transactions should batch mint failed", async () => {
            const mintBatch1 = await contract.mintBatch(validContract.address, [4, 5], [1, 10000], 0x0);
            const mintBatch2 = await contract.mintBatch(validContract.address, [4, 5], [2, 20500], 0x0);
            const mintBatch3 = await contract.mintBatch(validContract.address, [4, 5], [5, 19500], 0x0);
            const mintBatch4 = await contract.mintBatch(validContract.address, [4, 5], [212, 2222], 0x0);
            const receipt1 = await mintBatch1.wait();
            const receipt2 = await mintBatch2.wait();
            const receipt3 = await mintBatch3.wait();
            const receipt4 = await mintBatch4.wait();

            console.log(receipt3.events[1].topics)
            console.log(receipt3.events[1].data)

            expect(await contract.balanceOf(validContract.address, 4), "mintBatch a multiple Tokens multiple transactions balance is wrong").to.be.equal(220);
            expect(await contract.balanceOf(validContract.address, 5), "mintBatch a multiple Tokens multiple transactions balance is wrong").to.be.equal(52222);

            testBatchTransferEvent(4, receipt1, deployer, validContract, 4, 1);
            testBatchTransferEvent(5, receipt1, deployer, validContract, 5, 10000);
            testBatchTransferEvent(6, receipt2, deployer, validContract, 4, 2);
            testBatchTransferEvent(7, receipt2, deployer, validContract, 5, 20500);
            testBatchTransferEvent(8, receipt3, deployer, validContract, 4, 5);
            testBatchTransferEvent(9, receipt3, deployer, validContract, 5, 19500);
            testBatchTransferEvent(10, receipt4, deployer, validContract, 4, 212);
            testBatchTransferEvent(11, receipt4, deployer, validContract, 5, 2222);
        })




        it("Zero size arrays should revert", async () => {
            (await expect(contract.mintBatch(validContract.address, [], [], 0x0))).to.be.reverted;
        })
        it("Zero size arrays should revert", async () => {
            (await expect(contract.mintBatch(validContract.address, [], [1], 0x0))).to.be.reverted;
        })
        it("Zero size arrays should revert", async () => {
            (await expect(contract.mintBatch(validContract.address, [1], [], 0x0))).to.be.reverted;
        })
        it("zero values should revert", async () => {
            (await expect(contract.mintBatch(validContract.address, [1], [0], 0x0))).to.be.reverted;
        })
        it("different length arrays should revert", async () => {
            (await expect(contract.mintBatch(validContract.address, [1, 2], [1], 0x0))).to.be.reverted;
        })
        it("different length arrays should revert", async () => {
            (await expect(contract.mintBatch(validContract.address, [2], [1, 2], 0x0))).to.be.reverted;
        })


    });

});



