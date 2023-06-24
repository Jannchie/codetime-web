import { Flex } from 'roku-ui'

export function Aggrements ({ children }: { children: React.ReactNode }) {
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
      { children }
    </>
  )
}
