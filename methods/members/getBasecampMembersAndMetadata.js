import { format } from 'date-fns';
import getBasecampMembersToKeepAndRemove from './getBasecampMembersToKeepAndRemove.js';

let basecampMembersAndMetadata = null;

const getBasecampMembersAndMetadata = async ({ method = 'soft' } = {}) => {
  if (method === 'soft') {
    return basecampMembersAndMetadata;
  }
    
  if ((!basecampMembersAndMetadata && method === 'hard') || method === 'regenerate') {
    const metadata = { generatedDate: format(new Date(), 'yyyy-MM-dd') };
    const basecampMembers = await getBasecampMembersToKeepAndRemove();
  
    basecampMembersAndMetadata = {
      metadata,
      basecampMembers,
    };
  
    return basecampMembersAndMetadata;
  }
};

export default getBasecampMembersAndMetadata;