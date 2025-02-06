import { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Box,
  Button,
  Badge,
} from '@mui/material'
import {
  Search,
  FavoriteBorder,
  ShoppingCart,
  AccountCircle,
} from '@mui/icons-material'
import { styled, alpha } from '@mui/material/styles'

const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginLeft: theme.spacing(2),
  width: '100%',
  maxWidth: 400,
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  padding: theme.spacing(1, 1, 1, 0),
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
}))

export default function Navbar() {
  const [hideTopBar, setHideTopBar] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setHideTopBar(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: '#3d5a40',
          transition: '0.3s',
          height: hideTopBar ? 0 : 64,
          overflow: 'hidden',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', display: hideTopBar ? 'none' : 'block' }}
          >
            SPORT OH!
          </Typography>

          <SearchBox sx={{ display: hideTopBar ? 'none' : 'block' }}>
            <SearchIconWrapper>
              <Search />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Tìm kiếm sản phẩm..." />
          </SearchBox>

          <Box
            sx={{
              display: hideTopBar ? 'none' : 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <IconButton color="inherit">
              <FavoriteBorder />
            </IconButton>
            <Button color="inherit" startIcon={<AccountCircle />}>
              Đăng ký / Đăng nhập
            </Button>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Thanh điều hướng cố định */}
      <AppBar
        position="sticky"
        sx={{
          top: hideTopBar ? 0 : 64,
          background: '#000',
          transition: '0.3s',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button color="inherit">Trang chủ</Button>
            <Button color="inherit">Giới thiệu</Button>
            <Button color="inherit">Sản phẩm</Button>
            <Button color="inherit">Tin tức</Button>
            <Button color="inherit">Liên hệ</Button>
            <Button color="inherit">Hệ thống cửa hàng</Button>
          </Box>
          <Typography variant="body1" color="success">
            📞 Hotline: 1800.6750
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  )
}
