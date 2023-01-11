import {expect} from "chai";
import {ethers} from "hardhat";
import {compileSelected, findAFile, getFilteredByteCode,} from "../../yul-compiler";
import {getSigner} from "@nomiclabs/hardhat-ethers/internal/helpers";
import fs from "fs";
import {BigNumber, Contract} from "ethers";
import {getDecodedAddress, getDecodeTwoUint256DynamicArrays} from "./util";

export function readJson(path: string) {
    // console.log(path)
    const fileRead = fs.readFileSync('.\\' + path, 'utf8');
    try {
        return (JSON.parse(fileRead))
    } catch (err) {
        console.error(err)
    }
}

describe("Pure Yul ERC1155 - burnBatch Function Testing", function () {
    let deployer: any, user1: any, user2: any;
    let contract: Contract;
    describe("burn batch testing - Case 01", async () => {

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
        /**


         **/
        it("burn batch single token should burnt failed", async () => {
            //todo approve check
            const tnx = await contract.burnBatch(user1.address, [1], [100_000]);
            const receipt = await tnx.wait()

            const firstEvent = (receipt.events.filter((event: any) => {
                return event?.topics[0] == '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb'
            }))[0];
            const verifyingTopic = firstEvent.topics;
            const verifyingData = firstEvent.data;

            expect(getDecodedAddress(verifyingTopic[1]), "receiver balance updated failed").to.be.equal(deployer.address)
            expect(getDecodedAddress(verifyingTopic[2]), "receiver balance updated failed").to.be.equal(user1.address)
            expect(getDecodedAddress(verifyingTopic[3]), "receiver balance updated failed").to.be.equal(ethers.utils.getAddress("0x0000000000000000000000000000000000000000"))


            const decodedData = getDecodeTwoUint256DynamicArrays(verifyingData);
            expect(decodedData, "").not.to.be.undefined;
            expect(decodedData ? decodedData[0][0] : undefined, "").to.be.equal(1);
            expect(decodedData ? decodedData[1][0] : undefined, "").to.be.equal(100000);

        })

        it("burn batch multiple token should burnt failed", async () => {
            const tnx = await contract.burnBatch(user1.address, [2, 3], [800_000, 600_000]);
            await tnx.wait()

        })


        after(async () => {
            expect(await contract.balanceOf(user1.address, 1), "burn batch single token balance is wrong").to.be.equal(900_000);
            expect(await contract.balanceOf(user1.address, 2), "burn batch multiple tokens balance is wrong").to.be.equal(200_000);
            expect(await contract.balanceOf(user1.address, 3), "burn batch multiple tokens balance is wrong").to.be.equal(400_000);
        })

    });


    describe("burn batch testing - Case 02", async () => {

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

        it("zero tokens can not be burnt", async () => {
            (await expect(contract.burnBatch(user1.address, [1], [0]))).to.be.reverted;
            (await expect(contract.burnBatch(user1.address, [1], []))).to.be.reverted;
        })
        it("tokens more than minted can not be burnt", async () => {
            (await expect(contract.burn(user1.address, [2], [2_000_000]))).to.be.reverted;
            (await expect(contract.burn(user1.address, [2, 3], [2_000_000, 5_000_000]))).to.be.reverted;
        })
        it("tokens more than minted can not be burnt and zero address", async () => {
            (await expect(contract.burn(ethers.utils.getAddress("0x0000000000000000000000000000000000000000"), [3], [200]))).to.be.reverted;
            (await expect(contract.burn(ethers.utils.getAddress("0x0000000000000000000000000000000000000000"), [3, 4], [100, 200]))).to.be.reverted;
        })

    });

});



