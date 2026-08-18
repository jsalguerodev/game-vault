import { isObjectIdOrHexString as isValidID } from 'mongoose'
import { InvalidEntityIdError } from '../../../../domain/errors/index.js'

export const validateMongoId = (id: string) => {
  if (!isValidID(id)) {
    throw new InvalidEntityIdError(id)
  }
}
