import isAuthenticated from "../methods/auth/isAuthenticated.js";
import getBasecampMembersAndMetadata from "../methods/members/getBasecampMembersAndMetadata.js";
import GeneratedDateText from "../components/GeneratedDateText.jsx";
import MemberList from "../components/MemberList.jsx";
import GenerateButton from '../islands/GenerateBasecampMembersListButton.jsx';

export const handler = {
  async GET(req, ctx) {
    if (!isAuthenticated(req)) {
      return new Response(null, { status: 302, headers: { location: '/login' } });
    }

    const currentBasempMembersAndMetadata = await getBasecampMembersAndMetadata({ method: 'soft' });
    const { metadata: { generatedDate } = {}, basecampMembers } = currentBasempMembersAndMetadata || {};

    return ctx.render({ generatedDate, basecampMembers });
  },
};

export default function Page({ data }) {
  const { generatedDate, basecampMembers } = data;
  return (
    <div>
      <a href="/logout" style={{ textAlign: 'right', display: 'block' }}>Se déconnecter</a>
      <h1>Membres Basecamp</h1>
      <GeneratedDateText generatedDate={generatedDate} />
      <GenerateButton />
      {basecampMembers && <div>
        <h2>Cotisant·e·s ({basecampMembers.membersToKeep.length})</h2>
        <MemberList members={basecampMembers.membersToKeep} />
        <h2>Non cotisant·e·s ({basecampMembers.membersToRemove.length})</h2>
        <MemberList members={basecampMembers.membersToRemove} />
      </div>}
    </div>
  );
}