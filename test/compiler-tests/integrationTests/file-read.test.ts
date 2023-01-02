import {describe} from "mocha";
import {findAFile} from "../../../yul-compiler";
import {expect} from "chai";

describe('Find a file given path name and extension [TESTING findAFile FUNCTION]',  () => {
    let foundFile: any;
    const startPath = ".\\test\\compiler-tests\\integrationTests";
    it('search mock yul file metadata',()=>{
        foundFile = findAFile(startPath, 'mock2','yul', null, null);
    })
    after(()=>{
        expect(foundFile, "mock yul file metadata collect failed").not.to.be.undefined;
        expect(foundFile, "mock yul file metadata collect failed").not.to.be.null;
        expect(foundFile.length, "mock yul file metadata collect failed").to.be.greaterThan(0);
    })

    it('read mock yul file metadata' ,()=>{
        foundFile = findAFile(startPath, 'mock2','yul', null, null);
    })
    after(()=>{
        expect(foundFile[0][0], "file name metadata read failed").to.be.include('mock2');
        expect(foundFile[0][1], "file path metadata read failed").to.be.equal('test\\compiler-tests\\integrationTests\\integration-test-mock-data\\mock2.yul');
    })
});


describe('Find a file given path name and extension [TESTING findAFile FUNCTION]',  () => {
    let foundFile: any;
    const startPath = ".\\test\\compiler-tests\\integrationTests";
    it('search mock yul file metadata (Different file)',()=>{
        foundFile = findAFile(startPath, 'mock','yul', null, null);
    })
    after(()=>{
        expect(foundFile, "mock yul file metadata collect failed").not.to.be.undefined;
        expect(foundFile, "mock yul file metadata collect failed").not.to.be.null;
        expect(foundFile.length, "mock yul file metadata collect failed").to.be.greaterThan(0);
    })

    it('read mock yul file metadata (Different file)' ,()=>{
        foundFile = findAFile(startPath, 'mock','yul', null, null);
    })
    after(()=>{
        expect(foundFile[0][0], "file name metadata read failed").to.be.include('mock');
        expect(foundFile[0][1], "file path metadata read failed").to.be.equal('test\\compiler-tests\\integrationTests\\integration-test-mock-data\\mock.yul');
    })
});