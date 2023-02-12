import { Btn, Panel } from 'roku-ui';

export function LoginPanel() {
  return (
    <Panel padding>
      <Btn onClick={() => { window.location.href = 'http://127.0.0.1:8080/auth/github'; }}>
        Login By Github
      </Btn>
    </Panel>
  );
}
