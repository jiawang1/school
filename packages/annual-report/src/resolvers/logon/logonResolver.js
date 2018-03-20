import { troopClient } from '@shanghai/troop-adapter';

export default {
  Mutation: {
    logon: async (root, { username, password }) => {
      const response = await troopClient.postForm(`/login/secure.ashx`, {
        username,
        password
      });
      return response;
    }
  }
};
