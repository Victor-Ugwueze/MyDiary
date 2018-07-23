
const getApiRequestVersion = (path) => {
  const VERSION = ['v1'];
  const reqVersion = path.split('/')[2];
  return VERSION
    .filter(version => version === reqVersion)[0];
};

export default getApiRequestVersion;
