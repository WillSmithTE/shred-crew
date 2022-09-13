import { readFileSync } from "fs";
import { allResortsFile } from "./constants";
import { dynamoDbClient, RESORTS_TABLE } from "./database";
import { userService } from "./service/UserService";
import { Place } from "./types";
import { userPip, userWill } from "./util/bootstrapData";

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
    const myArray = [];
    for (let i = 0; i < arr.length; i += size) {
        myArray.push(arr.slice(i, i + size));
    }
    return myArray;
}

export async function bootstrapUsers() {
    [userWill, userPip].forEach(async (it) => {
        await userService.upsert(it)
    })
}

bootstrapResorts()
bootstrapUsers()

