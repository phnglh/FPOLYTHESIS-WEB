import type { ThemeConfig } from 'antd/es/config-provider'

const primaryColor = '#46694f'
const primaryColorHover = '#5b7f63'
const primaryColorActive = '#3a5c44'
const primaryColorBg = '#f5f8f6'
const primaryColorBgHover = '#e6efe8'
const borderRadiusBase = 10

const theme: ThemeConfig = {
  token: {
    colorPrimary: primaryColor,
    colorPrimaryHover: primaryColorHover,
    colorPrimaryActive: primaryColorActive,
    colorPrimaryBorder: primaryColor,

    colorPrimaryBg: primaryColorBg,
    colorPrimaryBgHover: primaryColorBgHover,

    colorBgLayout: '#fafafa',
    colorBgContainer: '#ffffff',
    colorBgBase: '#ffffff',

    colorText: '#333333',
    colorTextSecondary: '#666666',

    borderRadius: borderRadiusBase,

    paddingSM: 10,
    padding: 14,
    paddingLG: 18,

    fontSize: 15,
    fontFamily: "'Inter', 'Roboto', 'Arial', sans-serif",
  },
  components: {
    Input: {
      borderRadius: borderRadiusBase,
      colorBgContainer: '#ffffff',
      colorBorder: '#d9d9d9',
      controlHeight: 42,
    },
    Select: {
      borderRadius: borderRadiusBase,
      colorBgContainer: '#ffffff',
      colorBorder: '#d9d9d9',
      controlHeight: 42,
    },
    Button: {
      borderRadius: borderRadiusBase,
      colorPrimary: primaryColor,
      colorPrimaryHover: primaryColorHover,
      colorPrimaryActive: primaryColorActive,
      colorPrimaryBorder: primaryColor,
      paddingInlineLG: 24,
      paddingBlockLG: 12,
      controlHeight: 42,
    },
    Menu: {
      itemBorderRadius: 8,
      itemSelectedBg: primaryColor,
      itemSelectedColor: '#ffffff',
      itemHoverColor: primaryColorActive,
      itemHoverBg: primaryColorBg,
      itemHeight: 48,
      horizontalItemBorderRadius: 8,
    },
    Card: {
      borderRadius: 16,
      padding: 20,
    },
    Table: {
      borderRadius: borderRadiusBase,
      headerBg: '#f8faf9',
      rowHoverBg: '#f5f8f6',
    },
    Drawer: {
      colorBgElevated: '#ffffff',
      paddingLG: 24,
      padding: 18,
    },
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#fafafa',
      footerBg: '#ffffff',
      siderBg: '#ffffff',
    },
    Switch: {
      handleSize: 26,
      innerMaxMargin: 32,
      trackHeight: 30,
    },
  },
}

export default theme
