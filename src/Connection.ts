import { Database } from "arangojs";
import { LoadBalancingStrategy } from "arangojs/lib/cjs/connection";
import { ENTITY_ATTRIBUTES, ENTITY_WAIT_FOR_SYNC, ENTITY_INDEXES } from "./keys/entity.keys";
import { ArangoIndex } from "./types/Index";

export interface ArangoConfig {
  url: string | string[];
  isAbsolute: boolean;
  arangoVersion: number;
  loadBalancingStrategy: LoadBalancingStrategy;
  maxRetries: false | number;
  agent: any;
  agentOptions: {
    [key: string]: any;
  };
  headers: {
    [key: string]: string;
  };
}

export interface ConnectionOptions extends ArangoConfig {
  database: string;
  username: string;
  password: string;
  syncronize: boolean;
  log: boolean;
  entities: Function[];
}

export class Connection {
  public options: Partial<ConnectionOptions>;
  public db: Database;

  constructor(options: Partial<ConnectionOptions>) {
    this.options = {
      url: "arangodb://localhost:8529",
      username: "root",
      password: "root",
      database: "db",
      syncronize: false,
      log: true,
      entities: [],
      ...options
    };
  }

  async sync() {

  }

  log (...args) {
    if (this.options.log) {
      console.log(`CALANGO: `, ...args)
    }

    return this
  }

  async connect() {
    this.db = new Database(this.options);
    this.db.useDatabase(this.options.database);

    if (this.options.syncronize) {
      await this.sync();
    }
  }
}
