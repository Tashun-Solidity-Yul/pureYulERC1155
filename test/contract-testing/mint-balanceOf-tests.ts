import {assert, expect} from "chai";
import {ethers} from "hardhat";
import {findAFile, getFilteredByteCode,} from "../../yul-compiler";
import {Contract} from "ethers";
import {getDecodedAddress, getDecodedTwoValues, readJson} from "./util";


function testTransferSingleEmitResults(testId : number, receipt1: any, deployer: any, user: any, tokenAmount: number, tokenId: number) {
    const firstEvent1 = (receipt1.events.filter((event: any) => {
        return event?.topics[0] == '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62'
    }))[0];
    const verifyingTopic1 = firstEvent1.topics;
    const verifyingData1 = firstEvent1.data;

    expect(getDecodedAddress(verifyingTopic1[1]), `TestId ${testId}, TransferSingle Event check failed`).to.be.equal(deployer.address)
    expect(getDecodedAddress(verifyingTopic1[2]), `TestId ${testId}, TransferSingle Event check failed`).to.be.equal(ethers.utils.getAddress("0x0000000000000000000000000000000000000000"))
    expect(getDecodedAddress(verifyingTopic1[3]), `TestId ${testId}, TransferSingle Event check failed`).to.be.equal(user.address)


    const decodedData1 = getDecodedTwoValues(verifyingData1);
    assert(decodedData1)
    expect(decodedData1[0], `TestId ${testId}, Token Amount is wrong`).to.be.equal(tokenAmount);
    expect(decodedData1[1], `TestId ${testId}, Token Amount is wrong`).to.be.equal(tokenId);
}

describe("Pure Yul ERC1155 - Mint Function Testing", function () {
    let deployer: any, user1: any, user2: any;
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
        it("Mint a single Token", async () => {
            const mint = await contract.mint(user1.address, 1, 1, 0x0);
            const receipt = await mint.wait();

            expect(await contract.balanceOf(user1.address, 1), "Balance is wrong").to.be.equal(1);

            testTransferSingleEmitResults(1,receipt,deployer,user1,1,1);

        })


        it("Mint with Multiple Tokens", async () => {
            const mint = await contract.mint(user1.address, 2, 2467, 0x0);
            const receipt = await mint.wait();

            expect(await contract.balanceOf(user1.address, 2), "Mint Multiple Tokens Balance is wrong").to.be.equal(2467);

            testTransferSingleEmitResults(2,receipt,deployer,user1,2,2467);

        })

        it("Mint with Multiple users", async () => {
            const mint1 = await contract.mint(user1.address, 3, 2000, 0x0);
            const mint2 = await contract.mint(user2.address, 3, 1000, 0x0);
            const receipt1 = await mint1.wait();
            const receipt2 = await mint2.wait();

            expect(await contract.balanceOf(user1.address, 3), "Mint Multiple users Balance is wrong").to.be.equal(2000);
            expect(await contract.balanceOf(user2.address, 3), "Mint Multiple users Balance is wrong").to.be.equal(1000);

            testTransferSingleEmitResults(3,receipt1,deployer,user1,3,2000);
            testTransferSingleEmitResults(4,receipt2,deployer,user2,3,1000);

        })

        it("Mint Multiple using multiple transaction", async () => {
            const mint1 = await contract.mint(user1.address, 4, 2000, 0x0);
            const mint2 = await contract.mint(user1.address, 4, 1000, 0x0);
            const mint3 = await contract.mint(user1.address, 4, 2000, 0x0);
            const mint4 = await contract.mint(user1.address, 4, 500, 0x0);
            const mint5 = await contract.mint(user1.address, 4, 6, 0x0);
            const receipt1 = await mint1.wait();
            const receipt2 = await mint2.wait();
            const receipt3 = await mint3.wait();
            const receipt4 = await mint4.wait();
            const receipt5 = await mint5.wait();
            expect(await contract.balanceOf(user1.address, 4), "Mint Multiple using multiple transaction Balance is wrong").to.be.equal(5506);

            testTransferSingleEmitResults(5,receipt1,deployer,user1,4,2000);
            testTransferSingleEmitResults(6,receipt2,deployer,user1,4,1000);
            testTransferSingleEmitResults(7,receipt3,deployer,user1,4,2000);
            testTransferSingleEmitResults(8,receipt4,deployer,user1,4,500);
            testTransferSingleEmitResults(9,receipt5,deployer,user1,4,6);
        })
        after(async () => {
        })

        it("Mint Multiple using multiple transactions and multiple users", async () => {
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
            const receipt1 = await mint1.wait();
            const receipt2 = await mint2.wait();
            const receipt3 = await mint3.wait();
            const receipt4 = await mint4.wait();
            const receipt5 = await mint5.wait();
            const receipt6 = await mint6.wait();
            const receipt7 = await mint7.wait();
            const receipt8 = await mint8.wait();
            const receipt9 = await mint9.wait();
            const receipt10 = await mint10.wait();

            expect(await contract.balanceOf(user1.address, 5), "Mint Multiple using multiple transactions and multiple users balance is wrong").to.be.equal(5506);
            expect(await contract.balanceOf(user2.address, 5), "Mint Multiple using multiple transactions and multiple users balance is wrong").to.be.equal(3508);

            testTransferSingleEmitResults(10,receipt1,deployer,user1,5,2000);
            testTransferSingleEmitResults(11,receipt2,deployer,user1,5,1000);
            testTransferSingleEmitResults(12,receipt3,deployer,user1,5,2000);
            testTransferSingleEmitResults(13,receipt4,deployer,user1,5,500);
            testTransferSingleEmitResults(14,receipt5,deployer,user1,5,6);
            testTransferSingleEmitResults(15,receipt6,deployer,user2,5,500);
            testTransferSingleEmitResults(16,receipt7,deployer,user2,5,500);
            testTransferSingleEmitResults(17,receipt8,deployer,user2,5,1000);
            testTransferSingleEmitResults(18,receipt9,deployer,user2,5,1500);
            testTransferSingleEmitResults(19,receipt10,deployer,user2,5,8);

        })

        it("Mint Multiple using multiple transactions and multiple users, tnx by multi users", async () => {
            const mint1 = await contract.connect(user1).mint(user1.address, 6, 2000, 0x0);
            const mint6 = await contract.connect(user2).mint(user2.address, 6, 500, 0x0);
            const mint2 = await contract.connect(user2).mint(user1.address, 6, 1000, 0x0);
            const mint7 = await contract.connect(user2).mint(user2.address, 6, 500, 0x0);
            const mint3 = await contract.connect(user2).mint(user1.address, 6, 2000, 0x0);
            const mint4 = await contract.connect(user2).mint(user1.address, 6, 500, 0x0);
            const mint8 = await contract.connect(user1).mint(user2.address, 6, 1000, 0x0);
            const mint5 = await contract.connect(user1).mint(user1.address, 6, 6, 0x0);
            const mint9 = await contract.connect(user2).mint(user2.address, 6, 1500, 0x0);
            const mint10 = await contract.connect(user2).mint(user2.address, 6, 8, 0x0);
            const receipt1 = await mint1.wait();
            const receipt2 = await mint2.wait();
            const receipt3 = await mint3.wait();
            const receipt4 = await mint4.wait();
            const receipt5 = await mint5.wait();
            const receipt6 = await mint6.wait();
            const receipt7 = await mint7.wait();
            const receipt8 = await mint8.wait();
            const receipt9 = await mint9.wait();
            const receipt10 = await mint10.wait();

            expect(await contract.balanceOf(user1.address, 5), "Mint Multiple using multiple transactions and multiple users balance is wrong").to.be.equal(5506);
            expect(await contract.balanceOf(user2.address, 5), "Mint Multiple using multiple transactions and multiple users balance is wrong").to.be.equal(3508);

            testTransferSingleEmitResults(21,receipt2,user2,user1,6,1000);
            testTransferSingleEmitResults(20,receipt1,user1,user1,6,2000);
            testTransferSingleEmitResults(22,receipt3,user2,user1,6,2000);
            testTransferSingleEmitResults(23,receipt4,user2,user1,6,500);
            testTransferSingleEmitResults(24,receipt5,user1,user1,6,6);
            testTransferSingleEmitResults(25,receipt6,user2,user2,6,500);
            testTransferSingleEmitResults(26,receipt7,user2,user2,6,500);
            testTransferSingleEmitResults(27,receipt8,user1,user2,6,1000);
            testTransferSingleEmitResults(28,receipt9,user2,user2,6,1500);
            testTransferSingleEmitResults(29,receipt10,user2,user2,6,8);

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
            (await expect(contract.mint(user1.address, 1, 0, 0x0))).to.be.reverted;
        })
        it("Mint to zero address should be reverted", async () => {
            (await expect(contract.mint(ethers.utils.getAddress("0x0000000000000000000000000000000000000000"), 1, 100, 0x0))).to.be.reverted;
        })


    })
});



