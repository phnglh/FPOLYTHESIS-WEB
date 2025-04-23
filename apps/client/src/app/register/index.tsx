import { Form, Input, Button, Card, Typography } from 'antd'
import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@store/store'
import { register as registerAction } from '@store/slices/authSlice'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'

const { Title, Text } = Typography

const schema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên'),

  email: yup
    .string()
    .email('Vui lòng nhập email hợp lệ')
    .required('Vui lòng nhập email'),
  password: yup
    .string()
    .min(8, 'Mật khẩu ít nhất 8 ký tự')
    .matches(/[A-Z]/, 'Mật khẩu cần có ít nhất một chữ cái in hoa')
    .matches(/[a-z]/, 'Mật khẩu cần có ít nhất một chữ cái thường')
    .matches(/[0-9]/, 'Mật khẩu cần có ít nhất một chữ số')
    .matches(/[\W_]/, 'Mật khẩu cần có ít nhất một ký tự đặc biệt')
    .required('Vui lòng nhập mật khẩu'),

  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp')
    .required('Vui lòng nhập lại mật khẩu'),
})

const Register = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (values: any) => {
    dispatch(registerAction(values))
      .unwrap()
      .then(() => {
        toast.success('Đăng ký thành công!')
      })
      .catch((err) => {
        toast.error(err)
      })
  }

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={2} style={styles.title}>
          ĐĂNG KÝ
        </Title>
        <Text style={styles.text}>
          Đã có tài khoản? <a href="/login">Đăng nhập tại đây</a>
        </Text>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Tên" />}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Email" />}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password {...field} placeholder="Mật khẩu" />
              )}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.password_confirmation ? 'error' : ''}
            help={errors.password_confirmation?.message}
          >
            <Controller
              name="password_confirmation"
              control={control}
              render={({ field }) => (
                <Input.Password {...field} placeholder="Nhập lại mật khẩu" />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={styles.registerButton}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <Text style={styles.text}>Hoặc đăng nhập bằng</Text>

        <div style={styles.socialButtons}>
          <Button
            icon={<FacebookOutlined />}
            style={styles.facebookButton}
            block
          >
            Facebook
          </Button>
          <Button icon={<GoogleOutlined />} style={styles.googleButton} block>
            Google
          </Button>
        </div>
      </Card>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
    alignItems: 'center',
    background: '#f8f9fa',
  },
  card: {
    width: 400,
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center' as const,
  },
  text: {
    display: 'block',
    textAlign: 'center' as const,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#2D6A4F',
  },
  socialButtons: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    color: 'white',
  },
  googleButton: {
    backgroundColor: '#DB4437',
    color: 'white',
  },
}

export default Register
