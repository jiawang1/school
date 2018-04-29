import React from 'react';
import getTroopConnector from './troopConnector';

const troopConnector = getTroopConnector();
const { Provider: TroopProvider, Consumer } = React.createContext(troopConnector);

const withTroop = (props = {}) => Component =>
  React.forwardRef((_props, ref) => {
    const mergedProps = { ...props, ..._props };
    return <Consumer>{connector => <Component {...mergedProps} connector={connector} ref={ref} />}</Consumer>;
  });

export { TroopProvider };

export default withTroop;
