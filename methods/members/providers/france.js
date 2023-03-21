import { Client } from 'mysql';
import { isAfter, isBefore } from 'date-fns';
import config from '../../../config.js';

const { db, user, password, host } = config.france;

const BATCH_SIZE = 100;

const formatMember = (member) => ({
  name: `${member.firstname} ${member.lastname}`,
  emails: [member.email, ...(member.otherEmails || '').split(';').filter(Boolean)],
});

const formatMembers = (members) => members.map(formatMember);

const getAllMembers = async () => {
  const client = await new Client().connect({
    hostname: host,
    username: user,
    db,
    password,
  });

  const members = [];
  let offset = 0;
  let lastBatchLength = BATCH_SIZE;
  while (lastBatchLength === BATCH_SIZE) {
    const batch = await client.query(`
      SELECT
        u.user_firstname as firstname,
        u.user_lastname as lastname,
        u.user_id,
        u.user_email_main as email,
        u.user_email_secondaries as otherEmails,
        m.membership_user_id,
        m.membership_dates as membershipDates
      FROM
        user u,
        membership m
      WHERE u.user_id = m.membership_user_id AND u.user_is_deleted = 'n'
      LIMIT ? OFFSET ?;
    `, [BATCH_SIZE, offset]);
    lastBatchLength = batch.length;
    members.push(...batch);
    offset += BATCH_SIZE;
  }
  return members;
}

export const isUpToDateMember = date => {
  const dateTocheck = new Date(date);

  return member => {
    if (!member.membershipDates) {
      return false;
    }
  
    const membershipDates = member
      .membershipDates
      .split(';')
      .slice(1)
      .map(d => d.split('_'))
      .map(([start, end]) => ({ start: new Date(start), end: new Date(end) }))
  
    return membershipDates.some(({ start, end }) => !isAfter(start, dateTocheck) && !isBefore(end, dateTocheck));
  }
}

export const getUpToDateMembers = async (date) => {
  const members = await getAllMembers();

  const upToDateMembers = members.filter(isUpToDateMember(date));
  return formatMembers(upToDateMembers);
};