import { getAllDistrict, getAllProvince, getAllWard } from '@/api/services/map'
import { createUser } from '@/api/services/UserService'
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Space, Upload, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const { Option } = Select

const AddUser: React.FC = () => {
  const { control, setValue, handleSubmit } = useForm()
  const navigate = useNavigate()
  const [avatarFileList, setAvatarFileList] = useState<any[]>([])
  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [selectedProvince, setSelectedProvince] = useState<any>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null)

  useEffect(() => {
    const fetchProvinces = async () => {
      const provincesData = await getAllProvince()
      setProvinces(provincesData)
    }
    fetchProvinces()
  }, [])

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        const districtsData = await getAllDistrict(selectedProvince)
        setDistricts(districtsData)
      } else {
        setDistricts([])
      }
    }
    fetchDistricts()
  }, [selectedProvince])

  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrict) {
        const wardsData = await getAllWard(selectedDistrict)
        setWards(wardsData)
      } else {
        setWards([])
      }
    }
    fetchWards()
  }, [selectedDistrict])

  const onSubmit = async (data: any) => {
    try {
      const provinceName =
        provinces.find((p) => p.province_id === data.city)?.province_name || ''
      const districtName =
        districts.find((d) => d.district_id === data.district)?.district_name ||
        ''
      const wardName =
        wards.find((w) => w.ward_id === data.ward)?.ward_name || ''
      const fullAddress = `${data.address}, ${wardName}, ${districtName}, ${provinceName}`

      await createUser({
        ...data,
        avatar: avatarFileList[0]?.originFileObj,
        address: fullAddress,
      })
      notification.success({
        message: 'User Added',
        description: 'The user has been successfully added.',
      })
      navigate('/quan-ly-nguoi-dung')
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'There was an error adding the user.',
      })
    }
  }
  const handleAvatarChange = (info: any) => {
    let fileList = [...info.fileList]
    fileList = fileList.slice(-1)
    setAvatarFileList(fileList)
  }

  const beforeUpload = (file: File) => {
    setAvatarFileList([file])
    return false
  }
  return (
    <div className="container mx-auto mt-10 bg-white p-5 shadow-lg">
      <h2 className="my-10 text-2xl font-semibold text-gray-700">
        Thêm người dùng
      </h2>
      <div className="flex flex-wrap">
        <div className="mb-4 w-full pr-0 md:mb-0 md:w-1/3 md:pr-4">
          <div className="avatar">
            <Form.Item label="Avatar" className="text-center">
              <Upload
                listType="picture-card"
                fileList={avatarFileList}
                beforeUpload={beforeUpload}
                onChange={handleAvatarChange}
                maxCount={1}
              >
                {avatarFileList.length === 0 && (
                  <div>
                    <UploadOutlined style={{ fontSize: 32 }} />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <Form
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="mb-5 flex space-x-4">
              <div className="flex-grow">
                <Form.Item label="Họ và tên:">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        size="large"
                        style={{ height: 50 }}
                        {...field}
                        placeholder="Họ và tên"
                      />
                    )}
                  />
                </Form.Item>
              </div>
              <div className="flex-grow">
                <Form.Item label="Email">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        size="large"
                        style={{ height: 50 }}
                        {...field}
                        placeholder="Email"
                      />
                    )}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="mb-5 flex space-x-4">
              <div className="flex-grow">
                <Form.Item label="Số Điện Thoại">
                  <Controller
                    name="number"
                    control={control}
                    render={({ field }) => (
                      <Input
                        size="large"
                        style={{ height: 50 }}
                        {...field}
                        placeholder="Số Điện Thoại"
                      />
                    )}
                  />
                </Form.Item>
              </div>
              <div className="flex-grow">
                <Form.Item label="Mật khẩu">
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input.Password
                        size="large"
                        style={{ height: 50 }}
                        {...field}
                        placeholder="Mật khẩu"
                      />
                    )}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="mb-5 flex space-x-4">
              <div className="flex-grow">
                <Form.Item label="Chọn tỉnh / thành phố">
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Select
                        size="large"
                        style={{ height: 50 }}
                        {...field}
                        placeholder="Chọn một tỉnh/thành phố"
                        onChange={(value) => {
                          setSelectedProvince(value)
                          setValue('city', value)
                        }}
                      >
                        {provinces.map((province) => (
                          <Option
                            key={province.province_id}
                            value={province.province_id}
                          >
                            {province.province_name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                </Form.Item>
              </div>
              <div className="flex-grow">
                <Form.Item label="Quận/Huyện">
                  <Controller
                    name="district"
                    control={control}
                    render={({ field }) => (
                      <Select
                        size="large"
                        style={{ height: 50 }}
                        {...field}
                        placeholder="Chọn một quận/huyện"
                        onChange={(value) => {
                          setSelectedDistrict(value)
                          setValue('district', value)
                        }}
                        disabled={!selectedProvince}
                      >
                        {districts.map((district) => (
                          <Option
                            key={district.district_id}
                            value={district.district_id}
                          >
                            {district.district_name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="mb-5 flex space-x-4">
              <div className="flex-grow">
                <Form.Item label="Phường/Xã">
                  <Controller
                    name="ward"
                    control={control}
                    render={({ field }) => (
                      <Select
                        size="large"
                        style={{ height: 50 }}
                        {...field}
                        placeholder="Chọn một phường/xã"
                        onChange={(value) => setValue('ward', value)}
                        disabled={!selectedDistrict}
                      >
                        {wards.map((ward) => (
                          <Option key={ward.ward_id} value={ward.ward_id}>
                            {ward.ward_name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="mb-5 flex space-x-4">
              <div className="flex-grow">
                <Form.Item label="Nhập địa chỉ cụ thể">
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <Input
                        size="large"
                        style={{ height: 50 }}
                        {...field}
                        placeholder="Nhập địa chỉ cụ thể"
                      />
                    )}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="mb-5 flex space-x-4">
              <div className="flex-grow">
                <Form.Item label="Ủy Quyền">
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select
                        size="large"
                        style={{ height: 50 }}
                        {...field}
                        placeholder="Chọn một vai trò"
                      >
                        <Option value={1}>Tài Khoản Khách Hàng</Option>
                        <Option value={0}>Admin</Option>
                      </Select>
                    )}
                  />
                </Form.Item>
              </div>
            </div>
            <Form.Item>
              <Space size="large">
                <Button size="large" type="primary" htmlType="submit">
                  Thêm User
                </Button>
                <Button
                  size="large"
                  type="default"
                  className="bg-red-500 text-white"
                  onClick={() => navigate('/admin/quan-ly-nguoi-dung')}
                  icon={<ArrowLeftOutlined />}
                >
                  Quay Lại
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default AddUser
