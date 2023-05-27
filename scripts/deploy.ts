import {ethers} from "hardhat";
import {readJson} from "../test/contract-testing/util";
import {findAFile, getFilteredByteCode} from "../yul-compiler";
import {BigNumber} from "ethers";

let _domain: any = null

async function main() {
    // await ethers.getSigners();

  const ABI = [
    'constructor(uint256 inp)',
      'function test() external view returns(bytes32)'

  ]
  const iface = new ethers.utils.Interface(ABI);
    const baseContractFactory = await ethers.getContractFactory(ABI,"0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]));
    // const baseContractFactory = await ethers.getContractFactory( readJson(findAFile('./artifacts', 'IERC1155', 'json', null, null)[0][1])?.abi,"0x" + getFilteredByteCode(findAFile('./artifacts', 'pureContract', 'yaml', null, null)[0][1]));

    const contract = await baseContractFactory.deploy("0x1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff2");
    // const contract = await baseContractFactory.deploy("Hi4545");
    // const contract = await baseContractFactory.deploy();
  const tnx = await contract.deployed();
  // console.log()
  // console.log(tnx.address)
    console.log(tnx)

    const tnx1 =await contract.test()
    // const receipt = await tnx1.wait()

    console.log(tnx1)
    // console.log(receipt)

    // await helpers.time.setNextBlockTimestamp(newTimestamp);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


