import { Btn, Container, Footer } from 'roku-ui';
export function Home() {
  return (
    <>
      <div style={{ margin: '0rem 20rem', textAlign: 'center', }}>
        <div style={{
          fontSize: '7rem',
          fontWeight: 'bold',
          margin: '6rem 0rem 0rem 0rem',
        }}>
          <span>
          Code.
          </span>
          <span>
            Time
          </span>
        </div>
        <div className='text-frontground-3'>
          CodeTime is a productivity tool for software developers. It helps developers track the amount of time they spend on coding projects, and provides insights into their coding habits and productivity.
        </div>
        <Btn size="lg" border style={{marginTop: '1rem'}} onClick={() => { window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`; }}>
          Login By Github
        </Btn>
      </div>

      <Container style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
      }}>
        {/* <LoginPanel /> */}
      </Container>
      <Footer style={{ position: 'sticky', top: '100vh' }} >
        Datreks @ {new Date().getFullYear()}
      </Footer>
    </>
  );
}
