import {Router} from 'express'
import { update } from './bill.controller.js'
import { isAdmin, validateJwt } from '../middleware/validate.js'

const api = Router()

api.put('/update/:id/:itemId', [validateJwt, isAdmin], update)

export default api