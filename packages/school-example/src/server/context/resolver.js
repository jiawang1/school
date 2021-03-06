import { troopClient } from '@shanghai/troop-adapter';
import config from '../../../config/base.config';

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
    context(id:String!):[context]
  }
`;

export { contextSchema };

export default {
  Query: {
    context: (root, { id }) => troopClient.query(config.troopQueryContext, `context!${id}`)
  }
};
