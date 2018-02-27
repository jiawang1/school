import { troopClient } from '@school/troop-adapter';
import config from '../../../base.config';

const contextSchema = `
type Code {
  value : String
}
type contextValue {
  countrycode:Code
  culturecode:Code
  partnercode:Code
  siteversion:Code
  languagecode:Code
  studentcountrycode:Code
}

type context {
  id: String
  collapsed: Boolean
  values: contextValue
}

  type Query{
    currentContext(id:String!):[context]
  }
`;

export { contextSchema };

export default {
  Query: {
    currentContext: (root, { id }) => troopClient.query(config.troopContext, `context!${id}`)
  }
};
