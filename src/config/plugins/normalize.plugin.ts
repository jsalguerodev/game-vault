import slugify from 'slugify'

export const normalize = (string: string) => {
  return slugify(string, { lower: true, strict: true })
}
