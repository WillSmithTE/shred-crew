import { readFile, writeFileSync, } from 'fs'
import { promisify } from 'util';
import geohash from 'ngeohash';
import { Place } from '../types';
import { allResortsFile } from '../constants';

const readFilePromise = promisify(readFile)
const allResorts: {}[] = []

Promise.all(Array.from(Array(32).keys()).map((i) =>
    readFilePromise(`../python/jsonOutputs/skiResort-${i}.json`).then((data) => {
        const resorts = JSON.parse(data.toString())
            .map((resort: Place) => {
                const geometry = resort.googlePlace.geometry
                if (geometry === undefined) {
                    console.log(`no coordinates (id=${resort.id}, name=${resort.name}))`)
                    return resort
                }
                const hash = geohash.encode(geometry.location.lat, geometry.location.lng)

                return {
                    ...resort,
                    name: resort.name.trim(),
                    gsi1pk: "Geohash",
                    gsi1sk: hash,
                }
            })
        allResorts.push(...resorts)
        console.log(`added resorts to allResorts (fileNumber=${i})`)
    })
))
    .then(() => {
        console.log('done with promises')
        writeFileSync(allResortsFile, JSON.stringify(allResorts, null, 2))
    })