import { troopClient } from '@shanghai/troop-adapter';
import config from '../../../base.config';

const utilSchema = `
scalar JSON
type Cammand {
  id: String
  results: JSON
}

type Blurb {
  id: String
  translation:String
}

type Query{
  command(id:String!):[Cammand]
  blurb(id:[String]!):[Blurb]
}
`;

export { utilSchema };
export default {
  Query: {
    command: (root, { id }, { currentContext: troopContext }) =>
      troopClient.query(config.troopQueryContext, `command!${id}`, { troopContext }),

    blurb: (root, { id = [] }, { currentContext: troopContext }) => {
      const _troopquery = id.reduce(
        (str, cur) => (str.length > 0 ? `${str}|blurb!${cur}` : `blurb!${cur}`),
        ''
      );
      return troopClient.query(config.troopQueryContext, _troopquery, { troopContext });
    }
  }
};
