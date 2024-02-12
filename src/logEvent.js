import {format} from "date-fns"
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import fsPromises from 'fs/promises'

const logEvent = async (message) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`
    try {
        if(!fs.existsSync(path.join('./src', 'logs'))){
            await fsPromises.mkdir(path.join('./src', 'logs'))
        }
        await fsPromises.appendFile(path.join('./src/', 'logs', 'logEvent.txt'), logItem)
    } catch (error) {
        console.log(error)
    }
}


export {logEvent};