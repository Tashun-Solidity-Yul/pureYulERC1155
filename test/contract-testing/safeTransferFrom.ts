import {assert, expect} from "chai";
import {ethers} from "hardhat";
import {compileSelected, findAFile, getFilteredByteCode,} from "../../yul-compiler";
import {getSigner} from "@nomiclabs/hardhat-ethers/internal/helpers";
import fs from "fs";
import {BigNumber, Contract} from "ethers";
import {after} from "mocha";
import {getDecodedAddress, getDecodedTwoValues, readJson} from "./util";

function testTransferSingleEmitResults(testId: number, receipt1: any, deployer: any, from: any, to: any, tokenId: number, tokenAmount: number) {
    const firstEvent1 = (receipt1.events.filter((event: any) => {
        return event?.topics[0] == '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62'
    }))[0];
    const verifyingTopic1 = firstEvent1.topics;
    const verifyingData1 = firstEvent1.data;

    expect(getDecodedAddress(verifyingTopic1[1]), `TestId ${testId}, safe transfer function test, TransferSingle Event check failed`).to.be.equal(deployer.address)
    expect(getDecodedAddress(verifyingTopic1[2]), `TestId ${testId}, safe transfer function test, TransferSingle Event check failed`).to.be.equal(from.address)
    expect(getDecodedAddress(verifyingTopic1[3]), `TestId ${testId}, safe transfer function test, TransferSingle Event check failed`).to.be.equal(to.address)


    const decodedData1 = getDecodedTwoValues(verifyingData1);
    assert(decodedData1)
    expect(decodedData1[0], `TestId ${testId}, safe transfer function test, Token Amount is wrong`).to.be.equal(tokenId);
    expect(decodedData1[1], `TestId ${testId}, safe transfer function test, Token Amount is wrong`).to.be.equal(tokenAmount);
}

describe("Pure Yul ERC1155 - safeTransferFrom Function Testing", function () {
    let deployer: any, user1: any, user2: any;
    let contract: Contract, validContract: Contract;
    describe("Transfer from - Case 01", async () => {

        before(async () => {
            [deployer, user1, user2] = await ethers.getSigners();
            const baseContractFactory = await ethers.getContractFactory(
                readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,
                "0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]), deployer);
            contract = await baseContractFactory.deploy();
            await contract.deployed();
            const mintBatch1 = await contract.mintBatch(user1.address, [1, 2, 3, 4], [100, 10000, 100, 10000], 0x0);
            const mintBatch2 = await contract.mintBatch(user2.address, [1, 2, 3, 4], [10000, 100, 10000, 100], 0x0);
            await mintBatch1.wait();
            await mintBatch2.wait();

        })
        it("Owner Transfer from user2 to user1", async () => {
            const tnx1 = await contract.connect(user2).safeTransferFrom(user2.address, user1.address, 3, 100, 0x00)
            const receipt = await tnx1.wait()

            expect(await contract.balanceOf(user2.address, 3), "spender balance updated failed").to.be.equal(9900)
            expect(await contract.balanceOf(user1.address, 3), "receiver balance updated failed").to.be.equal(200)

            testTransferSingleEmitResults(1, receipt, user2, user2, user1, 3, 100)
        })

        it("Owner Transfer from user1 to user2", async () => {
            const tnx1 = await contract.connect(user1).safeTransferFrom(user1.address, user2.address, 4, 100, 0x00)
            const receipt = await tnx1.wait()

            expect(await contract.balanceOf(user1.address, 4), "spender balance updated failed").to.be.equal(9900)
            expect(await contract.balanceOf(user2.address, 4), "receiver balance updated failed").to.be.equal(200)

            testTransferSingleEmitResults(2, receipt, user1, user1, user2, 4, 100)


        })
        it("Transfer From with user2 set user1 the approve all", async () => {
            const tnx1 = await contract.connect(user2).setApprovalForAll(user1.address, true)
            await tnx1.wait()
            const tnx2 = await contract.connect(user1).safeTransferFrom(user2.address, user1.address, 1, 100, 0x00)
            const receipt = await tnx2.wait()

            expect(await contract.balanceOf(user2.address, 1), "spender balance updated failed").to.be.equal(9900)
            expect(await contract.balanceOf(user1.address, 1), "receiver balance updated failed").to.be.equal(200)

            testTransferSingleEmitResults(3, receipt, user1, user2, user1, 1, 100)

        })

        it("Transfer From with user1 set user2 the approve all", async () => {
            const tnx1 = await contract.connect(user1).setApprovalForAll(user2.address, true)
            await tnx1.wait()
            const tnx2 = await contract.connect(user2).safeTransferFrom(user1.address, user2.address, 2, 100, 0x00)
            const receipt = await tnx2.wait()
            expect(await contract.balanceOf(user1.address, 2), "spender balance updated failed").to.be.equal(9900)
            expect(await contract.balanceOf(user2.address, 2), "receiver balance updated failed").to.be.equal(200)

            testTransferSingleEmitResults(4, receipt, user2, user1, user2, 2, 100)

        })

    });


    describe("Transfer from - Case 02", async () => {

        before(async () => {
            [deployer, user1, user2] = await ethers.getSigners();
            const baseContractFactory = await ethers.getContractFactory(
                readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,
                "0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]), deployer);
            contract = await baseContractFactory.deploy();
            const mintBatch1 = await contract.mintBatch(user1.address, [1, 2], [100, 10000], 0x0);
            await mintBatch1.wait();
            await contract.connect(user1).setApprovalForAll(user2.address, true);
            await contract.connect(user2).setApprovalForAll(user1.address, true);
        })


        it("transfer when no amount is available", async () => {
            (await expect(contract.safeTransferFrom(user1.address, user2.address, 0, 100, 0x00))).to.be.reverted;
        })
        it("transfer more amount than available", async () => {
            (await expect(contract.safeTransferFrom(user1.address, user2.address, 1, 101, 0x00))).to.be.reverted;
        })
        it("transfer zero amount", async () => {
            (await expect(contract.safeTransferFrom(user1.address, user2.address, 1, 0, 0x00))).to.be.reverted;
        })
        it("transfer to zero address", async () => {
            (await expect(contract.safeTransferFrom(user1.address, ethers.utils.getAddress("0x0000000000000000000000000000000000000000"), 1, 10, 0x00))).to.be.reverted;
        })
    });


    describe("Transfer from when to address is a contract - Case 03", async () => {

        before(async () => {
            [deployer, user1, user2] = await ethers.getSigners();
            const baseContractFactory = await ethers.getContractFactory(
                readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,
                "0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]), deployer);
            contract = await baseContractFactory.deploy();
            const mintBatch1 = await contract.mintBatch(user1.address, [1, 2, 3, 4], [100, 10000, 100, 10000], 0x0);
            const mintBatch2 = await contract.mintBatch(user2.address, [1, 2, 3, 4], [10000, 100, 10000, 100], 0x0);
            await mintBatch1.wait();
            await mintBatch2.wait();
            await contract.connect(user1).setApprovalForAll(user2.address, true);
            await contract.connect(user2).setApprovalForAll(user1.address, true);
            const validBaseContract = await ethers.getContractFactory("ValidReceiver", deployer);
            validContract = await validBaseContract.deploy()
        })

        it("Owner Transfer from user2 to user1", async () => {
            const tnx1 = await contract.connect(user2).safeTransferFrom(user2.address, validContract.address, 3, 100, 0x00)
            const receipt = await tnx1.wait()


            expect(await contract.balanceOf(user2.address, 3), "spender balance updated failed").to.be.equal(9900)
            expect(await contract.balanceOf(validContract.address, 3), "receiver balance updated failed").to.be.equal(100)

            testTransferSingleEmitResults(1, receipt, user2, user2, validContract, 3, 100)
        })

        it("Owner Transfer from user1 to user2", async () => {
            const tnx1 = await contract.connect(user1).safeTransferFrom(user1.address, validContract.address, 4, 100, 0x00)
            const receipt = await tnx1.wait()

            expect(await contract.balanceOf(user1.address, 4), "spender balance updated failed").to.be.equal(9900)
            expect(await contract.balanceOf(validContract.address, 4), "receiver balance updated failed").to.be.equal(100)

            testTransferSingleEmitResults(2, receipt, user1, user1, validContract, 4, 100)


        })
        it("Transfer From with user2 set user1 the approve all", async () => {
            const tnx1 = await contract.connect(user2).setApprovalForAll(user1.address, true)
            await tnx1.wait()
            const tnx2 = await contract.connect(user1).safeTransferFrom(user2.address, validContract.address, 1, 100, 0x00)
            const receipt = await tnx2.wait()

            expect(await contract.balanceOf(user2.address, 1), "spender balance updated failed").to.be.equal(9900)
            expect(await contract.balanceOf(validContract.address, 1), "receiver balance updated failed").to.be.equal(100)

            testTransferSingleEmitResults(3, receipt, user1, user2, validContract, 1, 100)

        })

        it("Transfer From with user1 set user2 the approve all", async () => {
            const tnx1 = await contract.connect(user1).setApprovalForAll(user2.address, true)
            await tnx1.wait()
            const tnx2 = await contract.connect(user2).safeTransferFrom(user1.address, validContract.address, 2, 100, 0x00)
            const receipt = await tnx2.wait()
            expect(await contract.balanceOf(user1.address, 2), "spender balance updated failed").to.be.equal(9900)
            expect(await contract.balanceOf(validContract.address, 2), "receiver balance updated failed").to.be.equal(100)

            testTransferSingleEmitResults(4, receipt, user2, user1, validContract, 2, 100)

        })


        it("transfer when no amount is available", async () => {
            (await expect(contract.safeTransferFrom(user1.address, user2.address, 0, 100, 0x00))).to.be.reverted;
        })
        it("transfer more amount than available", async () => {
            (await expect(contract.safeTransferFrom(user1.address, user2.address, 1, 101, 0x00))).to.be.reverted;
        })
        it("transfer zero amount", async () => {
            (await expect(contract.safeTransferFrom(user1.address, user2.address, 1, 0, 0x00))).to.be.reverted;
        })
        it("transfer to zero address", async () => {
            (await expect(contract.safeTransferFrom(user1.address, ethers.utils.getAddress("0x0000000000000000000000000000000000000000"), 1, 10, 0x00))).to.be.reverted;
        })
    });

});



