import {expect} from "chai";
import {ethers} from "hardhat";
import {compileSelected, findAFile, getFilteredByteCode,} from "../../yul-compiler";
import {getSigner} from "@nomiclabs/hardhat-ethers/internal/helpers";
import fs from "fs";
import {BigNumber, Contract} from "ethers";

export function readJson(path: string) {
    // console.log(path)
    const fileRead = fs.readFileSync('.\\' + path, 'utf8');
    try {
        return (JSON.parse(fileRead))
    } catch (err) {
        console.error(err)
    }
}

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
        })
        /**


         **/
        it("mintBatch a single Token should mintBatched successfully", async () => {
            const mintBatch = await contract.mintBatch(user1.address, [1], [1], 0x0);
            await mintBatch.wait();
        })
        after(async () => {
            expect(await contract.balanceOf(user1.address, 1), "mintBatch a single Token balance is wrong").to.be.equal(1);
        })

        it("mintBatch a multiple Tokens should batch mint successfully", async () => {
            const mintBatch = await contract.mintBatch(user1.address, [2,3], [1,100], 0x0);
            await mintBatch.wait();
        })
        after(async () => {
            expect(await contract.balanceOf(user1.address, 2), "mintBatch a multiple Tokens balance is wrong").to.be.equal(1);
            expect(await contract.balanceOf(user1.address, 3), "mintBatch a multiple Tokens balance is wrong").to.be.equal(100);
        })

        it("mintBatch a multiple Tokens multiple transactions should batch mint successfully", async () => {
            const mintBatch1 = await contract.mintBatch(user1.address, [4,5], [1,10000], 0x0);
            const mintBatch2 = await contract.mintBatch(user1.address, [4,5], [2,20500], 0x0);
            const mintBatch3 = await contract.mintBatch(user1.address, [4,5], [5,19500], 0x0);
            const mintBatch4 = await contract.mintBatch(user1.address, [4,5], [212,2222], 0x0);
            await mintBatch1.wait();
            await mintBatch2.wait();
            await mintBatch3.wait();
            await mintBatch4.wait();
        })
        after(async () => {
            expect(await contract.balanceOf(user1.address, 4), "mintBatch a multiple Tokens multiple transactions balance is wrong").to.be.equal(220);
            expect(await contract.balanceOf(user1.address, 5), "mintBatch a multiple Tokens multiple transactions balance is wrong").to.be.equal(52222);
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
            (await expect( contract.mintBatch(user1.address, [], [], 0x0))).to.be.reverted;
        })
        it("Zero size arrays should revert", async () => {
            (await expect( contract.mintBatch(user1.address, [], [1], 0x0))).to.be.reverted;
        })
        it("Zero size arrays should revert", async () => {
            (await expect( contract.mintBatch(user1.address, [1], [], 0x0))).to.be.reverted;
        })
        it("zero values should revert", async () => {
            (await expect( contract.mintBatch(user1.address, [1], [0], 0x0))).to.be.reverted;
        })
        it("different length arrays should revert", async () => {
            (await expect( contract.mintBatch(user1.address, [1,2], [1], 0x0))).to.be.reverted;
        })
        it("different length arrays should revert", async () => {
            (await expect( contract.mintBatch(user1.address, [2], [1,2], 0x0))).to.be.reverted;
        })






    });

});



