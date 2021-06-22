// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Message, Note } = initSchema(schema);

export {
  Message,
  Note
};