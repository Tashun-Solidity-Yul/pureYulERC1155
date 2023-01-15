import {Contract} from "ethers";
import {ethers} from "hardhat";
import {findAFile, getFilteredByteCode} from "../../yul-compiler";
import {expect} from "chai";
import {DATA_TYPE, getDecodedAddress, getDecodedSingleValue, getDecodeTwoUint256DynamicArrays, readJson} from "./util";

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
            const receipt1 = await tnx1.wait()
            let tnx2 = await contract.connect(user1).setApprovalForAll(user2.address, false);
            const receipt2 =await tnx2.wait()
            expect(await contract.isApprovedForAll(user2.address, user1.address), "user1 approve for the address of user2 set to false").to.be.equal(false);
            expect(await contract.isApprovedForAll(user1.address, user2.address), "user2 approve for the address of user1 set to false").to.be.equal(false);


            const firstEvent = (receipt1.events.filter((event: any) => {
                return event?.topics[0] == '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
            }))[0];
            const verifyingTopic1 = firstEvent.topics;
            const verifyingData1 = firstEvent.data;
            expect(getDecodedAddress(verifyingTopic1[1]), "ApprovalForAll Event check failed").to.be.equal(user2.address)
            expect(getDecodedAddress(verifyingTopic1[2]), "ApprovalForAll Event check failed").to.be.equal(user1.address)


            const decodedData1 = getDecodedSingleValue(verifyingData1,DATA_TYPE.BOOL);
            expect(decodedData1, "").not.to.be.undefined;
            expect(decodedData1, "").to.be.equal(false);

            const firstEvent_2 = (receipt2.events.filter((event: any) => {
                return event?.topics[0] == '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
            }))[0];
            const verifyingTopic2 = firstEvent_2.topics;
            const verifyingData2 = firstEvent_2.data;

            expect(getDecodedAddress(verifyingTopic2[1]), "ApprovalForAll Event check failed").to.be.equal(user1.address)
            expect(getDecodedAddress(verifyingTopic2[2]), "ApprovalForAll Event check failed").to.be.equal(user2.address)

            const decodedData2 = getDecodedSingleValue(verifyingData2,DATA_TYPE.BOOL);
            expect(decodedData2, "").not.to.be.undefined;
            expect(decodedData2, "").to.be.equal(false);
        })
        it("set approve false to true for user1 by user 2", async () => {
            let approvalForAll = await contract.connect(user2).setApprovalForAll(user1.address, true);
            const receipt = await approvalForAll.wait()
            expect(await contract.isApprovedForAll(user2.address, user1.address), "user1 approve for the address of user2 set to true is wrong").to.be.equal(true);


            const firstEvent = (receipt.events.filter((event: any) => {
                return event?.topics[0] == '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
            }))[0];
            const verifyingTopic1 = firstEvent.topics;
            const verifyingData1 = firstEvent.data;
            expect(getDecodedAddress(verifyingTopic1[1]), "ApprovalForAll Event check failed").to.be.equal(user2.address)
            expect(getDecodedAddress(verifyingTopic1[2]), "ApprovalForAll Event check failed").to.be.equal(user1.address)


            const decodedData1 = getDecodedSingleValue(verifyingData1,DATA_TYPE.BOOL);
            expect(decodedData1, "").not.to.be.undefined;
            expect(decodedData1, "").to.be.equal(true);
        })
        it("set approve false to true for user2 by user 1", async () => {
            let approvalForAll = await contract.connect(user1).setApprovalForAll(user2.address, true);
            const receipt = await approvalForAll.wait()
            expect(await contract.isApprovedForAll(user1.address, user2.address), "user2 approve for the address of user1 set to true is wrong").to.be.equal(true);
            const firstEvent = (receipt.events.filter((event: any) => {
                return event?.topics[0] == '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
            }))[0];
            const verifyingTopic1 = firstEvent.topics;
            const verifyingData1 = firstEvent.data;
            expect(getDecodedAddress(verifyingTopic1[1]), "ApprovalForAll Event check failed").to.be.equal(user1.address)
            expect(getDecodedAddress(verifyingTopic1[2]), "ApprovalForAll Event check failed").to.be.equal(user2.address)


            const decodedData1 = getDecodedSingleValue(verifyingData1,DATA_TYPE.BOOL);
            expect(decodedData1, "").not.to.be.undefined;
            expect(decodedData1, "").to.be.equal(true);
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
            const receipt1 = await tnx1.wait()
            let tnx2 = await contract.connect(user1).setApprovalForAll(user2.address, true);
            const receipt2 = await tnx2.wait()
            expect(await contract.isApprovedForAll(user2.address, user1.address), "user1 approve for the address of user2 set to true").to.be.equal(true);
            expect(await contract.isApprovedForAll(user1.address, user2.address), "user2 approve for the address of user1 set to true").to.be.equal(true);

            const firstEvent = (receipt1.events.filter((event: any) => {
                return event?.topics[0] == '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
            }))[0];
            const verifyingTopic1 = firstEvent.topics;
            const verifyingData1 = firstEvent.data;
            expect(getDecodedAddress(verifyingTopic1[1]), "ApprovalForAll Event check failed").to.be.equal(user2.address)
            expect(getDecodedAddress(verifyingTopic1[2]), "ApprovalForAll Event check failed").to.be.equal(user1.address)


            const decodedData1 = getDecodedSingleValue(verifyingData1,DATA_TYPE.BOOL);
            expect(decodedData1, "").not.to.be.undefined;
            expect(decodedData1, "").to.be.equal(true);

            const firstEvent_2 = (receipt2.events.filter((event: any) => {
                return event?.topics[0] == '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
            }))[0];
            const verifyingTopic2 = firstEvent_2.topics;
            const verifyingData2 = firstEvent_2.data;

            expect(getDecodedAddress(verifyingTopic2[1]), "ApprovalForAll Event check failed").to.be.equal(user1.address)
            expect(getDecodedAddress(verifyingTopic2[2]), "ApprovalForAll Event check failed").to.be.equal(user2.address)

            const decodedData2 = getDecodedSingleValue(verifyingData2,DATA_TYPE.BOOL);
            expect(decodedData2, "").not.to.be.undefined;
            expect(decodedData2, "").to.be.equal(true);
        })
        it("set approve false to true for user1 by user 2", async () => {
            let approvalForAll = await contract.connect(user2).setApprovalForAll(user1.address, false);
            const receipt = await approvalForAll.wait()
            expect(await contract.isApprovedForAll(user2.address, user1.address), "user1 approve for the address of user2 set to false is wrong").to.be.equal(false);

            const firstEvent = (receipt.events.filter((event: any) => {
                return event?.topics[0] == '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
            }))[0];
            const verifyingTopic1 = firstEvent.topics;
            const verifyingData1 = firstEvent.data;
            expect(getDecodedAddress(verifyingTopic1[1]), "ApprovalForAll Event check failed").to.be.equal(user2.address)
            expect(getDecodedAddress(verifyingTopic1[2]), "ApprovalForAll Event check failed").to.be.equal(user1.address)


            const decodedData1 = getDecodedSingleValue(verifyingData1,DATA_TYPE.BOOL);
            expect(decodedData1, "").not.to.be.undefined;
            expect(decodedData1, "").to.be.equal(false);



        })
        it("set approve false to true for user2 by user 1", async () => {
            let approvalForAll = await contract.connect(user1).setApprovalForAll(user2.address, false);
            const receipt = await approvalForAll.wait()
            expect(await contract.isApprovedForAll(user1.address, user2.address), "user2 approve for the address of user1 set to false is wrong").to.be.equal(false);

            const firstEvent = (receipt.events.filter((event: any) => {
                return event?.topics[0] == '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
            }))[0];
            const verifyingTopic1 = firstEvent.topics;
            const verifyingData1 = firstEvent.data;
            expect(getDecodedAddress(verifyingTopic1[1]), "ApprovalForAll Event check failed").to.be.equal(user1.address)
            expect(getDecodedAddress(verifyingTopic1[2]), "ApprovalForAll Event check failed").to.be.equal(user2.address)


            const decodedData1 = getDecodedSingleValue(verifyingData1,DATA_TYPE.BOOL);
            expect(decodedData1, "").not.to.be.undefined;
            expect(decodedData1, "").to.be.equal(false);
        })
        it("unrelated address", async () => {
            expect(await contract.isApprovedForAll(user1.address, deployer.address), "unrelated address check is wrong").to.be.equal(false);

        })
        it("owner and approve address should be different", async () => {
            expect(await contract.isApprovedForAll(user1.address, user1.address), "owner can't be the approving address").to.be.equal(false);

        })
    })

})