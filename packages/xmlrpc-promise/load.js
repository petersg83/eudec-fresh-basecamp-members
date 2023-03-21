import xmlrpc from 'xmlrpc';

const createSecureClient = (...args) => {
  const client = xmlrpc.createSecureClient(...args);

  return {
    methodCall(method, params) {
      return new Promise((resolve, reject) => {
        client.methodCall(method, params, (err, value) => {
          if (err) {
            reject(err);
          }

          resolve(value);
        })
      });
    }
  };
};

export default {
  createSecureClient,
};