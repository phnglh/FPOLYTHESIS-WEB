import { Address } from '@app/checkout'
import apiClient from '@store/services/apiClient'
import { Button, Space, Table } from 'antd'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const fetchAddress = async () => {
    const res = await apiClient.get('/user-addresses')
    setAddresses(res.data.data || [])
  }

  const deleteAddress = async (id: number) => {
    try {
      await apiClient.delete(`/user-addresses/${id}`)
      setAddresses((prev) => prev.filter((address) => address.id !== id))
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress(id)
      toast.success('Address deleted successfully')
      fetchAddress()
    } catch (error) {
      toast.error('Failed to delete address')
    }
  }
  useEffect(() => {
    fetchAddress()
  }, [])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'receiver_name',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'receiver_phone',
      key: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (_: string, record) => (
        <Space>
          <Button
            danger
            onClick={() => {
              handleDelete(record.id)
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]
  return <Table columns={columns} dataSource={addresses} rowKey="id" />
}
