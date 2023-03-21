import { format, subMonths } from 'date-fns';

import { getUpToDateMembers as getUpToDateOdooMembers } from "./providers/odoo.js";
import { getUpToDateMembers as getUpToDateFranceMembers } from "./providers/france.js";
import { getMembers as getBasecampMembers } from "./providers/basecamp.js";

export const getBasecampMembersToKeepAndRemove = async () => {
  const membershipDate = format(subMonths(new Date(), 3), 'yyyy-MM-dd'); // Considered as still a member for 3 months after the end of the current membership
  const odooMembers = await getUpToDateOdooMembers(membershipDate);
  const franceMembers = await getUpToDateFranceMembers(membershipDate);
  const basecampMembers = await getBasecampMembers();
  
  const upToDateEmailsMap = {};
  for (const member of [...odooMembers, ...franceMembers]) {
    member.emails.forEach((email) => { upToDateEmailsMap[email] = true; });
  }
  
  const membersToRemove = basecampMembers.filter((member) => {
    return !member.emails.some(email => upToDateEmailsMap[email]);
  });
  
  const membersToKeep = basecampMembers.filter((member) => {
    return member.emails.some(email => upToDateEmailsMap[email]);
  });

  return {
    membersToKeep,
    membersToRemove,
  }
}

export default getBasecampMembersToKeepAndRemove;