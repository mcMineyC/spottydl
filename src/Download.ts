import { Album, Track, Playlist, Results, checkType, checkPath } from './index'
import NodeID3 from 'node-id3'
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import axios from 'axios'
<<<<<<< HEAD
import { unlinkSync, existsSync } from 'fs'

// Private Methods
const dl_track = async (id: string, filename: string): Promise<boolean> => {
    if(!existsSync(filename)){
        return await new Promise<boolean>((resolve, reject) => {
            ffmpeg(ytdl(id, { quality: 'highestaudio', filter: 'audioonly' }))
                .audioBitrate(256)
                .save(filename)
                .on('error', (err: any) => {
                    console.error(`Failed to write file (${filename}): ${err}`)
                    unlinkSync(filename)
                    resolve(false)
                })
                .on('end', () => {
                    resolve(true)
                })
        })
    }else{
        return await new Promise<boolean>((resolve, reject) => {
            resolve(true)
        })
    }
}

const dl_album_normal = async (obj: Album, oPath: string, tags: any, callback: any = ()=>{}): Promise<Results[]> => {
    let Results: any = []
    console.log("Normal downloading")
=======
import { unlinkSync } from 'fs'

// Private Methods
const dl_track = async (id: string, filename: string): Promise<boolean> => {
    return await new Promise<boolean>((resolve, reject) => {
        ffmpeg(ytdl(id, { quality: 'highestaudio', filter: 'audioonly' }))
            .audioBitrate(128)
            .save(filename)
            .on('error', (err: any) => {
                console.error(`Failed to write file (${filename}): ${err}`)
                unlinkSync(filename)
                resolve(false)
            })
            .on('end', () => {
                resolve(true)
            })
    })
}

const dl_album_normal = async (obj: Album, oPath: string, tags: any): Promise<Results[]> => {
    let Results: any = []
>>>>>>> 6f43740014c118ea5121b4f2e6e25041d99e652f
    for await (let res of obj.tracks) {
        let sanitizedTitle: string = res.title.replace(/[/\\]/g, ' ')
        let filename = `${oPath}${sanitizedTitle}.mp3`
        let dlt = await dl_track(res.id, filename)
        if (dlt) {
            let tagStatus = NodeID3.update(tags, filename)
            if (tagStatus) {
<<<<<<< HEAD
                callback({ success: true, filename: filename, name: res.title});
                console.log(`Finished: ${filename}`)
                Results.push({ status: 'Success', filename: filename })
            } else {
                if(callback) callback({ success: false, reason: "tags", filename: filename, name: res.title})
=======
                console.log(`Finished: ${filename}`)
                Results.push({ status: 'Success', filename: filename })
            } else {
>>>>>>> 6f43740014c118ea5121b4f2e6e25041d99e652f
                console.log(`Failed: ${filename} (tags)`)
                Results.push({ status: 'Failed (tags)', filename: filename, tags: tags })
            }
        } else {
<<<<<<< HEAD
            if(callback) callback({ success: false, reason: "stream", filename: filename, name: res.title})
=======
>>>>>>> 6f43740014c118ea5121b4f2e6e25041d99e652f
            console.log(`Failed: ${filename} (stream)`)
            Results.push({ status: 'Failed (stream)', filename: filename, id: res.id, tags: tags })
        }
    }
    return Results
}

<<<<<<< HEAD
const dl_album_fast = async (obj: Album, oPath: string, tags: any, callback?: any): Promise<Results[]> => {
    let Results: any = []
    let i: number = 0 // Variable for specifying the index of the loop
    return await new Promise<Results[]>(async (resolve, reject) => {
        console.log("Fast downloading")
=======
const dl_album_fast = async (obj: Album, oPath: string, tags: any): Promise<Results[]> => {
    let Results: any = []
    let i: number = 0 // Variable for specifying the index of the loop
    return await new Promise<Results[]>(async (resolve, reject) => {
>>>>>>> 6f43740014c118ea5121b4f2e6e25041d99e652f
        for await (let res of obj.tracks) {
            let sanitizedTitle: string = res.title.replace(/[/\\]/g, ' ')
            let filename = `${oPath}${sanitizedTitle}.mp3`
            ffmpeg(ytdl(res.id, { quality: 'highestaudio', filter: 'audioonly' }))
                .audioBitrate(128)
                .save(filename)
                .on('error', (err: any) => {
<<<<<<< HEAD
                    tags.title = res.title // Tags
                    tags.trackNumber = res.trackNumber
                    if(callback) callback({ success: false, reason: "stream", filename: filename, name: res.title})
=======
                    tags.title = res.name // Tags
                    tags.trackNumber = res.trackNumber
>>>>>>> 6f43740014c118ea5121b4f2e6e25041d99e652f
                    Results.push({ status: 'Failed (stream)', filename: filename, id: res.id, tags: tags })
                    console.error(`Failed to write file (${filename}): ${err}`)
                    unlinkSync(filename)
                    // reject(err)
                })
                .on('end', () => {
                    i++
<<<<<<< HEAD
                    tags.title = res.title
                    tags.trackNumber = res.trackNumber
                    let tagStatus = NodeID3.update(tags, filename)
                    if (tagStatus) {
                        if(callback) callback({ success: true, filename: filename, name: res.title})
                        console.log(`Finished: ${filename}`)
                        Results.push({ status: 'Success', filename: filename })
                    } else {
                        if(callback) callback({ success: false, reason: "tags", filename: filename, name: res.title})
=======
                    tags.title = res.name
                    tags.trackNumber = res.trackNumber
                    let tagStatus = NodeID3.update(tags, filename)
                    if (tagStatus) {
                        console.log(`Finished: ${filename}`)
                        Results.push({ status: 'Success', filename: filename })
                    } else {
>>>>>>> 6f43740014c118ea5121b4f2e6e25041d99e652f
                        console.log(`Failed to add tags: ${filename}`)
                        Results.push({ status: 'Failed (tags)', filename: filename, id: res.id, tags: tags })
                    }
                    if (i == obj.tracks.length) {
                        resolve(Results)
                    }
                })
        }
    })
}
// END

/**
 * Download the Spotify Track, need a <Track> type for first param, the second param is optional
 * @param {Track} obj An object of type <Track>, contains Track details and info
 * @param {string} outputPath - String type, (optional) if not specified the output will be on the current dir
 * @returns {Results[]} <Results[]> if successful, `string` if failed
 */
export const downloadTrack = async (obj: Track, outputPath: string = './'): Promise<Results[] | string> => {
    try {
        // Check type and check if file path exists...
        if (checkType(obj) != 'Track') {
            throw Error('obj passed is not of type <Track>')
        }
        let albCover = await axios.get(obj.albumCoverURL, { responseType: 'arraybuffer' })
        let tags: any = {
            title: obj.title,
            artist: obj.artist,
            album: obj.album,
            year: obj.year,
            trackNumber: obj.trackNumber,
            image: {
                imageBuffer: Buffer.from(albCover.data, 'utf-8')
            }
        }

        let sanitizedTitle: string = obj.title.replace(/[/\\]/g, ' ')
        let filename: string = `${checkPath(outputPath)}${sanitizedTitle}.mp3`

        // EXPERIMENTAL
        let dlt = await dl_track(obj.id, filename)
        if (dlt) {
            let tagStatus = NodeID3.update(tags, filename)
            if (tagStatus) {
                return [{ status: 'Success', filename: filename }]
            } else {
                return [{ status: 'Failed (tags)', filename: filename, tags: tags }]
            }
        } else {
            return [{ status: 'Failed (stream)', filename: filename, id: obj.id, tags: tags }]
        }
    } catch (err: any) {
        return `Caught: ${err}`
    }
}

/**
 * Download the Spotify Album, need a <Album> type for first param, the second param is optional,
 * function will return an array of <Results>
 * @param {Album} obj An object of type <Album>, contains Album details and info
 * @param {string} outputPath - String type, (optional) if not specified the output will be on the current dir
 * @param {boolean} sync - Boolean type, (optional) can be `true` or `false`. Default (true) is safer/less errors, for slower bandwidths
 * @returns {Results[]} <Results[]> if successful, `string` if failed
 */
export const downloadAlbum = async (
    obj: Album,
    outputPath: string = './',
<<<<<<< HEAD
    sync: boolean = true,
    callback: any = ()=>{}
=======
    sync: boolean = true
>>>>>>> 6f43740014c118ea5121b4f2e6e25041d99e652f
): Promise<Results[] | string> => {
    try {
        if (checkType(obj) != 'Album') {
            throw Error('obj passed is not of type <Album>')
        }
        let albCover = await axios.get(obj.albumCoverURL, { responseType: 'arraybuffer' })
        let tags: any = {
            artist: obj.artist,
            album: obj.name,
            year: obj.year,
            image: {
                imageBuffer: Buffer.from(albCover.data, 'utf-8')
            }
        }
        let oPath = checkPath(outputPath)
        if (sync) {
<<<<<<< HEAD
            return await dl_album_normal(obj, oPath, tags, callback)
        } else {
            return await dl_album_fast(obj, oPath, tags, callback)
=======
            return await dl_album_normal(obj, oPath, tags)
        } else {
            return await dl_album_fast(obj, oPath, tags)
>>>>>>> 6f43740014c118ea5121b4f2e6e25041d99e652f
        }
    } catch (err: any) {
        return `Caught: ${err}`
    }
}

/**
 * Download the Spotify Playlist, need a <Playlist> type for first param, the second param is optional,
 * function will return an array of <Results>
 * @param {Playlist} obj An object of type <Playlist>, contains Playlist details and info
 * @param {string} outputPath - String type, (optional) if not specified the output will be on the current dir
 * @returns {Results[]} <Results[]> if successful, `string` if failed
 */
<<<<<<< HEAD
export const downloadPlaylist = async (obj: Playlist, outputPath: string = './', callback?: any): Promise<Results[] | string> => {
=======
export const downloadPlaylist = async (obj: Playlist, outputPath: string = './'): Promise<Results[] | string> => {
>>>>>>> 6f43740014c118ea5121b4f2e6e25041d99e652f
    try {
        let Results: any = []
        if (checkType(obj) != 'Playlist') {
            throw Error('obj passed is not of type <Playlist>')
        }

        let oPath = checkPath(outputPath)
        for await (let res of obj.tracks) {
            let sanitizedTitle: string = res.title.replace(/[/\\]/g, ' ')
            let filename = `${oPath}${sanitizedTitle}.mp3`
            let dlt = await dl_track(res.id, filename)
            let albCover = await axios.get(res.albumCoverURL, { responseType: 'arraybuffer' })
            let tags: any = {
                title: res.title,
                artist: res.artist,
                album: res.album,
                // year: 0, // Year tag doesn't exist when scraping
                trackNumber: res.trackNumber,
                image: {
                    imageBuffer: Buffer.from(albCover.data, 'utf-8')
                }
            }
            if (dlt) {
                let tagStatus = NodeID3.update(tags, filename)
                if (tagStatus) {
<<<<<<< HEAD
                    if(callback) callback({ success: true, filename: filename, name: res.title})
                    console.log(`Finished: ${filename}`)
                    Results.push({ status: 'Success', filename: filename })
                } else {
                    if(callback) callback({ success: false, reason: "tags", filename: filename, name: res.title})
=======
                    console.log(`Finished: ${filename}`)
                    Results.push({ status: 'Success', filename: filename })
                } else {
>>>>>>> 6f43740014c118ea5121b4f2e6e25041d99e652f
                    console.log(`Failed: ${filename} (tags)`)
                    Results.push({ status: 'Failed (tags)', filename: filename, tags: tags })
                }
            } else {
<<<<<<< HEAD
                if(callback) callback({ success: false, reason: "stream", filename: filename, name: res.title})
=======
>>>>>>> 6f43740014c118ea5121b4f2e6e25041d99e652f
                console.log(`Failed: ${filename} (stream)`)
                Results.push({ status: 'Failed (stream)', filename: filename, id: res.id, tags: tags })
            }
        }

        return Results
    } catch (err: any) {
        return `Caught: ${err}`
    }
}

/**
 * Retries the download process if there are errors. Only use this after `downloadTrack()` or `downloadAlbum()` methods
 * checks for failed downloads then tries again, returns <Results[]> object array
 * @param {Results[]} Info An object of type <Results[]>, contains an array of results
 * @returns {Results[]} <Results[]> array if the download process is successful, `true` if there are no errors and `false` if an error happened.
 */
export const retryDownload = async (Info: Results[]): Promise<Results[] | boolean> => {
    try {
        if (checkType(Info) != 'Results[]') {
            throw Error('obj passed is not of type <Results[]>')
        }
        // Filter the results
        let failedStream = Info.filter((i) => i.status == 'Failed (stream)' || i.status == 'Failed (tags)')
        if (failedStream.length == 0) {
            return true
        }
        let Results: any = []
        failedStream.map(async (i: any) => {
            if (i.status == 'Failed (stream)') {
                let dlt = await dl_track(i.id, i.filename)
                if (dlt) {
                    let tagStatus = NodeID3.update(i.tags, i.filename)
                    if (tagStatus) {
                        Results.push({ status: 'Success', filename: i.filename })
                    } else {
                        Results.push({ status: 'Failed (tags)', filename: i.filename, tags: i.tags })
                    }
                } else {
                    Results.push({ status: 'Failed (stream)', filename: i.filename, id: i.id, tags: i.tags })
                }
            } else if (i.status == 'Failed (tags)') {
                let tagStatus = NodeID3.update(i.tags, i.filename)
                if (tagStatus) {
                    Results.push({ status: 'Success', filename: i.filename })
                } else {
                    Results.push({ status: 'Failed (tags)', filename: i.filename, tags: i.tags })
                }
            }
        })
        return Results
    } catch (err) {
        console.error(`Caught: ${err}`)
        return false
    }
}
