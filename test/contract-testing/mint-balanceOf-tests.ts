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

describe("Pure Yul ERC1155 - Mint Function Testing", function () {
    let deployer, user1: any, user2: any;
    let contract: Contract;
    describe("Mint Values - Case 01", async () => {

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
        it("Mint a single Token should minted successfully", async () => {
            const mint = await contract.mint(user1.address, 1, 1, 0x0);
            await mint.wait();
        })
        after(async () => {
            expect(await contract.balanceOf(user1.address, 1), "Balance is wrong").to.be.equal(1);
        })


        it("Mint Multiple Tokens should minted successfully", async () => {
            const mint = await contract.mint(user1.address, 2, 2467, 0x0);
            await mint.wait();
        })
        after(async () => {
            expect(await contract.balanceOf(user1.address, 2), "Mint Multiple Tokens Balance is wrong").to.be.equal(2467);
        })

        it("Mint Multiple users should minted successfully", async () => {
            const mint1 = await contract.mint(user1.address, 3, 2000, 0x0);
            const mint2 = await contract.mint(user2.address, 3, 1000, 0x0);
            await mint1.wait();
            await mint2.wait();
        })
        after(async () => {
            expect(await contract.balanceOf(user1.address, 3), "Mint Multiple users Balance is wrong").to.be.equal(2000);
            expect(await contract.balanceOf(user2.address, 3), "Mint Multiple users Balance is wrong").to.be.equal(1000);
        })

        it("Mint Multiple using multiple transaction should be successfully", async () => {
            const mint1 = await contract.mint(user1.address, 4, 2000, 0x0);
            const mint2 = await contract.mint(user1.address, 4, 1000, 0x0);
            const mint3 = await contract.mint(user1.address, 4, 2000, 0x0);
            const mint4 = await contract.mint(user1.address, 4, 500, 0x0);
            const mint5 = await contract.mint(user1.address, 4, 6, 0x0);
            await mint1.wait();
            await mint2.wait();
            await mint3.wait();
            await mint4.wait();
            await mint5.wait();
        })
        after(async () => {
            expect(await contract.balanceOf(user1.address, 4), "Mint Multiple using multiple transaction Balance is wrong").to.be.equal(5506);
        })

        it("Mint Multiple using multiple transactions and multiple users should be successfully", async () => {
            const mint1 = await contract.mint(user1.address, 5, 2000, 0x0);
            const mint6 = await contract.mint(user2.address, 5, 500, 0x0);
            const mint2 = await contract.mint(user1.address, 5, 1000, 0x0);
            const mint7 = await contract.mint(user2.address, 5, 500, 0x0);
            const mint3 = await contract.mint(user1.address, 5, 2000, 0x0);
            const mint4 = await contract.mint(user1.address, 5, 500, 0x0);
            const mint8 = await contract.mint(user2.address, 5, 1000, 0x0);
            const mint5 = await contract.mint(user1.address, 5, 6, 0x0);
            const mint9 = await contract.mint(user2.address, 5, 1500, 0x0);
            const mint10 = await contract.mint(user2.address, 5, 8, 0x0);
            await mint1.wait();
            await mint2.wait();
            await mint3.wait();
            await mint4.wait();
            await mint5.wait();
            await mint6.wait();
            await mint7.wait();
            await mint8.wait();
            await mint9.wait();
            await mint10.wait();
        })
        after(async () => {
            expect(await contract.balanceOf(user1.address, 5), "Mint Multiple using multiple transactions and multiple users balance is wrong").to.be.equal(5506);
            expect(await contract.balanceOf(user2.address, 5), "Mint Multiple using multiple transactions and multiple users balance is wrong").to.be.equal(3508);
        })


    });

    describe("Mint Values - Case 02", async () => {

        before(async () => {
            [deployer, user1, user2] = await ethers.getSigners();
            const baseContractFactory = await ethers.getContractFactory(
                readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,
                "0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]), deployer);
            contract = await baseContractFactory.deploy();
            await contract.deployed();
        })

        it("Mint a zero Token should be reverted", async () => {
            (await expect( contract.mint(user1.address, 1, 0, 0x0))).to.be.reverted;
        })
        it("Mint to zero address should be reverted", async () => {
            (await expect( contract.mint(ethers.utils.getAddress("0x0000000000000000000000000000000000000000"), 1, 100, 0x0))).to.be.reverted;
        })


    })
});



