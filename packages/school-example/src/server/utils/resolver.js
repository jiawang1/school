import { troopClient } from '@school/troop-adapter';
import config from '../../../base.config';

const utilSchema =
  `
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
`
;

export { utilSchema };
export default {
  Query: {
    command: (root, { id }, { currentContext }) =>
      troopClient.query(config.troopContext, `command!${id}`, currentContext),

    blurb: (root, { id = [] }, { currentContext }) => {
      const _troopquery = id.reduce((str, cur) => {
        return str.length > 0 ? `${str}|blurb!${cur}` : `blurb!${cur}`;
      }, '');
      return troopClient.query(config.troopContext, _troopquery, currentContext);
    }
  }
};
