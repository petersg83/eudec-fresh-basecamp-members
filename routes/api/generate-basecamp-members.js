import getBasecampMembersAndMetadata from '../../methods/members/getBasecampMembersAndMetadata.js';

export const handler = async (_req, _ctx) => {
  await getBasecampMembersAndMetadata({ method: 'regenerate' });

  return new Response();
};
