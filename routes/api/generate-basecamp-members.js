import { format } from 'date-fns';
import getBasecampMembersToKeepAndRemove from '../../methods/members/getBasecampMembersToKeepAndRemove.js';

export const handler = async (_req, _ctx) => {
  const metadata = { generatedDate: format(new Date(), 'yyyy-MM-dd') };
  const basecampMembers = await getBasecampMembersToKeepAndRemove();

  const fileContent = {
    metadata,
    basecampMembers,
  }

  await Deno.writeTextFile("./generated/basecamp-members.json", JSON.stringify(fileContent));

  return new Response();
};
