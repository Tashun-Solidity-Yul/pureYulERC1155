import {before, describe} from "mocha";
import {
    compileAll,
    compileSelected,
    findAFile,
    getFilteredByteCode,
    loadYulIgnore,
    readYamlConfig
} from "../../../yul-compiler";
import {expect} from "chai";

describe('E2E testing - selected one file compilation', () => {
    let COMPILER_CONFIG: any;
    let YUL_IGNORE_FILES: any;
    let compiledFileFound: any;
    let compiledByteCode: any;
    const path = '.\\test\\compiler-tests\\e2e-testing\\e2e-test-mock-data\\yul-config.yaml';
    const startPath = ".\\test\\compiler-tests\\e2e-testing";
    const fileName = 'mock';
    const inputFileExtension = 'yul';
    const outputFileExtension = 'yaml';
    before(()=>{
        COMPILER_CONFIG = readYamlConfig(path);
        YUL_IGNORE_FILES = loadYulIgnore(COMPILER_CONFIG.pathToYulIgnore);


        expect(COMPILER_CONFIG, "Possible Parse Exceptions").not.to.be.undefined;
        expect(COMPILER_CONFIG, "Possible Parse Exceptions").not.to.be.null;
        expect(COMPILER_CONFIG.rootPath, "wrong root defined").to.be.equal(".\\test\\e2e-testing");
        expect(COMPILER_CONFIG.pathToYulIgnore, "wrong path to yul ignore").to.be.equal(".\\test\\compiler-tests\\e2e-testing\\e2e-test-mock-data\\.yulignore");
        expect(COMPILER_CONFIG.savePath, "wrong compile output save path").to.be.equal(".\\test\\compiler-tests\\e2e-testing\\mock-compiled-code");

        expect(YUL_IGNORE_FILES?.length, "Read failed").not.to.be.undefined;
        expect(YUL_IGNORE_FILES?.length, "yul ignore file read unsuccessful").to.be.equal(19);

    })
    it("Compile and read the byte code", async () => {
        await compileSelected(startPath, fileName, inputFileExtension, outputFileExtension, COMPILER_CONFIG, YUL_IGNORE_FILES);
        compiledFileFound = findAFile(startPath, fileName, 'yaml', null, null);
        compiledByteCode = getFilteredByteCode(compiledFileFound[0][1])
    })
    after(()=>{
        expect(compiledFileFound, "yul compiled file metadata collect failed").not.to.be.undefined;
        expect(compiledFileFound, "yul compiled file metadata collect failed").not.to.be.null;
        expect(compiledFileFound.length, "yul compiled file metadata collect failed").to.be.greaterThan(0);
        expect(compiledFileFound[0][0], "yul compiled file metadata invalid").to.be.include('mock');
        expect(compiledFileFound[0][1], "yul compiled file metadata invalid").to.be.equal('test\\compiler-tests\\e2e-testing\\mock-compiled-code\\mock\\mock.yaml');
        expect(compiledByteCode, "Compilation corrupted").to.be.equal("3360005561271060205560a9806100176000396000f3fe6004358060e01c90816306fdde0314608457816395d89b41146084578163313ce56714609e57816318160ddd14609257816370a0823114608657508063a9059cbb146084578063dd62ed3e146084578063095ea7b314608457806323b872dd14608457806339509351146084578063a457c2d7146084576340c10f1914608457600080fd5b005b60010160005260206000f35b60015460005260206000f35b601260005260206000f3");
    })


});


describe('E2E testing - compile all files', () => {
    let COMPILER_CONFIG: any;
    let YUL_IGNORE_FILES: any;
    let compiledFileFound: any;
    let compiledByteCode: any;
    const path = '.\\test\\compiler-tests\\e2e-testing\\e2e-test-mock-data\\yul-config.yaml';
    const startPath = ".\\test\\compiler-tests\\e2e-testing";
    const fileName = 'mock2';
    const inputFileExtension = 'yul';
    const outputFileExtension = 'yaml';
    before(()=>{
        COMPILER_CONFIG = readYamlConfig(path);
        YUL_IGNORE_FILES = loadYulIgnore(COMPILER_CONFIG.pathToYulIgnore);


        expect(COMPILER_CONFIG, "Possible Parse Exceptions").not.to.be.undefined;
        expect(COMPILER_CONFIG, "Possible Parse Exceptions").not.to.be.null;
        expect(COMPILER_CONFIG.rootPath, "wrong root defined").to.be.equal(".\\test\\e2e-testing");
        expect(COMPILER_CONFIG.pathToYulIgnore, "wrong path to yul ignore").to.be.equal(".\\test\\compiler-tests\\e2e-testing\\e2e-test-mock-data\\.yulignore");
        expect(COMPILER_CONFIG.savePath, "wrong compile output save path").to.be.equal(".\\test\\compiler-tests\\e2e-testing\\mock-compiled-code");

        expect(YUL_IGNORE_FILES?.length, "Read failed").not.to.be.undefined;
        expect(YUL_IGNORE_FILES?.length, "yul ignore file read unsuccessful").to.be.equal(19);

    })
    it("Compile and read the byte code", async () => {
        await compileAll(startPath, inputFileExtension,outputFileExtension, COMPILER_CONFIG, YUL_IGNORE_FILES);
        compiledFileFound = findAFile(startPath, fileName, 'yaml', null, null);
        compiledByteCode = getFilteredByteCode(compiledFileFound[0][1])
    })
    after(()=>{
        expect(compiledFileFound, "yul compiled file metadata collect failed").not.to.be.undefined;
        expect(compiledFileFound, "yul compiled file metadata collect failed").not.to.be.null;
        expect(compiledFileFound.length, "yul compiled file metadata collect failed").to.be.greaterThan(0);
        expect(compiledFileFound[0][0], "yul compiled file metadata invalid").to.be.include('mock2');
        expect(compiledFileFound[0][1], "yul compiled file metadata invalid").to.be.equal('test\\compiler-tests\\e2e-testing\\mock-compiled-code\\mock2\\mock2.yaml');
        expect(compiledByteCode, "Compilation corrupted").to.be.equal("3360005560a9806100116000396000f3fe6004358060e01c90816306fdde0314608457816395d89b41146084578163313ce56714609e57816318160ddd14609257816370a0823114608657508063a9059cbb146084578063dd62ed3e146084578063095ea7b314608457806323b872dd14608457806339509351146084578063a457c2d7146084576340c10f1914608457600080fd5b005b60010160005260206000f35b60015460005260206000f35b601260005260206000f3");
    })


});


