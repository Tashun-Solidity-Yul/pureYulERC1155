


Removed the Free Memory pointer concept, tried reusing memory

`startMemoryCopyDynamicArray1 - 0xc0 memory location `
```agsl
Start of the first array copying to the memory
0xc0 - stores the length of the first array
```
`startMemoryCopyDynamicArray2 - 0xe0 memory location `
```agsl
Second first array copying to the memory
0xe0 - stores the length of the second array
```
`initDynamicArray(memPointerIndex, memPointerValue, value)`
```agsl
memPointerIndex : memory pointer of the memory pointer value of the length
memPointerValue : memory pointer value of the length
value: first value to push
```

`push(memPointerIndex, value)`
```agsl
memPointerIndex : memory pointer of the memory pointer value of the length
next value to push to memory array
```

`pushToVirtualMemoryLocation(memPointerIndex, distanceToMemory, value)`
```agsl
memPointerIndex: start location in the main memory
distanceToMemory: distance to the virtual memory in main memory
value: value to push to memory

```

`setupMetaDataToAddMultipleArraysToMemory(arrayLength)`
```agsl
persist the arrayLength given in 0xc0 and 0xe0 
to as the initial setup two arrays 
```


` getHashValue( attr1, attr2, attr3)`
```agsl
given attr1, attr2 and attr3 values, results the keccak256 value
0x60, 0x80, 0xa0 memory slots are dedicated for the hashing
```

`addBytesToMemory(dataOffset, lengthPositionIndex)`
```agsl
dataOffset - calldata offset of the bytes
lengthPositionIndex - position where to store the bytes length
```

