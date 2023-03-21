import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const GeneratedDateText = (props) => {
  return props.generatedDate
    ? <p>Liste générée le <strong>{format(new Date(props.generatedDate), 'PPPP', { locale: fr })}</strong></p>
    : <p>La liste n'a pas encore été générée</p>;
};

export default GeneratedDateText;