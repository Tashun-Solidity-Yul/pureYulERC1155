import fs from "fs";
import {ethers} from "hardhat";

export function readJson(path: string) {
    const fileRead = fs.readFileSync('.\\' + path, 'utf8');
    try {
        return (JSON.parse(fileRead))
    } catch (err) {
        console.error(err)
    }
}

export enum DATA_TYPE {
    UINT256= "uint256",
    ADDRESS= "address",
    BOOL= "bool",
}

export function getDecodeTwoUint256DynamicArrays(data: string) {
    try {
        const [array1, array2] = ethers.utils.defaultAbiCoder.decode(
            ['uint256[]', 'uint256[]'],
            ethers.utils.hexDataSlice(data, 0)
        )
        return [array1, array2];
    } catch (err) {
        console.error(err)
    }
}

export function getDecodeOneUint256DynamicArray(data: string) {
    try {
        const [array1, array2] = ethers.utils.defaultAbiCoder.decode(
            ['uint256[]'],
            ethers.utils.hexDataSlice(data, 0)
        )
        return [array1, array2];
    } catch (err) {
        console.error(err)
    }
}

export function getDecodedSingleValue(data: string, dataType: DATA_TYPE) {
    try {
        const [value] = ethers.utils.defaultAbiCoder.decode(
            [dataType],
            ethers.utils.hexDataSlice(data, 0)
        )
        return value;
    } catch (err) {
        console.error(err)
    }
}

export function getDecodedTwoValues(data: string) {
    try {
        const [array1, array2] = ethers.utils.defaultAbiCoder.decode(
            ['uint256','uint256'],
            ethers.utils.hexDataSlice(data, 0)
        )
        return [array1, array2];
    } catch (err) {
        console.error(err)
    }
}

export function getDecodedAddress(data: string) {
    try {
        const [address] = ethers.utils.defaultAbiCoder.decode(
            ['address'],
            ethers.utils.hexDataSlice(data, 0)
        )
        return address;
    } catch (err) {
        console.error(err)
    }
}
