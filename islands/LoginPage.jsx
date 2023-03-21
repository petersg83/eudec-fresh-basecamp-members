import { useState } from "preact/hooks";

function LoginPage(props) {
  const [password, setPassword] = useState('');
  const [wrongPassword, setWrongPassword] = useState(props.wrongPassword);

  const onChange = (e) => {
    setWrongPassword(false);
    setPassword(e.target.value)
  }; 

  return <form method="post" action={props.action}>
    <label style={{ marginRight: '0.5em' }}>Mot de passe:</label>
    <input style={{ marginRight: '0.5em' }} type="password" name="password" onInput={onChange} value={password} />
    <input type="submit" value="Envoyer" />
    {wrongPassword && <p style={{ color: 'red', fontSize: '0.8em' }}>Mauvais mot de passe</p>}
  </form>
}

export default LoginPage;

