import {Contract} from "ethers";
import {ethers} from "hardhat";
import {findAFile, getFilteredByteCode} from "../../yul-compiler";
import {expect} from "chai";
import {readJson} from "./util";

describe("Approval setter getter checks", () => {
    let deployer: any, user1: any, user2: any;
    let contract: Contract;
    describe("Set Approval from false to true", () => {
        before(async () => {
            [deployer, user1, user2] = await ethers.getSigners();
            const baseContractFactory = await ethers.getContractFactory(
                readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,
                "0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]), deployer);
            contract = await baseContractFactory.deploy();
            await contract.deployed();
            let tnx1 = await contract.connect(user2).setApprovalForAll(user1.address, false);
            await tnx1.wait()
            let tnx2 = await contract.connect(user1).setApprovalForAll(user2.address, false);
            await tnx2.wait()
            expect(await contract.isApprovedForAll(user2.address, user1.address), "user1 approve for the address of user2 set to false").to.be.equal(false);
            expect(await contract.isApprovedForAll(user1.address, user2.address), "user2 approve for the address of user1 set to false").to.be.equal(false);

        })
        it("set approve false to true for user1 by user 2", async () => {
            let approvalForAll = await contract.connect(user2).setApprovalForAll(user1.address, true);
            await approvalForAll.wait()
            expect(await contract.isApprovedForAll(user2.address, user1.address), "user1 approve for the address of user2 set to true is wrong").to.be.equal(true);

        })
        it("set approve false to true for user2 by user 1", async () => {
            let approvalForAll = await contract.connect(user1).setApprovalForAll(user2.address, true);
            await approvalForAll.wait()
            expect(await contract.isApprovedForAll(user1.address, user2.address), "user2 approve for the address of user1 set to true is wrong").to.be.equal(true);

        })
    })

    describe("Set Approval from true to false", () => {
        before(async () => {
            [deployer, user1, user2] = await ethers.getSigners();
            const baseContractFactory = await ethers.getContractFactory(
                readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,
                "0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]), deployer);
            contract = await baseContractFactory.deploy();
            await contract.deployed();
            let tnx1 = await contract.connect(user2).setApprovalForAll(user1.address, true);
            await tnx1.wait()
            let tnx2 = await contract.connect(user1).setApprovalForAll(user2.address, true);
            const receipt = await tnx2.wait()
            receipt.events.forEach((a: { topics: any, data: any;  }) => {
                console.log(a.topics)
                console.log(a.data)
            })
            expect(await contract.isApprovedForAll(user2.address, user1.address), "user1 approve for the address of user2 set to true").to.be.equal(true);
            expect(await contract.isApprovedForAll(user1.address, user2.address), "user2 approve for the address of user1 set to true").to.be.equal(true);

        })
        it("set approve false to true for user1 by user 2", async () => {
            let approvalForAll = await contract.connect(user2).setApprovalForAll(user1.address, false);
            await approvalForAll.wait()
            expect(await contract.isApprovedForAll(user2.address, user1.address), "user1 approve for the address of user2 set to false is wrong").to.be.equal(false);

        })
        it("set approve false to true for user2 by user 1", async () => {
            let approvalForAll = await contract.connect(user1).setApprovalForAll(user2.address, false);
            const receipt = await approvalForAll.wait()
            //todo
            receipt.events.forEach((a: { topics: any, data: any;  }) => {
                // console.log(a.topics)
                // console.log(a.data)
            })
            expect(await contract.isApprovedForAll(user1.address, user2.address), "user2 approve for the address of user1 set to false is wrong").to.be.equal(false);
        })
        it("unrelated addrss", async () => {
            expect(await contract.isApprovedForAll(user1.address, deployer.address), "unrelated address check is wrong").to.be.equal(false);

        })
    })

})