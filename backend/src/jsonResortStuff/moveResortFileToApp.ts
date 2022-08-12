import { readFile, writeFileSync, } from 'fs'
import { promisify } from 'util';
import { Place, ResortStore } from '../types';
import { allResortsFile } from '../constants';

const readFilePromise = promisify(readFile)
const appResortStoreFilePath = '../app/assets/resortStore.json'
readFilePromise(allResortsFile).then((data) => {
    const resorts: ResortStore[] = JSON.parse(data.toString())
        .map((resort: Place) => {
            return {
                id: resort.id,
                name: resort.name
            }
        })
    writeFileSync(appResortStoreFilePath, JSON.stringify(resorts, null, 2))
    console.log(`writing resort file to app complete`)
})
