import { Container } from 'roku-ui';
import { LoginPanel } from './LoginPanel';

export function Home() {
  return (
    <Container style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1rem',
    }}>
      <LoginPanel />
    </Container>
  );
}
