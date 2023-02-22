import {HardhatUserConfig, task} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import {
  compileAll,
  loadYulIgnore,
  readYamlConfig
} from "./yul-compiler";
// import {subtask} from "hardhat/src/internal/core/config/config-env";
import {TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS} from "hardhat/src/builtin-tasks/task-names";
import {getAllFilesMatching} from "hardhat/src/internal/util/fs-utils";
import {Compiler, NativeCompiler} from "hardhat/internal/solidity/compiler";


task("compile", "Compile yul codes in .yul files", async (taskArg, hre,runSuper) => {
  await runSuper();
  const COMPILER_CONFIG = readYamlConfig("yul-config.yaml");
  const YUL_IGNORE_FILES = loadYulIgnore(COMPILER_CONFIG.pathToYulIgnore);
  await compileAll(hre.config.paths.sources, COMPILER_CONFIG.inputFileExtension,COMPILER_CONFIG.outputFileExtension, COMPILER_CONFIG, YUL_IGNORE_FILES);

})


// subtask(
//     TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS,
//     async (_, { config }): Promise<string[]> => {
//       const paths = await getAllFilesMatching(config.paths.sources, (f) =>
//           f.endsWith(".sol")
//       );
//
//       return paths;
//     }
// );

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      // chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};

export default config;
