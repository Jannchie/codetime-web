import { Outlet } from 'react-router-dom'
import { Flex } from 'roku-ui'

export function Aggrements () {
  return (
    <>
      <Flex
        justify="center"
        style={{ padding: 40 }}
      >
        <a href="/">
          <img
            alt="CodeTime Logo"
            width={80}
            src="/icon.svg"
          />
        </a>
      </Flex>
      <Outlet />
    </>
  )
}
