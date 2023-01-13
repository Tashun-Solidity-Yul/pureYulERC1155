import {expect} from "chai";
import {ethers} from "hardhat";
import {findAFile, getFilteredByteCode,} from "../../yul-compiler";
import fs from "fs";
import { Contract} from "ethers";
import {readJson} from "./util";



describe("Pure Yul ERC1155 - mintBatch Function Testing", function () {
    let deployer, user1: any, user2: any;
    let contract: Contract;
    describe("mintBatch Values - Case 01", async () => {

        before(async () => {
            [deployer, user1, user2] = await ethers.getSigners();
            const baseContractFactory = await ethers.getContractFactory(
                readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,
                "0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]), deployer);
            contract = await baseContractFactory.deploy();
            await contract.deployed();
            const mintBatch = await contract.mintBatch(user1.address, [1, 2, 3, 4, 5, 6], [1_000_000, 2_000_000, 3_000_000, 4_000_000, 5_000_000, 6_000_000], 0x0);
            const mintBatch2 = await contract.mintBatch(user2.address, [1, 2, 3, 4, 5, 6], [11_000_000, 10_000_000, 9_000_000, 22_000_000, 8_000_000, 7_000_000], 0x0);
            await mintBatch.wait();
            await mintBatch2.wait();
        })
        /**


         **/
        it("Batch read for a single token should be successful", async () => {
            expect((await contract.balanceOfBatch([user1.address], [1]))[0], "burn batch single token balance is wrong").to.be.equal(1_000_000);
        })
        it("batch read multiple tokens", async () => {
            expect((await contract.balanceOfBatch([user1.address], [1]))[0], "batch read multiple tokens balance is wrong").to.be.equal(1_000_000);
            expect((await contract.balanceOfBatch([user1.address,user1.address], [1,2]))[1], "batch read multiple tokens balance is wrong").to.be.equal(2_000_000);
            expect((await contract.balanceOfBatch([user1.address,user1.address,user1.address], [1,2,3]))[2], "batch read multiple tokens balance is wrong").to.be.equal(3_000_000);
            expect((await contract.balanceOfBatch([user1.address,user1.address,user1.address,user1.address], [1,2,3,4]))[3], "batch read multiple tokens balance is wrong").to.be.equal(4_000_000);
            expect((await contract.balanceOfBatch([user1.address,user1.address,user1.address,user1.address,user1.address], [1,2,3,4,5]))[4], "batch read multiple tokens balance is wrong").to.be.equal(5_000_000);
        })

        it("batch read multiple tokens same address", async () => {
            expect((await contract.balanceOfBatch([user2.address], [1]))[0], "batch read multiple tokens same address balance is wrong").to.be.equal(11_000_000);
            expect((await contract.balanceOfBatch([user2.address,user2.address], [1,2]))[1], "batch read multiple tokens same address balance is wrong").to.be.equal(10_000_000);
            expect((await contract.balanceOfBatch([user2.address,user2.address,user2.address], [1,2,3]))[2], "batch read multiple tokens same address balance is wrong").to.be.equal(9_000_000);
            expect((await contract.balanceOfBatch([user2.address,user2.address,user2.address,user2.address], [1,2,3,4]))[3], "batch read multiple tokens same address balance is wrong").to.be.equal(22_000_000);
            expect((await contract.balanceOfBatch([user2.address,user2.address,user2.address,user2.address,user2.address], [1,2,3,4,5]))[4], "batch read multiple tokens same address balance is wrong").to.be.equal(8_000_000);
        })

        it("batch read multiple tokens different address", async () => {
            expect((await contract.balanceOfBatch([user2.address], [1]))[0], "batch read multiple tokens different address balance is wrong").to.be.equal(11_000_000);
            expect((await contract.balanceOfBatch([user2.address,user1.address], [1,2]))[1], "batch read multiple tokens different address balance is wrong").to.be.equal(2_000_000);
            expect((await contract.balanceOfBatch([user1.address,user2.address,user2.address], [1,2,3]))[2], "batch read multiple tokens different address balance is wrong").to.be.equal(9_000_000);
            expect((await contract.balanceOfBatch([user2.address,user2.address,user2.address,user2.address], [1,2,3,4]))[3], "batch read multiple tokens different address balance is wrong").to.be.equal(22_000_000);
            expect((await contract.balanceOfBatch([user2.address,user2.address,user2.address,user2.address,user2.address], [1,2,3,4,5]))[4], "batch read multiple tokens different address balance is wrong").to.be.equal(8_000_000);
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
            const mintBatch = await contract.mintBatch(user1.address, [1, 2, 3, 4, 5, 6], [1_000_000, 1_000_000, 1_000_000, 1_000_000, 1_000_000, 1_000_000], 0x0);
            await mintBatch.wait();
        })

        it("array length different in length", async () => {
            (await expect(contract.balanceOfBatch([user2.address], [1,2]))).to.be.reverted;
            (await expect(contract.balanceOfBatch([user2.address], [1,2,3]))).to.be.reverted;
            (await expect(contract.balanceOfBatch([user2.address], []))).to.be.reverted;
            (await expect(contract.balanceOfBatch([], [1,2]))).to.be.reverted;
            (await expect(contract.balanceOfBatch([user2.address,user1.address,user2.address], [1,2]))).to.be.reverted;
        })

    });

});



