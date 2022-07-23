import mongoose from "mongoose";
import {nanoid} from 'nanoid'

const {Schema} = mongoose

const SCHEMA1 = 'Schema1'
const SCHEMA2 = 'Schema2'
const SCHEMA3 = 'Schema3'
const SCHEMA4 = 'Schema4'

const N = 100000

const schema1 = new Schema({
  someField: {
    type: String,
    required: false,
  }
})

const schema2 = new Schema({
  someField: {
    type: String,
    required: false,
  }
})

const schema3 = new Schema({
  someField: {
    type: String,
    required: false,
  }
})

const schema4 = new Schema({
  someField: {
    type: String,
    required: false,
  }
})

/*
const model1 = mongoose.model(SCHEMA1, schema1);
const model2 = mongoose.model(SCHEMA2, schema2);
const model3 = mongoose.model(SCHEMA3, schema3);
const model4 = mongoose.model(SCHEMA4, schema4);
*/

const modelMap = new Map()

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  // autoReconnect: true,
  useUnifiedTopology: true,
})

mongoose.connection.on('connected', data => console.log("Connected", data))
mongoose.connection.on('disconnected', data => console.log("Disconnected", data))
mongoose.connection.on('reconnected', data => console.log("Reconnected", data))


function createRecords() {
  const schemaNames = [SCHEMA1, SCHEMA2, SCHEMA3, SCHEMA4];
  const schemas = [schema1, schema2, schema3, schema4]
  const connectionObj = mongoose.connection

  for (let i = 0; i < N; i++) {
    const index = getRndInteger(0, 3);
    const schemaName = schemaNames[index]
    if (!modelMap.has(schemaName)) {
      modelMap.set(schemaName, mongoose.model(schemaName, schemas[index]))
    }

    const Model = modelMap.get(schemaName);
    const newRecord = new Model({
      someField: nanoid()
    })
    newRecord.save()

    if (mongoose.connections.length > 1) {
      console.log("NUM OF CONNECTIONS CHANGED!!")
    }

    if (mongoose.connection !== connectionObj || mongoose.connections[0] !== connectionObj) {
      console.log("RECONNECTION OF DATABASE HAS OCCURED")
    }

  }

  console.log("ALL OPS COMPLETE")
}

setTimeout(createRecords, 5000)

