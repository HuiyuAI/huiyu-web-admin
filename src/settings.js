module.exports = {
  /**
   * @type {string}
   * @description page title
   */
  title: 'Huiyu Admin',

  /**
   * @type {string}
   * @description base server url
   */
  baseServerUrl: 'http://localhost:8000',

  /**
   * @type {string}
   * @description logo URL
   */
  logo: 'icon.png',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {Array}
   * @description 默认展开的父级菜单
   */
  defaultOpeneds: ['/app', '/log', '/system', '/pictureHosting'],
}
