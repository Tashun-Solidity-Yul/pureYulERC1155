import {describe} from "mocha";
import {
    compileAll,
    compileASingleFileToBinaryCode,
    compileSelected,
    findAFile, getFilteredByteCode,
} from "../../../yul-compiler";
import {expect} from "chai";




describe('Compile all yul files and get the binaries', () => {
    const savePath = '.\\test\\compiler-tests\\integrationTests\\mock-compiled-code';
    const startPath = '.\\test\\compiler-tests\\integrationTests';
    const inputFileExtension = 'yul';
    const outputFileExtension = 'yaml';

    let compiledFile1Found: any;
    let compiledFile2Found: any;

    it('read yul ignore file', async () => {
        await compileAll(startPath, inputFileExtension, outputFileExtension,{savePath}, null);
        compiledFile1Found = findAFile(startPath, 'mock', 'yaml', null, null);
        compiledFile2Found = findAFile(startPath, 'mock2', 'yaml', null, null);
    })
    after(() => {
        expect(compiledFile1Found, "yul compiled file metadata collect failed").not.to.be.undefined;
        expect(compiledFile1Found, "yul compiled file metadata collect failed").not.to.be.null;
        expect(compiledFile1Found.length, "yul compiled file metadata collect failed").to.be.greaterThan(0);
        expect(compiledFile1Found[0][0], "yul compiled file metadata invalid").to.be.include('mock');
        expect(compiledFile1Found[0][1], "yul compiled file metadata invalid").to.be.equal('test\\compiler-tests\\integrationTests\\mock-compiled-code\\mock\\mock.yaml');

        expect(compiledFile2Found, "yul compiled file metadata collect failed").not.to.be.undefined;
        expect(compiledFile2Found, "yul compiled file metadata collect failed").not.to.be.null;
        expect(compiledFile2Found.length, "yul compiled file metadata collect failed").to.be.greaterThan(0);
        expect(compiledFile2Found[0][0], "yul compiled file metadata invalid").to.be.include('mock');
        expect(compiledFile2Found[0][1], "yul compiled file metadata invalid").to.be.equal('test\\compiler-tests\\integrationTests\\mock-compiled-code\\mock2\\mock2.yaml');
    })
});



describe('Compile a yul file and get the binary (given the filename and path)', () => {
    const fileName = 'mock';
    const path = '.\\test\\compiler-tests\\integrationTests\\integration-test-mock-data\\mock.yul';
    const savePath = '.\\test\\compiler-tests\\integrationTests\\mock-compiled-code';
    const outputFileExtension = 'yaml';
    let compiledFileFound: any;
    const startPath = '.\\test\\compiler-tests\\integrationTests';
    it('read yul ignore file', async () => {
        await compileASingleFileToBinaryCode(fileName, outputFileExtension, path, savePath);
        compiledFileFound = findAFile(startPath, 'mock', 'yaml', null, null);
    })
    after(() => {
        expect(compiledFileFound, "yul compiled file metadata collect failed").not.to.be.undefined;
        expect(compiledFileFound, "yul compiled file metadata collect failed").not.to.be.null;
        expect(compiledFileFound.length, "yul compiled file metadata collect failed").to.be.greaterThan(0);
        expect(compiledFileFound[0][0], "yul compiled file metadata invalid").to.be.include('mock');
        expect(compiledFileFound[0][1], "yul compiled file metadata invalid").to.be.equal('test\\compiler-tests\\integrationTests\\mock-compiled-code\\mock\\mock.yaml');
    })
});

describe('Compile a yul file and get the binary  (given the filename and extension)', () => {
    const fileName = 'mock';
    const savePath = '.\\test\\compiler-tests\\integrationTests\\mock-compiled-code';
    let compiledFileFound: any;
    const startPath = '.\\test\\compiler-tests\\integrationTests';
    const inputFileExtension = 'yul';
    const outputFileExtension = 'yaml';
    it('read yul ignore file', async () => {
        await compileSelected(startPath, fileName, inputFileExtension, outputFileExtension, {savePath}, null);
        compiledFileFound = findAFile(startPath, fileName, 'yaml', null, null);
    })
    after(() => {
        expect(compiledFileFound, "yul compiled file metadata collect failed").not.to.be.undefined;
        expect(compiledFileFound, "yul compiled file metadata collect failed").not.to.be.null;
        expect(compiledFileFound.length, "yul compiled file metadata collect failed").to.be.greaterThan(0);
        expect(compiledFileFound[0][0], "yul compiled file metadata invalid").to.be.include('mock');
        expect(compiledFileFound[0][1], "yul compiled file metadata invalid").to.be.equal('test\\compiler-tests\\integrationTests\\mock-compiled-code\\mock\\mock.yaml');
    })
});

describe('Read the compiled code',async ()=> {
    const fileName = 'mock';
    const savePath = '.\\test\\compiler-tests\\integrationTests\\mock-compiled-code';
    let compiledFileFound: any;
    let compiledByteCode: any;
    const startPath = '.\\test\\compiler-tests\\integrationTests';
    const inputFileExtension = 'yul';
    const outputFileExtension = 'yaml';
    it('read yul ignore file', async () => {
        await compileSelected(startPath, fileName, inputFileExtension, outputFileExtension,{savePath}, null);
        compiledFileFound = findAFile(startPath, fileName, 'yaml', null, null);
        compiledByteCode = getFilteredByteCode(compiledFileFound[0][1])
    })
    after(() => {
        expect(compiledFileFound, "yul compiled file metadata collect failed").not.to.be.undefined;
        expect(compiledFileFound, "yul compiled file metadata collect failed").not.to.be.null;
        expect(compiledFileFound.length, "yul compiled file metadata collect failed").to.be.greaterThan(0);
        expect(compiledFileFound[0][0], "yul compiled file metadata invalid").to.be.include('mock');
        expect(compiledFileFound[0][1], "yul compiled file metadata invalid").to.be.equal('test\\compiler-tests\\integrationTests\\mock-compiled-code\\mock\\mock.yaml');
        expect(compiledByteCode, "Compilation corrupted").to.be.equal("3360005561271060205560a9806100176000396000f3fe6004358060e01c90816306fdde0314608457816395d89b41146084578163313ce56714609e57816318160ddd14609257816370a0823114608657508063a9059cbb146084578063dd62ed3e146084578063095ea7b314608457806323b872dd14608457806339509351146084578063a457c2d7146084576340c10f1914608457600080fd5b005b60010160005260206000f35b60015460005260206000f35b601260005260206000f3");
    })
})

