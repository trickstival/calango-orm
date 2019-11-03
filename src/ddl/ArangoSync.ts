import { Connection } from "../Connection";
import { ENTITY_ATTRIBUTES, ENTITY_INDEXES, ENTITY_WAIT_FOR_SYNC } from "../keys/entity.keys";
import { ArangoIndex } from "../types/Index";
import { DocumentCollection } from "arangojs";

export class ArangoSync {
  constructor (public connection: Connection) {
  }

  async exec () {
    await this.syncDb()
    await this.syncEntities()
  }

  async syncDb () {
    const { db, options } = this.connection
    if (!(await db.exists())) {
      await db.createDatabase(options.database)
    }
  }

  async syncEntities () {
    const { options, db } = this.connection
    const { entities } = options

    for (const entity of entities) {
      const name = Reflect.getMetadata(ENTITY_ATTRIBUTES, entity)
      const indexes = Reflect.getMetadata(ENTITY_INDEXES, entity)
      const collection = db.collection(name)

      this.collectionSync(collection, {
        waitForSync: !!Reflect.getMetadata(ENTITY_WAIT_FOR_SYNC, entity),
      })
      const collectionIndexes: ArangoIndex[] = await collection.indexes()
      const collectionIndexMap = collectionIndexes.reduce((map, index) => {
        map[index.name] = index
        return map
      }, Object.create(null))

      for (const index of indexes) {
        if (collectionIndexMap[index.name]) {
          continue
        }

        collection.createIndex({

        })

        this.connection.log(`Creating Index "${index.name}" in "${name}" collection...`)
      }
    }
  }

  async collectionSync (collection: DocumentCollection, options: { waitForSync: boolean }) {
    if (!(await collection.exists())) {
      this.connection.log(`Creating "${name}" collection...`)
      await collection.create(options)
    }
  }
}
