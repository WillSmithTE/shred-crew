import { readFileSync } from "fs";
import { allResortsFile } from "./constants";
import { dynamoDbClient, RESORTS_TABLE } from "./database";
import { Place } from "./types";

bootstrapResorts()

export async function bootstrapResorts() {
    const data = readFileSync(allResortsFile)
    const resorts = JSON.parse(data.toString())
    const resortChunks = chunkArrayInGroups(resorts, 25)
    resortChunks.forEach((chunk) => {
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
        dynamoDbClient.batchWrite(params).promise();
    })
}

function chunkArrayInGroups<T>(arr: T[], size: number): T[][] {
    var myArray = [];
    for (var i = 0; i < arr.length; i += size) {
        myArray.push(arr.slice(i, i + size));
    }
    return myArray;
}
