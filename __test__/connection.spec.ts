import { Connection } from '../src/Connection'

describe('testing connection between odm and arangodb', () => {
  let conn: Connection = null
  beforeEach (() => {
    conn = new Connection({
      url: process.env.ARANGO_URL,
      username: process.env.ARANGO_USERNAME,
      password: process.env.ARANGO_PWD
    })
  })

  it('starts up with an empty database', () => {
    conn.
  })

  describe('checking if sync creates stuff in the database', () => {
    // TODO: figure out a way to run it only once
    beforeEach(() => {
      conn.options.syncronize = true
    })

    it('creates a new database if it does not exist', () => {

    })
    afterAll(() => {
      conn.options.syncronize = false
    })
  })
})
