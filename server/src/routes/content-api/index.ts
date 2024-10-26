import menu from './menu'

export default {
  type: 'content-api', // can also be 'admin' depending on the type of route
  routes: [...menu],
}
