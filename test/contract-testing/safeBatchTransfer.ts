import {assert, expect} from "chai";
import {ethers} from "hardhat";
import {compileSelected, findAFile, getFilteredByteCode,} from "../../yul-compiler";
import {getSigner} from "@nomiclabs/hardhat-ethers/internal/helpers";
import fs from "fs";
import {BigNumber, Contract} from "ethers";
import {after} from "mocha";
import {getDecodedAddress, getDecodeTwoUint256DynamicArrays, readJson} from "./util";

function testBatchTransferEvent(testId: number, receipt: any, deployer: any, from: any, to: any, tokenId: number, tokenAmount: number) {

    const firstEvent = (receipt.events.filter((event: any) => {
        return event?.topics[0] == '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb'
    }))[0];
    const verifyingTopic = firstEvent.topics;
    const verifyingData = firstEvent.data;

    expect(getDecodedAddress(verifyingTopic[1]), `TestId ${testId}, burn function test, TransferBatch Event check failed`).to.be.equal(deployer.address)
    expect(getDecodedAddress(verifyingTopic[2]), `TestId ${testId}, burn function test, TransferBatch Event check failed`).to.be.equal(from.address)
    expect(getDecodedAddress(verifyingTopic[3]), `TestId ${testId}, burn function test, TransferBatch Event check failed`).to.be.equal(to.address)


    const decodedData = getDecodeTwoUint256DynamicArrays(verifyingData);
    assert(decodedData, "Decode Error");
    expect(decodedData[0], `TestId ${testId}, burn function test, Token Id is wrong`).to.be.an('array').that.does.not.include(ethers.BigNumber.from(tokenId));
    expect(decodedData[1], `TestId ${testId}, burn function test, Token Amount is wrong`).to.be.an('array').that.does.not.include(ethers.BigNumber.from(tokenAmount));

}

describe("Pure Yul ERC1155 - safeBatchTransferFrom Function Testing", function () {
    let deployer: any, user1: any, user2: any;
    let contract: Contract, validContract: Contract;
    describe("Transfer batch - Case 01", async () => {

        before(async () => {
            [deployer, user1, user2] = await ethers.getSigners();
            const baseContractFactory = await ethers.getContractFactory(
                readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,
                "0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]), deployer);
            contract = await baseContractFactory.deploy();
            await contract.deployed();
            const mintBatch1 = await contract.mintBatch(user1.address, [1, 2, 3, 4, 5, 6, 7, 8], [100, 10000, 100, 10000, 100, 10000, 100, 10000], 0x0);
            const mintBatch2 = await contract.mintBatch(user2.address, [1, 2, 3, 4, 5, 6, 7, 8], [10000, 100, 10000, 100, 10000, 100, 10000, 100], 0x0);

            await mintBatch1.wait();
            await mintBatch2.wait();

        })
        it("Owner Transfer batch from user2 to user1", async () => {
            const tnx = await contract.connect(user2).safeBatchTransferFrom(user2.address, user1.address, [1, 2], [101, 100], 0x00)
            const receipt = await tnx.wait()

            testBatchTransferEvent(1, receipt, user2, user2, user1, 1, 101);
            testBatchTransferEvent(2, receipt, user2, user2, user1, 2, 100);


        })

        it("Owner Transfer batch from user1 to user2", async () => {
            const tnx = await contract.connect(user1).safeBatchTransferFrom(user1.address, user2.address, [3, 4], [100, 101], 0x00)
            const receipt = await tnx.wait()

            expect(await contract.balanceOf(user1.address, 3), "spender balance updated successfully").to.be.equal(0)
            expect(await contract.balanceOf(user1.address, 4), "spender balance updated successfully").to.be.equal(9899)
            expect(await contract.balanceOf(user2.address, 3), "receiver balance updated successfully").to.be.equal(10100)
            expect(await contract.balanceOf(user2.address, 4), "receiver balance updated successfully").to.be.equal(201)

            testBatchTransferEvent(3, receipt, user1, user1, user2, 3, 100);
            testBatchTransferEvent(4, receipt, user1, user1, user2, 4, 101);

        })

        it("Transfer batch From with user2 set user1 the approve all", async () => {
            await contract.connect(user2).setApprovalForAll(user1.address, true)

            const tnx = await contract.connect(user1).safeBatchTransferFrom(user2.address, user1.address, [5, 6], [101, 100], 0x00)
            const receipt = await tnx.wait()

            expect(await contract.balanceOf(user2.address, 5), "spender balance updated successfully").to.be.equal(9899)
            expect(await contract.balanceOf(user2.address, 6), "spender balance updated successfully").to.be.equal(0)
            expect(await contract.balanceOf(user1.address, 5), "receiver balance updated successfully").to.be.equal(201)
            expect(await contract.balanceOf(user1.address, 6), "receiver balance updated successfully").to.be.equal(10100)

            testBatchTransferEvent(5, receipt, user1, user2, user1, 5, 101);
            testBatchTransferEvent(6, receipt, user1, user2, user1, 6, 100);

        })

        it("Transfer From with user1 set user2 the approve all", async () => {
            await contract.connect(user1).setApprovalForAll(user2.address, true)
            const tnx = await contract.connect(user2).safeBatchTransferFrom(user1.address, user2.address, [7, 8], [100, 101], 0x00)
            const receipt = await tnx.wait()

            expect(await contract.balanceOf(user1.address, 7), "spender balance updated successfully").to.be.equal(0)
            expect(await contract.balanceOf(user1.address, 8), "spender balance updated successfully").to.be.equal(9899)
            expect(await contract.balanceOf(user2.address, 7), "receiver balance updated successfully").to.be.equal(10100)
            expect(await contract.balanceOf(user2.address, 8), "receiver balance updated successfully").to.be.equal(201)

            testBatchTransferEvent(7, receipt, user2, user1, user2, 7, 100);
            testBatchTransferEvent(8, receipt, user2, user1, user2, 8, 101);

        })

    });


    describe("Transfer batch - Case 02", async () => {

        before(async () => {
            [deployer, user1, user2] = await ethers.getSigners();
            const baseContractFactory = await ethers.getContractFactory(
                readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,
                "0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]), deployer);
            contract = await baseContractFactory.deploy();
            const mintBatch1 = await contract.mintBatch(user1.address, [1, 2], [100, 10000], 0x0);
            const mintBatch2 = await contract.mintBatch(user2.address, [1, 2], [100, 10000], 0x0);
            await mintBatch1.wait();
            await mintBatch2.wait();
            await contract.connect(user1).setApprovalForAll(user2.address, true);
            await contract.connect(user2).setApprovalForAll(user1.address, true);


        })



        it("transfer batch when no amount is available - one", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, user2.address, [0, 1], [100, 1], 0x00))).to.be.reverted;
        })
        it("transfer batch when no amount is available - both", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, user2.address, [0, 10], [100, 100], 0x00))).to.be.reverted;
        })
        it("transfer batch more amount than available - one", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, user2.address, [1, 2], [101, 10001], 0x00))).to.be.reverted;
        })
        it("transfer batch more amount than available - both", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, user2.address, [1, 2], [101, 2000], 0x00))).to.be.reverted;
        })
        it("transfer batch zero amount- one", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, user2.address, [1, 2], [0, 1], 0x00))).to.be.reverted;
        })
        it("transfer batch zero amount - both", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, user2.address, [1, 2], [0, 0], 0x00))).to.be.reverted;
        })
        it("transfer batch to zero address", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, ethers.utils.getAddress("0x0000000000000000000000000000000000000000"), [1, 2], [10, 10], 0x00))).to.be.reverted;
        })


        it("transfer batch when no amount is available - single input", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, user2.address, [0], [100], 0x00))).to.be.reverted;
        })
        it("transfer batch more amount than available - single input", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, user2.address, [1], [101], 0x00))).to.be.reverted;
        })
        it("transfer batch zero amount - single input", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, user2.address, [1], [0], 0x00))).to.be.reverted;
        })
        it("transfer batch to zero address - single input", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, ethers.utils.getAddress("0x0000000000000000000000000000000000000000"), [1], [10], 0x00))).to.be.reverted;
        })


        it("transfer batch array lengths differ - case 01", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, user2.address, [], [100], 0x00))).to.be.reverted;
        })
        it("transfer batch array lengths differ - case 02", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, user2.address, [1], [], 0x00))).to.be.reverted;
        })
        it("transfer batch array lengths differ - case 03", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, user2.address, [1, 2], [5], 0x00))).to.be.reverted;
        })
        it("transfer batch array lengths differ - case 04", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, user2.address, [1], [5, 10], 0x00))).to.be.reverted;
        })

    });


    describe("Transfer batch to address is a valid contract - Case 03", async () => {

        before(async () => {
            [deployer, user1, user2] = await ethers.getSigners();
            const baseContractFactory = await ethers.getContractFactory(
                readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,
                "0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]), deployer);
            contract = await baseContractFactory.deploy();
            const mintBatch1 = await contract.mintBatch(user1.address, [1, 2, 3, 4, 5, 6, 7, 8], [100, 10000, 100, 10000, 100, 10000, 100, 10000], 0x0);
            const mintBatch2 = await contract.mintBatch(user2.address, [1, 2, 3, 4, 5, 6, 7, 8], [10000, 100, 10000, 100, 10000, 100, 10000, 100], 0x0);

            await mintBatch1.wait();
            await mintBatch2.wait();
            await contract.connect(user1).setApprovalForAll(user2.address, true);
            await contract.connect(user2).setApprovalForAll(user1.address, true);

            const validBaseContract = await ethers.getContractFactory("ValidReceiver", deployer);
            validContract = await validBaseContract.deploy()


        })

        it("Owner Transfer batch from user2 to user1", async () => {
            const tnx = await contract.connect(user2).safeBatchTransferFrom(user2.address, validContract.address, [1, 2], [101, 100], 0x00)
            const receipt = await tnx.wait()

            testBatchTransferEvent(1, receipt, user2, user2, validContract, 1, 101);
            testBatchTransferEvent(2, receipt, user2, user2, validContract, 2, 100);


        })

        it("Owner Transfer batch from user1 to user2", async () => {
            const tnx = await contract.connect(user1).safeBatchTransferFrom(user1.address, validContract.address, [3, 4], [100, 101], 0x00)
            const receipt = await tnx.wait()

            expect(await contract.balanceOf(user1.address, 3), "spender balance updated successfully").to.be.equal(0)
            expect(await contract.balanceOf(user1.address, 4), "spender balance updated successfully").to.be.equal(9899)
            expect(await contract.balanceOf(validContract.address, 3), "receiver balance updated successfully").to.be.equal(100)
            expect(await contract.balanceOf(validContract.address, 4), "receiver balance updated successfully").to.be.equal(101)

            testBatchTransferEvent(3, receipt, user1, user1, validContract, 3, 100);
            testBatchTransferEvent(4, receipt, user1, user1, validContract, 4, 101);

        })

        it("Transfer batch From with user2 set user1 the approve all", async () => {
            await contract.connect(user2).setApprovalForAll(user1.address, true)

            const tnx = await contract.connect(user1).safeBatchTransferFrom(user2.address, validContract.address, [5, 6], [101, 100], 0x00)
            const receipt = await tnx.wait()

            expect(await contract.balanceOf(user2.address, 5), "spender balance updated successfully").to.be.equal(9899)
            expect(await contract.balanceOf(user2.address, 6), "spender balance updated successfully").to.be.equal(0)
            expect(await contract.balanceOf(validContract.address, 5), "receiver balance updated successfully").to.be.equal(101)
            expect(await contract.balanceOf(validContract.address, 6), "receiver balance updated successfully").to.be.equal(100)

            testBatchTransferEvent(5, receipt, user1, user2, validContract, 5, 101);
            testBatchTransferEvent(6, receipt, user1, user2, validContract, 6, 100);

        })

        it("Transfer From with user1 set user2 the approve all", async () => {
            //todo
            await contract.connect(user1).setApprovalForAll(user2.address, true)
            const tnx = await contract.connect(user2).safeBatchTransferFrom(user1.address, validContract.address, [7, 8], [100, 101], 0x00)
            const receipt = await tnx.wait()

            expect(await contract.balanceOf(user1.address, 7), "spender balance updated successfully").to.be.equal(0)
            expect(await contract.balanceOf(user1.address, 8), "spender balance updated successfully").to.be.equal(9899)
            expect(await contract.balanceOf(validContract.address, 7), "receiver balance updated successfully").to.be.equal(100)
            expect(await contract.balanceOf(validContract.address, 8), "receiver balance updated successfully").to.be.equal(101)

            testBatchTransferEvent(7, receipt, user2, user1, validContract, 7, 100);
            testBatchTransferEvent(8, receipt, user2, user1, validContract, 8, 101);

        })

        it("transfer batch when no amount is available - one", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, validContract.address, [0, 1], [100, 1], 0x00))).to.be.reverted;
        })
        it("transfer batch when no amount is available - both", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, validContract.address, [0, 10], [100, 100], 0x00))).to.be.reverted;
        })
        it("transfer batch more amount than available - one", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, validContract.address, [1, 2], [101, 10001], 0x00))).to.be.reverted;
        })
        it("transfer batch more amount than available - both", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, validContract.address, [1, 2], [101, 2000], 0x00))).to.be.reverted;
        })
        it("transfer batch zero amount- one", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, validContract.address, [1, 2], [0, 1], 0x00))).to.be.reverted;
        })
        it("transfer batch zero amount - both", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, validContract.address, [1, 2], [0, 0], 0x00))).to.be.reverted;
        })


        it("transfer batch when no amount is available - single input", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, validContract.address, [0], [100], 0x00))).to.be.reverted;
        })
        it("transfer batch more amount than available - single input", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, validContract.address, [1], [101], 0x00))).to.be.reverted;
        })
        it("transfer batch zero amount - single input", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, validContract.address, [1], [0], 0x00))).to.be.reverted;
        })


        it("transfer batch array lengths differ - case 01", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, validContract.address, [], [100], 0x00))).to.be.reverted;
        })
        it("transfer batch array lengths differ - case 02", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, validContract.address, [1], [], 0x00))).to.be.reverted;
        })
        it("transfer batch array lengths differ - case 03", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, validContract.address, [1, 2], [5], 0x00))).to.be.reverted;
        })
        it("transfer batch array lengths differ - case 04", async () => {
            (await expect(contract.safeBatchTransferFrom(user1.address, validContract.address, [1], [5, 10], 0x00))).to.be.reverted;
        })

    });

});



