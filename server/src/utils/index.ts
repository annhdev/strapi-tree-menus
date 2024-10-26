import { MenuItem } from '../../../shared/contracts/menus'

const sanitizeInputRequest = (items: MenuItem[], parentId?: string) => {
  items.forEach((item, index) => {
    let itemId = ''
    if (typeof parentId !== 'undefined') {
      itemId = `${parentId}.${index + 1}`
    } else {
      itemId = `${index + 1}`
    }
    item.id = itemId

    if (item.children) {
      item.children = sanitizeInputRequest(item.children, itemId)
    }
  })
  return items
}

export { sanitizeInputRequest }
