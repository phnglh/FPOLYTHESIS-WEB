// styles/theme.ts
import type { ThemeConfig } from 'antd/es/config-provider'

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#46694f',
    colorPrimaryHover: '#5b7f63',
    colorPrimaryActive: '#3a5c44',
    colorPrimaryBorder: '#46694f',

    colorPrimaryBg: '#f0f5f2',
    colorPrimaryBgHover: '#d9e4dc',

    borderRadius: 8,

    paddingSM: 8,
    padding: 12,
    paddingLG: 16,

    fontSize: 14,
    fontFamily: "'Roboto', 'Arial', sans-serif",
  },
  components: {
    Button: {
      borderRadius: 8,
      colorPrimary: '#46694f',
      colorPrimaryHover: '#5b7f63',
      colorPrimaryActive: '#3a5c44',
      colorPrimaryBorder: '#46694f',
    },
    Input: {
      borderRadius: 8,
    },
    Select: {
      borderRadius: 8,
    },
    Table: {
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
    },
  },
}

export default theme
