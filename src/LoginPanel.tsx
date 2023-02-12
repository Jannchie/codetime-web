import { Btn, Panel } from 'roku-ui';

export function LoginPanel() {
  return (
    <Panel padding>
      <Btn onClick={() => { window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`; }}>
        Login By Github
      </Btn>
    </Panel>
  );
}
