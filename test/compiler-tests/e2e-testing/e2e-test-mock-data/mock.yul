object "ERC20" {
    code {
        sstore(0, caller())
        sstore(0x20, 10000)
        datacopy(0, dataoffset("Code"),datasize("Code"))
        return(0x0, datasize("Code"))
    }

    object "Code" {
            code {




                    switch getSelector()
                    case 0x06fdde03 /* name() */ {

                    }
                    case 0x95d89b41 /* symbol() */ {

                    }
                    case 0x313ce567 /* decimals() */ {
                        decimals()
                    }
                    case 0x18160ddd /* totalSupply() */ {
                        totalSupply()
                    }

                    case 0x70a08231 /*balanceOf(address)*/ {
                        balanceOf(loadCallDataValue(0))
                    }

                    case 0xa9059cbb /*transfer(address,uint256)*/ {
                        transfer(loadCallDataValue(0),loadCallDataValue(1))
                    }
                    case 0xdd62ed3e /*allowance(address,address)*/ {

                    }
                     case 0x095ea7b3 /*approve(address,uint256)*/ {

                    }
                     case 0x23b872dd /*transferFrom(address,address,uint256)*/ {

                    }
                     case 0x39509351 /*increaseAllowance(address,uint256)*/ {

                    }
                     case 0xa457c2d7 /*decreaseAllowance(address,uint256)*/ {

                    }
                    case 0x40c10f19 /* "mint(address,uint256)" */ {

                    }
                     default {
                        revert(0,0)
                    }
//  ------------------------------------------------------------------------------------------------------------


                    function decimals() {
                        mstore(0x0, 18)
                        return (0x0, 0x20)
                    }

                    function totalSupply() {
                        mstore(0x0, sload(getTotalSupplyIndex()))
                        return (0x0, 0x20)
                    }

                    function balanceOf(addr) {
                        mstore(0x0,getBalancesIndex(addr))
                        return(0x0,0x20)
                    }

                    function transfer(to, amount) {

                    }


//  ----------------------------------- Call Data utils -------------------------------------------------------------------------




                function loadCallDataValue(idx) -> val {
                    let position := add( 4, mul( idx, 0x20))
                    val := calldataload(position)
                }

                function getSelector() -> selector {
                    selector :=div(loadCallDataValue(0), 0x100000000000000000000000000000000000000000000000000000000)
                }


                function returnOneUint256( value ) -> val {
                    mstore( 0x0, value)
                    return (0x0,0x20)
                }


        /* -------- events ---------- */
        function log1event(){
            // Transfer(address,address,uint256)
            //let signature := 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef;
        }


        /* -------- storage layout ---------- */
        function getOwnerIndex() -> p { p := 0}
        function getTotalSupplyIndex() -> p {p := 1}
        function getNameIndex() -> p { p:= 2}
        function getSymbolIndex() -> p { p:= 3}


        /* -------- storage access ---------- */
        function getBalancesIndex(addr) -> idx {
            idx := add(addr,0x1)
        }
        // there is only one address hashing hence the nonce is removed
        function getAllowanceIndex(addr1, addr2) -> idx {
            idx := getKeccack256Hash(addr1,addr2)
        }


        /* ---------- utility functions ---------- */
                    function getKeccack256Hash(inp1, inp2) -> val {
                        mstore(0x0,inp1)
                        mstore(0x20,inp2)
                        val := keccak256(0x0,0x40)
                    }

            //  ------------------------------------------------------------------------------------------------------------
            }
    }

}