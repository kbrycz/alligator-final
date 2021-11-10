import axios from 'axios'
import {serverName} from './serverName'

export default axios.create({
    baseURL: serverName
})