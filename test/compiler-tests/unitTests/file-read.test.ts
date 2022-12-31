import {describe} from "mocha";
import {searchFileByFilter} from "../../../yul-compiler";
import {expect} from "chai";

describe('Read filtered files given path [TESTING getAllYulFiles FUNCTION]', () => {
    let foundFiles: any;
    const path = ".\\test\\compiler-tests\\unitTests\\uint-test-mock-data";
    it('read mock yul files data',()=>{
        foundFiles = searchFileByFilter(path, 'yul', null, null);
    })
    after(()=>{
        expect(foundFiles, "mock yul files read failed").not.to.be.undefined;
        expect(foundFiles, "mock yul files read failed").not.to.be.null;
        expect(foundFiles.length, "mock yul files read failed").to.be.greaterThan(0);
    })

    it('read mock yul file data',()=>{
        foundFiles = searchFileByFilter(path, 'yul', null, null);
    })
    after(()=>{
        expect(foundFiles[0][0], "file name read failed").to.be.include('mock');
        expect('.\\' + foundFiles[0][1], "file path read failed").to.be.includes(path);
    })
});

describe('Read filtered files given path ( different path) [TESTING getAllYulFiles FUNCTION]', () => {
    let foundFiles: any;
    const path = ".\\test\\compiler-tests";
    it('read mock yul files data (different path)',()=>{
        foundFiles = searchFileByFilter(path, 'yul', null, null);
    })
    after(()=>{
        expect(foundFiles, "mock yul files read failed").not.to.be.undefined;
        expect(foundFiles, "mock yul files read failed").not.to.be.null;
        expect(foundFiles.length, "mock yul files read failed").to.be.greaterThan(0);
    })

    it('read mock yul file data (different path)' ,()=>{
        foundFiles = searchFileByFilter(path, 'yul', null, null);
    })
    after(()=>{
        expect(foundFiles[0][0], "file name read failed").to.be.include('mock');
        expect('.\\' + foundFiles[0][1], "file path read failed").to.be.includes(path);
    })
});


