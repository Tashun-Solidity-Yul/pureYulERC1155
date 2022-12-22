object "ContractObject" {
    code {
        sstore(0, caller())
        datacopy(0, dataoffset("RuntimeObject"),datasize("RuntimeObject"))
        return(0x0, datasize("RuntimeObject"))
    }

    object "RuntimeObject" {

        code{

            switch getSelector()
            case 0x186f2b64 /* balanceOf(address,uint256) */ {

            }
            case 0x4e1273f4 /* balanceOfBatch(address[],uint256[]) */ {

            }

            case 0xa22cb465 /* setApprovalForAll(address,bool) */ {

            }

            case 0xe985e9c5 /* isApprovedForAll(address,address) */ {

            }

            case 0xf242432a /* safeTransferFrom(address,address,uint256,uint256,bytes) */ {

            }

            case 0x2eb2c2d6 /* safeBatchTransferFrom(address,address,uint256[],uint256[],bytes) */ {
                let storedLocationIndex := div(loadCallDataValue(2), 32)
                let arrayLength := loadCallDataValue(div(storedLocationIndex, 32))

                for {let y := 1} iszero(gt(y,arrayLength)) { y:= add(y,1)} {
                    debugStack(loadCallDataValue(arrayLength),loadCallDataValue(add(storedLocationIndex,y)))
                }
                //debugStack(loadCallDataValue(0),loadCallDataValue(1))
                //debugStack(loadCallDataValue(2),loadCallDataValue(3))
                //debugStack(loadCallDataValue(4),loadCallDataValue(5))
                //debugStack(loadCallDataValue(6),loadCallDataValue(7))
                //debugStack(loadCallDataValue(div(storedLocation, 32)),loadCallDataValue(0))
            }
            case 0x731133e9 /* mint(address,uint256,uint256,bytes) */ {

            }
            case 0x1f7fdffa /* mintBatch(address,uint256[],uint256[],bytes) */ {

            }
            case 0xf5298aca /* burn(address,uint256,uint256) */ {

            }
            case 0x6b20c454 /* burnBatch(address,uint256[],uint256[]) */ {

            }
            case 0x7f2c00d3 /* doSafeTransferAcceptanceCheck(address,address,address,uint256,uint256,bytes) */ {

            }
            case 0x395649f6 /* doSafeBatchTransferAcceptanceCheck(address,address,address,uint256[],uint256[],bytes) */ {

            }

            case 0x01ffc9a7 /* supportsInterface(bytes4) */ {

            }
            case 0xca160684 /*  test(uint256[]) */ {
                //mstore(0x0, 0x20)
                //mstore(0x20, 2)
                //mstore(0x40, 100)
                //mstore(0x60, 200)
                let finalPointer :=initDynamicArray(0x0, 0x80, 100)
                finalPointer := push(0x0, 5)
                return(0x0, finalPointer)

            }

            default {
                revert(0,0)
            }



            //================= Storage functions =================================
            function getOwnerIndex() -> owner {
                owner := 0
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

            function loadCallDataValue(offset) -> val {
                let position := add( 4, mul( offset, 0x20))
                if lt(calldatasize(), add(position, 0x20)) {
                 revert(0, 0)
                }
                val := calldataload(position)
            }

            function readDynamicArrayValue(positionInCallData, index) {
                let storedLocationIndex := div(loadCallDataValue(positionInCallData), 32)
                let arrayLength := loadCallDataValue(div(storedLocationIndex, 32))

                //for {let y := 1} iszero(gt(y,arrayLength)) { y:= add(y,1)} {
                //    debugStack(loadCallDataValue(arrayLength),loadCallDataValue(add(storedLocationIndex,y)))
                //}
                debugStack(loadCallDataValue(arrayLength),loadCallDataValue(add(storedLocationIndex,index)))
            }

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

            function push(memPointerIndex, value) -> finalPointer {
                let memPointerValue := mload(memPointerIndex)
                let newArrayLength :=  add(mload(memPointerValue), 1)
                mstore(memPointerValue, newArrayLength)
                finalPointer := add(memPointerValue, mul(newArrayLength, 32))
                mstore(finalPointer, value)
                finalPointer := add(finalPointer, 32)

            }

            //================= log functions =================================

            function emitTransferSingle(memoryStartIndex, operator, from, to, id, value){
                mstore(memoryStartIndex, id)
                mstore(add(0x20, memoryStartIndex), value)
             // ----TransferSingle(address,address,address,uint256,uint256) -----
                let signature:= 0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62
                emitLog4(memoryStartIndex, add(0x40, memoryStartIndex),signature, operator, from, to)
            }
            function emitTransferBatch(memoryStartIndex, operator, from, to, ids, values){
                //todo
                //   emitLog4(memoryStartIndex, add( 0x40, memoryStartIndex), operator, from, to)
            }
            function emitApprovalForAll(memoryStartIndex, account, operator, approved){
                mstore(memoryStartIndex, approved)
             // ----- ApprovalForAll(address,address,bool) ----------
                let signature:= 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31
                emitLog3(memoryStartIndex, add(0x20, memoryStartIndex), signature, account, operator)
            }
            function emitURI(memoryStartIndex ){
            //todo
            }
            function debugMemory(start, end) {
                log0(start, end)
            }
            function debugStack(value1, value2) {
                let signature := 0x46bd45ccd3bc364549b4235d6adb87cf5c141b730e451b8d46bdf012cdfeba30
                emitLog3(0, 0, signature, value1, value2)
            }

            function emitLog4(memoryStartIndex, memoryEndIndex, signature, t2, t3, t4){
                log4(memoryStartIndex, memoryEndIndex, signature, t2, t3, t4)
            }
            function emitLog3(memoryStartIndex, memoryEndIndex, signature, t2, t3){
                log3(memoryStartIndex, memoryEndIndex, signature, t2, t3)
            }
            function emitLog2(memoryStartIndex, memoryEndIndex, signature, t2){
                log2(memoryStartIndex, memoryEndIndex, signature, t2)
            }

            //================= logic functions =================================



        }




    }
}