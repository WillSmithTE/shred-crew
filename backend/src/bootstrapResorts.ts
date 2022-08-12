import { readFileSync } from "fs";
import { allResortsFile } from "./constants";
import { dynamoDbClient, RESORTS_TABLE } from "./database";
import { Place } from "./types";

// bootstrapResorts()
async function count() {
    const params = {
        TableName: RESORTS_TABLE,
        Select: "COUNT",
    };
    const count = await dynamoDbClient.scan(params).promise();
    console.log({ count })
}
bootstrapResorts()

export async function bootstrapResorts() {
    const data = readFileSync(allResortsFile)
    const resorts = JSON.parse(data.toString())
    const resortChunks = chunkArrayInGroups(resorts, 25)
    console.log(`numChunks=${resortChunks.length}`)
    console.log(`numTotal=${resortChunks.flat().length}`)
    resortChunks.forEach(async (chunk, index) => {
        const params = {
            RequestItems: {
                [RESORTS_TABLE]: chunk.map((resort: Place) => (
                    {
                        PutRequest: {
                            Item: resort
                        }
                    }
                ))
            }
        };
        try {
            const it = await dynamoDbClient.batchWrite(params).promise();
            console.log(`success: ${JSON.stringify(it.UnprocessedItems, null, 2)}`);
        } catch (e) {
            console.log(`something went wrong ${JSON.stringify(e, null, 2)}`);
        }
        // console.log(`writing batch (num=${index + 1})`)
    })
}

function chunkArrayInGroups<T>(arr: T[], size: number): T[][] {
    var myArray = [];
    for (var i = 0; i < arr.length; i += size) {
        myArray.push(arr.slice(i, i + size));
    }
    return myArray;
}
