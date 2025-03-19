import type { ThemeConfig } from 'antd/es/config-provider'

const primaryColor = '#46694f'
const primaryColorHover = '#5b7f63'
const primaryColorActive = '#3a5c44'
const primaryColorBg = '#f0f5f2'
const primaryColorBgHover = '#d9e4dc'
const borderRadiusBase = 8

const theme: ThemeConfig = {
  token: {
    colorPrimary: primaryColor,
    colorPrimaryHover: primaryColorHover,
    colorPrimaryActive: primaryColorActive,
    colorPrimaryBorder: primaryColor,

    colorPrimaryBg: primaryColorBg,
    colorPrimaryBgHover: primaryColorBgHover,

    colorBgLayout: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgBase: '#ffffff',

    borderRadius: borderRadiusBase,

    paddingSM: 8,
    padding: 12,
    paddingLG: 16,

    fontSize: 14,
    fontFamily: "'Roboto', 'Arial', sans-serif",
  },
  components: {
    Menu: {
      itemBorderRadius: 8,
      itemSelectedBg: '#46694f',
      itemSelectedColor: '#ffffff',
      itemHoverColor: '#3a5c44',
      itemHoverBg: '#f0f5f2',
    },
    Button: {
      borderRadius: borderRadiusBase,
      colorPrimary: primaryColor,
      colorPrimaryHover: primaryColorHover,
      colorPrimaryActive: primaryColorActive,
      colorPrimaryBorder: primaryColor,
    },
    Input: {
      borderRadius: borderRadiusBase,
    },
    Select: {
      borderRadius: borderRadiusBase,
    },
    Table: {
      borderRadius: borderRadiusBase,
    },
    Card: {
      borderRadius: 12,
    },
    Layout: {},
  },
}

export default theme
