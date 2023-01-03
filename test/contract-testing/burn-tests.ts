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
            const mintBatch = await contract.mintBatch(user1.address, [1,2,3,4,5,6], [1_000_000,1_000_000,1_000_000,1_000_000,1_000_000,1_000_000], 0x0);
            await mintBatch.wait();
        })
        /**


         **/
        it("burn multiple tokens should burnt successfully", async () => {
            // const tnx = await contract.burnBatch(user1.address, [1,2], [100_000, 800_000], 0x0);
            const tnx = await contract.burn(user1.address, 1, 100_000);
            const tnx2 = await contract.burn(user1.address, 2, 800_000);
            await tnx.wait()
            await tnx2.wait()

        })
        it("burn single token should burnt successfully", async () => {
            const tnx = await contract.burn(user1.address, 3, 500_000);
            await tnx.wait()

        })

        after(async () => {
            expect(await contract.balanceOf(user1.address, 1), "burn batch multiple tokens balance is wrong").to.be.equal(900_000);
            expect(await contract.balanceOf(user1.address, 2), "burn batch multiple tokens balance is wrong").to.be.equal(200_000);
            expect(await contract.balanceOf(user1.address, 3), "burn batch multiple tokens balance is wrong").to.be.equal(500_000);
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
            const mintBatch = await contract.mintBatch(user1.address, [1,2,3,4,5,6], [1_000_000,1_000_000,1_000_000,1_000_000,1_000_000,1_000_000], 0x0);
            await mintBatch.wait();
        })


        // it("Zero size arrays should revert", async () => {
        //     (await expect( contract.burnBatch(user1.address, [], [], 0x0))).to.be.reverted;
        // })
        it("zero tokens can not be burnt", async () => {
            (await expect( contract.burn(user1.address, 1, 0))).to.be.reverted;
        })
        it("tokens more than minted can not be burnt", async () => {
            (await expect( contract.burn(user1.address, 2, 2_000_000))).to.be.reverted;
        })
        it("tokens more than minted can not be burnt and zero address", async () => {
            (await expect( contract.burn(ethers.utils.getAddress("0x0000000000000000000000000000000000000000"), 3, 100))).to.be.reverted;
        })

    });

});



