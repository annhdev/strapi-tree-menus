import { Box, Button, Card, Flex } from '@strapi/design-system'
import { Layout, Plus } from '@strapi/icons'
import { BackButton, Layouts, Page } from '@strapi/strapi/admin'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import { UID_MENU } from '../../../shared/constants'
import { getTranslation } from '../utils/getTranslation'

const Action = ({ children, onClick, size, variant }: any) => (
  <Button onClick={onClick} startIcon={<Plus />} variant={variant} size={size}>
    {children}
  </Button>
)

const HomePage = () => {
  const { formatMessage } = useIntl()
  const navigate = useNavigate()

  const onClickCreate = () => {
    navigate(`/content-manager/collection-types/${UID_MENU}/create`)
  }

  const onClickContentTypeBuilder = () => {
    navigate(`/plugins/content-type-builder/content-types/${UID_MENU}`)
  }

  return (
    <Layouts.Root>
      <Page.Title>{formatMessage({ id: getTranslation('plugin.name') })}</Page.Title>
      <Page.Main>
        <Layouts.Header
          title={formatMessage({ id: getTranslation('plugin.name') })}
          subtitle={formatMessage({
            id: getTranslation('index.header.description'),
            defaultMessage: 'Create and manage Menus',
          })}
          primaryAction={
            <Action onClick={onClickCreate}>
              {formatMessage({
                id: getTranslation('ui.create.menu'),
                defaultMessage: 'Create new menu',
              })}
            </Action>
          }
          navigationAction={<BackButton disabled={undefined} />}
        />

        <Layouts.Content>
          <Flex direction='column' alignItems='stretch' gap={3}>
            <Box>
              <Card padding={5}>
                <Box>
                  <Flex
                    width={'100%'}
                    minHeight={'50vh'}
                    direction='column'
                    alignItems='center'
                    justifyContent={'center'}
                    gap={3}
                  >
                    <Action onClick={onClickCreate}>
                      {formatMessage({
                        id: getTranslation('ui.create.menu'),
                        defaultMessage: 'Create new menu',
                      })}
                    </Action>
                    <Action variant={'secondary'} icon={<Layout />} onClick={onClickContentTypeBuilder}>
                      {formatMessage({
                        id: getTranslation('ui.content-type.builder'),
                        defaultMessage: 'Build content types',
                      })}
                    </Action>
                  </Flex>
                </Box>
              </Card>
            </Box>
          </Flex>
        </Layouts.Content>
      </Page.Main>
    </Layouts.Root>
  )
}

export { HomePage }
