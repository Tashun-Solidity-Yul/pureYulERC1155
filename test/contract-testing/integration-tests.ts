// import {assert, expect} from "chai";
// import {ethers} from "hardhat";
// import {compileSelected, findAFile, getFilteredByteCode,} from "../../yul-compiler";
// import {getSigner} from "@nomiclabs/hardhat-ethers/internal/helpers";
// import fs from "fs";
// import {BigNumber, Contract} from "ethers";
// import {DATA_TYPE, getDecodedAddress, getDecodedSingleValue, getDecodedTwoValues, readJson} from "./util";
//
//
// function testTransferSingleEmitResults(testId: number, receipt1: any, deployer: any, user: any, tokenId: number, tokenAmount: number) {
//     const firstEvent1 = (receipt1.events.filter((event: any) => {
//         return event?.topics[0] == '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62'
//     }))[0];
//     const verifyingTopic1 = firstEvent1.topics;
//     const verifyingData1 = firstEvent1.data;
//
//     expect(getDecodedAddress(verifyingTopic1[1]), `TestId ${testId}, burn function test, TransferBatch Event check failed`).to.be.equal(deployer.address)
//     expect(getDecodedAddress(verifyingTopic1[2]), `TestId ${testId}, burn function test, TransferBatch Event check failed`).to.be.equal(user.address)
//     expect(getDecodedAddress(verifyingTopic1[3]), `TestId ${testId}, burn function test, TransferBatch Event check failed`).to.be.equal(ethers.utils.getAddress("0x0000000000000000000000000000000000000000"))
//
//
//     const decodedData1 = getDecodedTwoValues(verifyingData1);
//     assert(decodedData1)
//     expect(decodedData1[0], `TestId ${testId}, burn function test, Token Id is wrong`).to.be.equal(tokenId);
//     expect(decodedData1[1], `TestId ${testId}, burn function test, Token Amount is wrong`).to.be.equal(tokenAmount);
// }
//
// describe("Pure Yul ERC1155 - burn function Testing", function () {
//     let deployer: any, user1: any, user2: any;
//     let contract: Contract;
//     let contractInstance:Contract;
//     describe("burn tokens - Case 01", async () => {
//
//         before(async () => {
//             [deployer, user1, user2] = await ethers.getSigners();
//             const baseContractFactory = await ethers.getContractFactory(
//                 readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,
//                 "0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]), deployer);
//             contract = await baseContractFactory.deploy();
//             await contract.deployed();
//             const mintBatch = await contract.mintBatch(user1.address, [1, 2, 3, 4, 5, 6], [1_000_000, 1_000_000, 1_000_000, 1_000_000, 1_000_000, 1_000_000], 0x0);
//             await mintBatch.wait();
//
//             const testContract = await ethers.getContractFactory("testReceiver");
//             contractInstance = await testContract.deploy()
//
//         })
//         /**
//
//
//          **/
//         // it("burn multiple tokens should burnt successfully", async () => {
//         //     const tnx = await contract.burn(user1.address, 1, 100_000);
//         //     const tnx2 = await contract.burn(user1.address, 2, 800_000);
//         //     const receipt1 = await tnx.wait()
//         //     const receipt2 = await tnx2.wait()
//         //
//         //     testTransferSingleEmitResults(1,receipt1,deployer,user1,1,100_000);
//         //     testTransferSingleEmitResults(2,receipt2,deployer,user1,2,800_000);
//         //
//         // })
//         // it("burn single token should burnt successfully", async () => {
//         //     const tnx = await contract.burn(user1.address, 3, 500_000);
//         //     const receipt1 = await tnx.wait()
//         //     expect(await contract.balanceOf(user1.address, 3), "burn batch multiple tokens balance is wrong").to.be.equal(500_000);
//         //
//         //
//         //     testTransferSingleEmitResults(3,receipt1,deployer,user1,3,500_000);
//         //
//         // })
//         //
//         // it("burn single token should burnt successfully, any user", async () => {
//         //     //todo - need restrictions when implemented with logic
//         //     const tnx = await contract.connect(user2).burn(user1.address, 4, 500_000);
//         //     const receipt1 = await tnx.wait()
//         //     expect(await contract.balanceOf(user1.address, 4), "burn batch multiple tokens balance is wrong").to.be.equal(500_000);
//         //
//         //
//         //     testTransferSingleEmitResults(4,receipt1,user2,user1,4,500_000);
//         //
//         // })
//         it("", async () => {
//            // const a = await contract.doSafeTransferAcceptanceCheck(user1.address, user1.address,contractInstance.address,1,1,0x0000000000000000000000000000000000000000000000000000000000000000)
//            // const a = await contract.doSafeBatchTransferAcceptanceCheck(user1.address, user1.address,contractInstance.address,[5],[7],"0xffefffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
//            const a = await contract.doSafeBatchTransferAcceptanceCheck(user1.address, user1.address,contractInstance.address,[5],[7],"0x00fe")
//            // const a = await contractInstance.onERC1155BatchReceived(user1.address,contractInstance.address,[1],[1],0x0)
//            // const a = await contractInstance.onERC1155Received(user1.address, user1.address,user1.address,1,1)
//            //  console.log(a)
//             const receipt = await a.wait()
//
//             // await expect(contract.doSafeTransferAcceptanceCheck(user1.address, user1.address,contractInstance.address,1,1,0x0)).to.be.revertedWith('')
//
//             // console.log(receipt.events)
//             console.log(receipt.events[0].topics)
//             console.log(receipt.events[0].data)
//             // console.log("0xf23a6e6100000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c800000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000")
//             // 0xf23a6e6100000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c800000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000
//
//         })
//     });
//
// });
//
//
//
