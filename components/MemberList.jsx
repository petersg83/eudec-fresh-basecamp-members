import fp from 'lodash/fp';
const { sortBy } = fp;


const MemberList = (props) => {
  const sortedMembers = sortBy(m => m.name.toLowerCase())(props.members);

  return <table>
    <tr>
      <th>Nom</th>
      <th>emails</th>
    </tr>
    {sortedMembers.map((member) => <tr>
      <td><strong>{member.name}</strong></td>
      <td>{member.emails.join(', ')}</td>
    </tr>)}
  </table>;
};

export default MemberList;