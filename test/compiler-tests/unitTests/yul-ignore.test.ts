import {describe} from "mocha";
import {loadYulIgnore} from "../../../yul-compiler";
import {expect} from "chai";

describe('Read yul ignore file file', function () {
    const path = ".\\test\\compiler-tests\\unitTests\\uint-test-mock-data\\.yulignore";
    let YUL_IGNORE_FILES: any;
    it('read yul ignore file',()=>{
        YUL_IGNORE_FILES = loadYulIgnore(path);
    })
    after(()=>{
        expect(YUL_IGNORE_FILES?.length, "Read failed").not.to.be.undefined;
        expect(YUL_IGNORE_FILES?.length, "yul ignore file read unsuccessful").to.be.equal(19);
    })
});