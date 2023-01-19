object "ContractObject" {
    code {
        // todo - add deploy variables
        sstore(0, caller())
        datacopy(0, dataoffset("RuntimeObject"),datasize("RuntimeObject"))
        return(0x0, datasize("RuntimeObject"))
    }

    object "RuntimeObject" {

        code{

            switch getSelector()



            case 0x00fdd58e /* balanceOf(address,uint256) */ {
                let ret := balanceOf(loadCallDataValueFromIndex(0),loadCallDataValueFromIndex(1))
                returnOneUint256(ret)
            }



            case 0x4e1273f4 /* balanceOfBatch(address[],uint256[]) */ {

                let arrayLength := loadCallDataValueFromIndex(div(loadCallDataValueFromIndex(0), 32))

                // Check if array lengths are zero or array lengths are different in length
                revertIfZero(arrayLength)
                revertIfNotEqual(arrayLength,loadCallDataValueFromIndex(div(loadCallDataValueFromIndex(1), 32)))

                // add the first value of the array to the memory
                let finalPointer :=initDynamicArray(0x0, startMemoryCopyDynamicArray1(), balanceOf(readDynamicArrayValue(0, 1),readDynamicArrayValue(1, 1)))
                for {let y := 2} lt(y,add(arrayLength,1)) { y:= add(y,1)} {
                    // push rest of the values to memory
                    finalPointer := push(0x0,balanceOf(readDynamicArrayValue(0, y),readDynamicArrayValue(1, y)))
                }
                // return data in memory
                return(0x0, finalPointer)
            }


            

            case 0xa22cb465 /* setApprovalForAll(address,bool) */ {
                    let approvingAddress := loadCallDataValueFromIndex(0)
                    let value := loadCallDataValueFromIndex(1)
                    approveForAll(approvingAddress, value)
                    emitApprovalForAll(0x00, caller(), approvingAddress, value)
            }




            case 0xe985e9c5 /* isApprovedForAll(address,address) */ {
                    let ret := isApprovedForAll(loadCallDataValueFromIndex(0),loadCallDataValueFromIndex(1))
                    returnOneUint256(ret)
            }



            case 0xf242432a /* safeTransferFrom(address,address,uint256,uint256,bytes) */ {
                    let from := loadCallDataValueFromIndex(0)
                    let to := loadCallDataValueFromIndex(1)
                    let id := loadCallDataValueFromIndex(2)
                    let amount := loadCallDataValueFromIndex(3)
                    let dataOffset := loadCallDataValueFromIndex(4)
                    checkIfSenderAuthorized(from)
                    safeTransferFrom( from, to, id, amount)
                    emitTransferSingle(0x0, caller(), from, to, id, amount)
                    _doSafeTransferAcceptanceCheck(caller(), from, to, id, amount, dataOffset )
            }

            case 0x2eb2c2d6 /* safeBatchTransferFrom(address,address,uint256[],uint256[],bytes) */ {
                let arrayLength := loadCallDataValueFromIndex(div(loadCallDataValueFromIndex(2), 32))

                // Check if array lengths are zero or array lengths are different in length
                revertIfZero(arrayLength)
                revertIfArrayLengthMismatch(arrayLength,loadCallDataValueFromIndex(div(loadCallDataValueFromIndex(3), 32)))

                let from := loadCallDataValueFromIndex(0)
                let to := loadCallDataValueFromIndex(1)
                checkIfToAddressIsZero(to)


                checkIfSenderAuthorized(from)

                // setup data to add two dynamic array to memory
                setupMetaDataToAddMultipleArraysToMemory(arrayLength)

                let finalIndex := 0x0

                // Copy two arrays to memory
                for {let y := 1} iszero(gt(y,arrayLength)) { y:= add(y,1)} {
                    let firstValue := readDynamicArrayValue(2, y)
                    let secondValue := readDynamicArrayValue(3, y)

                    // get first array data to memory
                    pop(pushToVirtualMemoryLocation(startMemoryCopyDynamicArray1(), startMemoryCopyDynamicArray1(), firstValue))

                    // get second array data to memory
                    finalIndex := pushToVirtualMemoryLocation(startMemoryCopyDynamicArray2(), startMemoryCopyDynamicArray1(), secondValue)

                    safeTransferFrom(from, to, firstValue, secondValue)
                }

                emitTransferBatch(startMemoryCopyDynamicArray1(), finalIndex,caller(), from, to)
                _doSafeBatchTransferAcceptanceCheck(caller(), from, to, loadCallDataValueFromIndex(4), arrayLength, finalIndex)

            }
            case 0x731133e9 /* mint(address,uint256,uint256,bytes) */ {
                let toAddress := loadCallDataValueFromIndex(0)
                revertIfZero(toAddress)
                let id := loadCallDataValueFromIndex(1)
                let amount := loadCallDataValueFromIndex(2)
                let dataOffset := loadCallDataValueFromIndex(3)

                let ret := mint(toAddress, id, amount)
                emitTransferSingle(0x0, caller(), 0x0, toAddress, id, amount)
                _doSafeTransferAcceptanceCheck(caller(), 0, toAddress, id, amount, dataOffset )
            }

            case 0x1f7fdffa /* mintBatch(address,uint256[],uint256[],bytes) */ {
                let arrayLength := loadCallDataValueFromIndex(div(loadCallDataValueFromIndex(1), 32))
                let toAddress := loadCallDataValueFromIndex(0)

                // Check if array lengths are zero or array lengths are different in length
                revertIfZero(arrayLength)
                revertIfZero(toAddress)
                revertIfNotEqual(arrayLength,loadCallDataValueFromIndex(div(loadCallDataValueFromIndex(2), 32)))

                // setup data to add two dynamic array to memory
                setupMetaDataToAddMultipleArraysToMemory(arrayLength)

                let finalIndex := 0x0


                for {let y := 1} iszero(gt(y,arrayLength)) { y:= add(y,1)} {
                    let tokenId := readDynamicArrayValue(1, y)
                    let amount := readDynamicArrayValue(2, y)

                    // get first array data to memory
                    pop(pushToVirtualMemoryLocation(startMemoryCopyDynamicArray1(), startMemoryCopyDynamicArray1(), tokenId))

                    // get second array data to memory
                    finalIndex := pushToVirtualMemoryLocation(startMemoryCopyDynamicArray2(), startMemoryCopyDynamicArray1(), amount)

                    pop(mint(toAddress, tokenId, amount))

                }
                emitTransferBatch(startMemoryCopyDynamicArray1(), finalIndex, caller(), 0x0, toAddress)
                _doSafeBatchTransferAcceptanceCheck(caller(), 0x00, toAddress, loadCallDataValueFromIndex(3), arrayLength, finalIndex)
            }
            case 0xf5298aca /* burn(address,uint256,uint256) */ {
                let fromAddress := loadCallDataValueFromIndex(0)
                let id := loadCallDataValueFromIndex(1)
                let amount := loadCallDataValueFromIndex(2)

                revertIfZero(fromAddress)
                revertIfZero(amount)

                let ret := burn(fromAddress, id, amount)
                emitTransferSingle(0x0, caller(), fromAddress, 0x0, id, amount)

            }
            case 0x6b20c454 /* burnBatch(address,uint256[],uint256[]) */ {
                let storedLocationIndex := div(loadCallDataValueFromIndex(1), 32)
                let arrayLength := loadCallDataValueFromIndex(storedLocationIndex)
                let fromAddress := loadCallDataValueFromIndex(0)


                revertIfZero(arrayLength)
                revertIfZero(fromAddress)
                revertIfNotEqual(arrayLength,loadCallDataValueFromIndex(div(loadCallDataValueFromIndex(2), 32)))

                // setup data to add two dynamic array to memory
                setupMetaDataToAddMultipleArraysToMemory(arrayLength)

                let finalIndex := 0x0

                // Copy two arrays to memory
                for {let y := 1} iszero(gt(y,arrayLength)) { y:= add(y,1)} {

                    let tokenId := readDynamicArrayValue(1, y)
                    let amount := readDynamicArrayValue(2, y)

                    // get first array data to memory
                    pop(pushToVirtualMemoryLocation(startMemoryCopyDynamicArray1(), startMemoryCopyDynamicArray1(), tokenId))

                    // get second array data to memory
                    finalIndex := pushToVirtualMemoryLocation(startMemoryCopyDynamicArray2(), startMemoryCopyDynamicArray1(), amount)

                    pop(burn(fromAddress, tokenId, amount))

                }
                emitTransferBatch(startMemoryCopyDynamicArray1(), finalIndex,caller(), fromAddress, 0x0)
            }

            case 0x01ffc9a7 /* supportsInterface(bytes4) */ {

            }

            default {
                revert(0,0)
            }



            //================= Storage, Memory index functions =================================
            function getOwnerIndex() -> owner {
                owner := 0
            }
            function startMemoryCopyDynamicArray1() -> idx {
                idx := 0xc0
            }
            function startMemoryCopyDynamicArray2() -> idx {
                idx := 0xe0
            }
            function nonceForBalanceOf() -> nonce {
                nonce := 1
            }
            function nonceOperatorApprovals() -> nonce {
                nonce := 2
            }


            //================= Util functions =================================

            /*
                Get the inital 32 bytes from the calldata and right shift it 28 bytes as the first 4 bytes represent the selector
            */
            function getSelector() -> selector {
                // 1 followed by 56 zeros
                selector :=div(calldataload(0), 0x100000000000000000000000000000000000000000000000000000000)
            }

            function returnOneUint256( value ) {
                mstore( 0x0, value)
                return (0x0,0x20)
            }

            function loadCallDataValueFromIndex(offset) -> val {
                let position := add( 4, mul( offset, 0x20))
                if lt(calldatasize(), add(position, 0x20)) {
                 revert(0, 0)
                }
                val := calldataload(position)
            }

            /*
                read the value of the array when given the array and the index in the array to read
                if zeroth position is the array in calldata(reference to the array), positionInCallData would be 0

             */
            function readDynamicArrayValue(positionInCallData, index) -> val {
                let storedLocationIndex := div(loadCallDataValueFromIndex(positionInCallData), 32)
                let arrayLength := loadCallDataValueFromIndex(div(storedLocationIndex, 32))

                val := loadCallDataValueFromIndex(add(storedLocationIndex,index))
            }

            /**
            * Use to initialize an dynamic array
            * memPointerIndex - initial index of the array which stores the memory address of the length
            * memPointerValue - this is the memory pointer address where the length of the dynamic array is stored
            * value - storing initial value
            * (finalPointer) - furthest index in memory which is used by the array
            **/

            function initDynamicArray(memPointerIndex, memPointerValue, value ) -> finalPointer {
                 if iszero(iszero(mload(memPointerIndex))) {
                    revert(0,0)
                 }
                 if iszero(iszero(mload(memPointerValue))) {
                     revert(0,0)
                 }
                mstore(memPointerIndex, memPointerValue)
                mstore(memPointerValue, 1)
                finalPointer := add(memPointerValue, 32)
                mstore(add(memPointerValue, 32), value)
                finalPointer := add(finalPointer, 32)
            }

            /**
            * memPointerIndex: initial index of the array which stores the memory address of the length
            * value: storing initial value
            * (finalPointer) - furthest index in memory which is used by the array
            **/

            function push(memPointerIndex, value) -> finalPointer {
                let memPointerValue := mload(memPointerIndex)
                let newArrayLength :=  add(mload(memPointerValue), 1)
                mstore(memPointerValue, newArrayLength)
                finalPointer := add(memPointerValue, mul(newArrayLength, 32))
                mstore(finalPointer, value)
                finalPointer := add(finalPointer, 32)

            }
            /**
                Push to a memory location forming a virtual memory with position zero
                memPointerIndex: start location in the main memory
                distanceToMemory: distance to the virtual memory in main memory
                value: value to push to memory
            */
            function pushToVirtualMemoryLocation(memPointerIndex, distanceToMemory, value) -> finalPointer {
                let memPointerValue := add(mload(memPointerIndex), distanceToMemory)
                let newArrayLength :=  add(mload(memPointerValue), 1)
                mstore(memPointerValue, newArrayLength)
                finalPointer := add(memPointerValue, mul(newArrayLength, 32))
                mstore(finalPointer, value)
                finalPointer := add(finalPointer, 0x20)

            }



            function setupMetaDataToAddMultipleArraysToMemory(arrayLength) {

                // set the free memory locations where the arrays can propagate from
                // startIndexFirstArray - 0xc0
                // startIndexSecondArray - 0xe0

                // fill up the memory locations to store the length values of arrays
                mstore(startMemoryCopyDynamicArray1(), 0x40)
                mstore(startMemoryCopyDynamicArray2(), add(0x60, mul(0x20,arrayLength)))

            }

            /**
                Gives the keccak256 values of 3, 32 bytes words
                Memory pointer values are dedicated for the hash store
            */
            function getHashValue( attr1, attr2, attr3) -> ret{
                mstore(0x60,attr1)
                mstore(0x80,attr2)
                mstore(0xa0,attr3)

                ret := keccak256(0x60,0x60)
            }

            function addBytesToMemory(dataOffset, lengthPositionIndex) -> finalIndex {

                let dataLength := loadCallDataValueFromIndex(div(dataOffset, 32))
                let dataLengthInBytes := mul(loadCallDataValueFromIndex(div(dataOffset, 32)), 0x20)
                let initialCallDataPosition := add(dataOffset,4)


                mstore(lengthPositionIndex, dataLength)
                finalIndex := add(lengthPositionIndex,0x20)


                for {let y:= 0x20} iszero(gt(y,dataLengthInBytes)) {y:= add(y,0x20)} {
                      mstore(finalIndex, calldataload(add(initialCallDataPosition, y)))
                      finalIndex := add(finalIndex,0x20)
                }

            }




            //================= log functions =================================

            function emitTransferSingle(memoryStartIndex, operator, from, to, id, value){
                mstore(memoryStartIndex, id)
                mstore(add(0x20, memoryStartIndex), value)

             // ----TransferSingle(address,address,address,uint256,uint256) -----
                let signature:= 0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62
                emitLog4(memoryStartIndex, 0x40,signature, operator, from, to)
            }
            function emitTransferBatch(memoryStartIndex, memoryEndIndex, operator, from, to){

               // ---TransferBatch(address,address,address,uint256[],uint256[]) ---
                let signature:= 0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb
                emitLog4(memoryStartIndex, sub(memoryEndIndex, memoryStartIndex), signature, operator, from, to)

            }
            function emitApprovalForAll(memoryStartIndex, account, operator, approved){
                mstore(memoryStartIndex, approved)
             // ----- ApprovalForAll(address,address,bool) ----------
                let signature:= 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31
                emitLog3(memoryStartIndex, 0x20, signature, account, operator)
            }
            function emitURI(memoryStartIndex ){
            //todo
            }

            /**
                debug log used to debug in testing and development
            */
            function debugStack(value1, value2) {
                let signature := 0x46bd45ccd3bc364549b4235d6adb87cf5c141b730e451b8d46bdf012cdfeba30
                emitLog3(0, 0, signature, value1, value2)
            }
            function debugMemoryAndStack(stackVal1, stackVal2, memValue1, memValue2) {
                let signature := 0x46bd45ccd3bc364549b4235d6adb87cf5c141b730e451b8d46bdf012cdfeba30
                emitLog3(memValue1, memValue2, signature,stackVal1, stackVal2)
            }

            function emitLog4(memoryStartIndex, offset, signature, t2, t3, t4){
                log4(memoryStartIndex, offset, signature, t2, t3, t4)
            }
            function emitLog3(memoryStartIndex, offset, signature, t2, t3){
                log3(memoryStartIndex, offset, signature, t2, t3)
            }
            function emitLog2(memoryStartIndex, offset, signature, t2){
                log2(memoryStartIndex, offset, signature, t2)
            }
            //================= Error functions =================================
            function revertIfZero(amount) {
                if eq(amount,0) {
                    revert(0,0)
                }
            }
            function checkIfToAddressIsZero(addr){
                if eq(addr,0) {
                    revertWithTransferToZeroAddress()
                }
            }
            function revertIfNotEqual(amount1, amount2) {
                if iszero(eq(amount1,amount2)) {
                    revert(0,0)
                }
            }

            function revertIfArrayLengthMismatch(value1, value2){
                if iszero(eq(value1, value2)) {
                    revertWithAccountAndIdLengthMismatch()
                }
            }
            function revertIfEqual(amount1, amount2) {
                            if eq(amount1,amount2) {
                                revert(0,0)
                            }
                        }
            function onlyOwner() {
                if iszero(eq(caller(),sload(0))) {
                    revert(0,0)
                }
            }

            /*  revert("ERC1155: transfer to non-ERC1155Receiver implementer"); */
            function revertWithNonErc1155ReceiverImplementer() {
               mstore(0x00, 0x8c379a000000000000000000000000000000000000000000000000000000000)
               mstore(0x04,0x0000000000000000000000000000000000000000000000000000000000000020)
               mstore(0x24,0x0000000000000000000000000000000000000000000000000000000000000034)
               mstore(0x44,0x455243313135353a207472616e7366657220746f206e6f6e2d45524331313535)
               mstore(0x64,0x526563656976657220696d706c656d656e746572000000000000000000000000)
               revert(0,0x84)
            }

             /*  revert("ERC1155: ERC1155Receiver rejected tokens"); */
            function revertWithERC1155ReceiverRejectedTokens() {
               mstore(0x00, 0x8c379a000000000000000000000000000000000000000000000000000000000)
               mstore(0x04,0x0000000000000000000000000000000000000000000000000000000000000020)
               mstore(0x24,0x0000000000000000000000000000000000000000000000000000000000000028)
               mstore(0x44,0x455243313135353a204552433131353552656365697665722072656a65637465)
               mstore(0x64,0x6420746f6b656e73000000000000000000000000000000000000000000000000)
               revert(0,0x84)
            }

            /* require("ERC1155: address zero is not a valid owner") */
            function revertWithAddressZeroIsNotAValidOwner() {
               mstore(0x00, 0x8c379a000000000000000000000000000000000000000000000000000000000)
               mstore(0x04,0x0000000000000000000000000000000000000000000000000000000000000020)
               mstore(0x24,0x000000000000000000000000000000000000000000000000000000000000002a)
               mstore(0x44,0x455243313135353a2061646472657373207a65726f206973206e6f7420612076)
               mstore(0x64,0x616c6964206f776e657200000000000000000000000000000000000000000000)
               revert(0,0x84)
            }
            /* require("ERC1155: accounts and ids length mismatch") */
            function revertWithAccountAndIdLengthMismatch() {
               mstore(0x00, 0x8c379a000000000000000000000000000000000000000000000000000000000)
               mstore(0x04,0x0000000000000000000000000000000000000000000000000000000000000020)
               mstore(0x24,0x0000000000000000000000000000000000000000000000000000000000000029)
               mstore(0x44,0x455243313135353a206163636f756e747320616e6420696473206c656e677468)
               mstore(0x64,0x206d69736d617463680000000000000000000000000000000000000000000000)
               revert(0,0x84)
            }
            /* require("ERC1155: caller is not token owner or approved") */
            function revertWithCallerIsNotOwnerOrApproved() {
               mstore(0x00, 0x8c379a000000000000000000000000000000000000000000000000000000000)
               mstore(0x04,0x0000000000000000000000000000000000000000000000000000000000000020)
               mstore(0x24,0x000000000000000000000000000000000000000000000000000000000000002e)
               mstore(0x44,0x455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e)
               mstore(0x64,0x6572206f7220617070726f766564000000000000000000000000000000000000)
               revert(0,0x84)
            }
            /* require("ERC1155: transfer to the zero address") */
            function revertWithTransferToZeroAddress() {
               mstore(0x00, 0x8c379a000000000000000000000000000000000000000000000000000000000)
               mstore(0x04,0x0000000000000000000000000000000000000000000000000000000000000020)
               mstore(0x24,0x0000000000000000000000000000000000000000000000000000000000000025)
               mstore(0x44,0x455243313135353a207472616e7366657220746f20746865207a65726f206164)
               mstore(0x64,0x6472657373000000000000000000000000000000000000000000000000000000)
               revert(0,0x84)

            }

            /* require("ERC1155: insufficient balance for transfer") */
            function revertWithInsufficientBalanceToTransfer() {
               mstore(0x00, 0x8c379a000000000000000000000000000000000000000000000000000000000)
               mstore(0x04,0x0000000000000000000000000000000000000000000000000000000000000020)
               mstore(0x24,0x000000000000000000000000000000000000000000000000000000000000002a)
               mstore(0x44,0x455243313135353a20696e73756666696369656e742062616c616e636520666f)
               mstore(0x64,0x72207472616e7366657200000000000000000000000000000000000000000000)
               revert(0,0x84)
            }

            /* require("ERC1155: mint to the zero address") */
            function revertWithMintToZeroAddress() {
               mstore(0x00, 0x8c379a000000000000000000000000000000000000000000000000000000000)
               mstore(0x04,0x0000000000000000000000000000000000000000000000000000000000000020)
               mstore(0x24,0x0000000000000000000000000000000000000000000000000000000000000021)
               mstore(0x44,0x455243313135353a206d696e7420746f20746865207a65726f20616464726573)
               mstore(0x64,0x7300000000000000000000000000000000000000000000000000000000000000)
               revert(0,0x84)
            }
             /* require("ERC1155: burn from the zero address") */
            function revertWithBurnFromZeroAddress() {
               mstore(0x00, 0x8c379a000000000000000000000000000000000000000000000000000000000)
               mstore(0x04,0x0000000000000000000000000000000000000000000000000000000000000020)
               mstore(0x24,0x0000000000000000000000000000000000000000000000000000000000000023)
               mstore(0x44,0x455243313135353a206275726e2066726f6d20746865207a65726f2061646472)
               mstore(0x64,0x6573730000000000000000000000000000000000000000000000000000000000)
               revert(0,0x84)
            }
             /* require("ERC1155: burn amount exceeds balance") */
            function revertWithBurnAmountExceedBalance() {
               mstore(0x00, 0x8c379a000000000000000000000000000000000000000000000000000000000)
               mstore(0x04,0x0000000000000000000000000000000000000000000000000000000000000020)
               mstore(0x24,0x0000000000000000000000000000000000000000000000000000000000000024)
               mstore(0x44,0x455243313135353a206275726e20616d6f756e7420657863656564732062616c)
               mstore(0x64,0x616e636500000000000000000000000000000000000000000000000000000000)
               revert(0,0x84)
            }

            /* require("ERC1155: setting approval status for self") */
            function revertWithSettingApprovalStatusForSelf() {
               mstore(0x00, 0x8c379a000000000000000000000000000000000000000000000000000000000)
               mstore(0x04,0x0000000000000000000000000000000000000000000000000000000000000020)
               mstore(0x24,0x0000000000000000000000000000000000000000000000000000000000000029)
               mstore(0x44,0x455243313135353a2073657474696e6720617070726f76616c20737461747573)
               mstore(0x64,0x20666f722073656c660000000000000000000000000000000000000000000000)
               revert(0,0x84)
            }

            function checkIfSenderAuthorized(from) {
               if iszero(eq(caller(), from)) {
                   // check if the msg.sender and from address is different, whether from address in approved for the operation
                   if iszero(isApprovedForAll(from, caller())) {
                       revertWithCallerIsNotOwnerOrApproved()
                   }
               }
            }


            //================= logic functions =================================

            function balanceOf(addr, tokenId) -> val {
                revertIfZero(addr)
                revertIfZero(tokenId)
                let hash := getHashValue(addr, tokenId, 1)
                val := sload(hash)
            }

            function mint(sender, tokenId, amount ) -> bool {
                revertIfZero(sender)
                revertIfZero(amount)
                let hash := getHashValue(sender, tokenId, nonceForBalanceOf())
                let val := sload(hash)
                sstore(hash, add(val, amount))
                bool := 1

            }

            function burn(sender, tokenId, amount ) -> bool {
                let hash := getHashValue(sender, tokenId, nonceForBalanceOf())
                let val := sload(hash)
                if gt(amount, val) {
                    revert(0,0)
                }
                sstore(hash, sub(val, amount))
                bool := 1
            }

            function approveForAll(operator, value) {
                 revertIfZero(operator)
                 revertIfEqual(caller(), operator)
                 let hash := getHashValue( caller(), operator, nonceOperatorApprovals())
                 sstore(hash, value)
            }

            function isApprovedForAll(account, operator) -> ret {
                 let hash := getHashValue(account, operator, nonceOperatorApprovals())
                 ret := sload(hash)
            }

            function safeTransferFrom(from, to, id, amount) {


                let fromHash := getHashValue(from, id, nonceForBalanceOf())
                let toHash := getHashValue(to, id, nonceForBalanceOf())

                let fromBalance := sload(fromHash)
                let toBalance := sload(toHash)

                // underflow check - overflow check is not considered due to low possibility
                if lt(fromBalance,amount) {
                    revertWithInsufficientBalanceToTransfer()
                }
                sstore(fromHash, sub(fromBalance,amount))
                sstore(toHash, add(toBalance,amount))

            }

            function _doSafeTransferAcceptanceCheck(operator, from, to, id, amount, dataOffset) {

                mstore(0x00,0xf23a6e61)
                mstore(0x20,operator)
                mstore(0x40,from)
                mstore(0x60,id)
                mstore(0x80,amount)
                mstore(0xa0,0xc0)

                let finalIndex := addBytesToMemory(dataOffset, 0xc0)

                if extcodesize(to){
                    let success := call(gas(), to, 0, 0x1c , sub(finalIndex,28),0x00, 0x04)
                    if iszero(success) {
                        mstore(0x00, 0x8c379a000000000000000000000000000000000000000000000000000000000)
                        returndatacopy(0x0, 0x0, returndatasize())
                        revert(0x00, returndatasize())
                    }
                    let response := and(mload(0x00), 0xffffffff00000000000000000000000000000000000000000000000000000000)
                    if iszero(eq(response,mul(0xf23a6e61,0x100000000000000000000000000000000000000000000000000000000))) {
                           revertWithERC1155ReceiverRejectedTokens()
                    }
                 debugMemoryAndStack(mload(0x00), success, 0x1c, sub(finalIndex,28))
                }
            }

            function _doSafeBatchTransferAcceptanceCheck(operator, from, to, data, arrayLength, freeIndex) {

                mstore(0x00,0xbc197c81)
                mstore(0x20,operator)
                mstore(0x40,from)

                mstore(0x60, add(mload(startMemoryCopyDynamicArray1()),0xa0))
                mstore(0x80, add(mload(startMemoryCopyDynamicArray2()),0xa0))
                mstore(0xa0, freeIndex)

                let finalIndex := addBytesToMemory(data, freeIndex)

                if extcodesize(to){
                    let success := call(gas(), to, 0, 0x1c , sub(finalIndex,28),0x00, 0x04)
                    if iszero(success) {
                        mstore(0x00, 0x8c379a000000000000000000000000000000000000000000000000000000000)
                        returndatacopy(0x0, 0x0, returndatasize())
                        revert(0x00, returndatasize())
                    }
                    let response := and(mload(0x00), 0xffffffff00000000000000000000000000000000000000000000000000000000)
                    if iszero(eq(response,mul(0xbc197c81,0x100000000000000000000000000000000000000000000000000000000))) {
                           revertWithERC1155ReceiverRejectedTokens()
                    }
                 debugMemoryAndStack(mload(0x00), success, 0x1c, sub(finalIndex,28))
                }

            }


        }




    }
}