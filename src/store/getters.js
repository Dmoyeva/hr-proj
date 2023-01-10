const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  username: state => state.user.userinfo.username,
  avatar: state => state.user.userinfo.staffPhoto,
  companyId: state => state.user.userinfo.companyId
  // name: state => state.user.name
}
export default getters
