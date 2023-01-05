import {expect} from "chai";
import {ethers} from "hardhat";
import {compileSelected, findAFile, getFilteredByteCode,} from "../../yul-compiler";
import {getSigner} from "@nomiclabs/hardhat-ethers/internal/helpers";
import fs from "fs";
import {BigNumber, Contract} from "ethers";
import {after} from "mocha";

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
            const mintBatch1 = await contract.mintBatch(user1.address, [1, 2, 3, 4], [100, 10000, 100, 10000], 0x0);
            const mintBatch2 = await contract.mintBatch(user2.address, [1, 2, 3, 4], [10000, 100, 10000, 100], 0x0);
            await mintBatch1.wait();
            await mintBatch2.wait();

        })
        it("Owner Transfer from user2 to user1", async () => {
            await contract.connect(user2).safeTransferFrom(user2.address, user1.address, 3, 100, 0x00)
            expect(await contract.balanceOf(user2.address, 3), "spender balance updated successfully").to.be.equal(9900)
            expect(await contract.balanceOf(user1.address, 3), "receiver balance updated successfully").to.be.equal(200)

        })

        it("Owner Transfer from user1 to user2", async () => {
            await contract.connect(user1).safeTransferFrom(user1.address, user2.address, 4, 100, 0x00)
            expect(await contract.balanceOf(user1.address, 4), "spender balance updated successfully").to.be.equal(9900)
            expect(await contract.balanceOf(user2.address, 4), "receiver balance updated successfully").to.be.equal(200)

        })
        it("Transfer From with user2 set user1 the approve all", async () => {
            await contract.connect(user2).setApprovalForAll(user1.address, true)
            await contract.safeTransferFrom(user2.address, user1.address, 1, 100, 0x00)
            expect(await contract.balanceOf(user2.address, 1), "spender balance updated successfully").to.be.equal(9900)
            expect(await contract.balanceOf(user1.address, 1), "receiver balance updated successfully").to.be.equal(200)

        })

        it("Transfer From with user1 set user2 the approve all", async () => {
            await contract.connect(user1).setApprovalForAll(user2.address, true)
            await contract.safeTransferFrom(user1.address, user2.address, 2, 100, 0x00)
            expect(await contract.balanceOf(user1.address, 2), "spender balance updated successfully").to.be.equal(9900)
            expect(await contract.balanceOf(user2.address, 2), "receiver balance updated successfully").to.be.equal(200)

        })

    });


    describe("mintBatch Values - Case 02", async () => {

        before(async () => {
            [deployer, user1, user2] = await ethers.getSigners();
            const baseContractFactory = await ethers.getContractFactory(
                readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,
                "0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]), deployer);
            contract = await baseContractFactory.deploy();
            const mintBatch1 = await contract.mintBatch(user1.address, [1, 2], [100, 10000], 0x0);
            await mintBatch1.wait();
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



