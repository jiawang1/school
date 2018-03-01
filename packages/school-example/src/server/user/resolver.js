import { troopClient } from '@school/troop-adapter';
import config from '../../../base.config';

const userSchema = `
  type User {
    member_id : Int
    userName : String
    memberTypeCode: String
    partnerCode: String
    divisionCode: String
    email:String
    firstName:String
    lastName: String
    countryCode: String
    gender: String
    collapsed: Boolean
    id:String
  }
  type Query{
    user(id:String!):[User]
  }
`;

export { userSchema };
export default {
  Query: {
    user: (root, { id }, { currentContext }) =>
      troopClient.query(config.troopContext, `user!${id}`, currentContext)
  }
};
