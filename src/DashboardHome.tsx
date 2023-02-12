import { Btn, Flex, MaterialSymbolIcon, pushNotice } from 'roku-ui';
import { Avatar, Container, Panel, TextField, Typography } from 'roku-ui';
import { useStats, useUserData, useUserDuration } from './api';


function getTimestampList(minutes: number = 30) {
  const now = new Date();
const timestampList = [];

for (let i = 0; i < minutes; i++) {
  const previousMinute = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes() - (i + 1),
    0,
    0
  );
  // add time offset
  const offset = now.getTimezoneOffset();
  previousMinute.setMinutes(previousMinute.getMinutes() - offset);
  const previousMinuteTimestamp = previousMinute.toISOString().split('.')[0] + 'Z';
  timestampList.push(previousMinuteTimestamp);
}
  return timestampList;
}

export function UserPanel() {
  const user = useUserData();
  const boolList = useBools(60);
  const duration = useUserDuration(1000 * 60 * 60 * 24);
  return (
    <Panel style={{ padding: '1rem' }} border>
      {user.data && (
        <Flex gap="1rem" align="center">
          <Avatar src={user.data.avatar} />
          {user.data.username}
          <div>
            Code today in {duration.data?.minutes} minutes.
          </div>
          <Flex gap={'0.25rem'}>
            {boolList.map((d, i) => (
              <div key={i} style={{ width: '0.3rem', height: '2rem', backgroundColor: d ? 'hsl(var(--r-primary-2))' : 'hsl(var(--r-default-2))' }}></div>
            ))}
          </Flex>
        </Flex>
      )}
    </Panel>
  );
}


function useBools(minutes=30) {
  const stats = useStats('minutes', minutes);
  if (!stats.data) return [];
  const allTimestamps = getTimestampList(minutes);
  const set = stats.data.data.reduce((acc: Set<string>, d: { time: any; }) => {
    acc.add(d.time);
    return acc;
  }, new Set<string>());
  const boolList = allTimestamps.map(d => set.has(d));
  return boolList.reverse();
}

export function TokenPanel() {
  const user = useUserData();
  return (
    <Panel style={{ padding: '1rem'}} border>
      {user.data && (
        <>
          <div style={{fontSize: '1.5rem', fontWeight: 'bolder'}}>Upload Token</div>
          <Flex gap="1rem">
            <TextField style={{width:'100%'}} defaultValue={user.data.upload_token} value={undefined} readOnly />
            <Btn onClick={() => {
              navigator.clipboard.writeText(user.data.upload_token);
              pushNotice({
                title: 'Copied',
                desc: 'Token copied to clipboard',
                type: 'success',
              });
            }}> <MaterialSymbolIcon icon="cut"></MaterialSymbolIcon> Copy </Btn>
          </Flex>
        </>
      )}
    </Panel>
  );
}
export function DashboardHome() {
  return (
    <Container style={{ padding: '1rem' }}>
      <Typography.H1>
        Dashboard
      </Typography.H1>
      <Flex gap='1rem' direction='column'>
        <UserPanel />
        <TokenPanel></TokenPanel>
      </Flex>
    </Container>
  );
}
