import xmlrpc from 'xmlrpc-promise';
import config from '../../../config.js';

const BATCH_SIZE = 100;

const { db, email, password, endpoint } = config.odoo;

const formatMember = (member) => ({
  name: member.name,
  emails: [member.email, member.email_normalized],
});

const formatMembers = (members) => members.map(formatMember);

export const getUpToDateMembers = async (date) => {
  const upToDateMembers = [];
  const commonClient = xmlrpc.createSecureClient({ host: endpoint, port: 80, path: '/xmlrpc/2/common' });
  const objectClient = xmlrpc.createSecureClient({ host: endpoint, port: 80, path: '/xmlrpc/2/object' });
   
  const userId = await commonClient.methodCall('authenticate', [db, email, password, {}]);
  
  let offset = 0;
  let lastBatchLength = BATCH_SIZE;
  while (lastBatchLength === BATCH_SIZE) {
    const batch = await objectClient.methodCall(
      'execute_kw',
      [
        db,
        userId,
        password,
        'res.partner',
        'search_read',
        [[['membership_stop', '>', date]]],
        { fields: ['name', 'membership_stop', 'email', 'email_normalized'], offset, limit: BATCH_SIZE }
      ]);
    lastBatchLength = batch.length;
    upToDateMembers.push(...batch);
    offset += BATCH_SIZE;
  }

  return formatMembers(upToDateMembers);
};