import {expect} from "chai";
import {readYamlConfig} from "../../../yul-compiler";

describe('Read Config Yaml', function () {
    let COMPILER_CONFIG: any;
    const path = './yul-config.yaml';
    it('Successfully reading Yaml',()=>{
        COMPILER_CONFIG = readYamlConfig(path);
    })
    after(()=>{
        expect(COMPILER_CONFIG, "Possible Parse Exceptions").not.to.be.undefined;
        expect(COMPILER_CONFIG, "Possible Parse Exceptions").not.to.be.null;
    })
});

describe('Read Root path from config', function () {
    let COMPILER_CONFIG: any;
    const path = './yul-config.yaml';
    it('read root path',()=>{
        COMPILER_CONFIG = readYamlConfig(path);
    })
    after(()=>{
        expect(COMPILER_CONFIG.rootPath, "root path is not defined").not.to.be.undefined;
        expect(COMPILER_CONFIG.rootPath, "root path is not defined").not.to.be.null;
    })
});

describe('Read yul ignore file path', function () {
    let COMPILER_CONFIG: any;
    const path = './yul-config.yaml';
    it('read yul ignore path',()=>{
        COMPILER_CONFIG = readYamlConfig(path);
    })
    after(()=>{
        expect(COMPILER_CONFIG.pathToYulIgnore, "yul ignore is not defined").not.to.be.undefined;
        expect(COMPILER_CONFIG.pathToYulIgnore, "yul ignore is not defined").not.to.be.null;
    })
});


describe('Read compiled output file path', function () {
    let COMPILER_CONFIG: any;
    const path = './yul-config.yaml';
    it('read compiled output file path',()=>{
        COMPILER_CONFIG = readYamlConfig(path);
    })
    after(()=>{
        expect(COMPILER_CONFIG.pathToYulIgnore, "compiled output path is not defined").not.to.be.undefined;
        expect(COMPILER_CONFIG.pathToYulIgnore, "compiled output path is not defined").not.to.be.null;
    })
});