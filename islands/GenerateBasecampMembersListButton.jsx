import axiod from 'axiod';
import { useState } from "preact/hooks";

const GenerateBasecampMembersListButton = (props) => {
  const onClick = async () => {
    setLoading(true);
    await axiod('/api/generate-basecamp-members');
    location.reload();
  };

  const [loading, setLoading] = useState(false);

  return <button onclick={onClick} disabled={loading}>{loading ? 'Génération...' : 'Régénérer'}</button>;
};

export default GenerateBasecampMembersListButton;