import apiClient from '@store/services/apiClient'
import { Table } from 'antd'
import { useEffect } from 'react'

export default function AddressPage() {
  const fetchAddress = async () => {
    const res = await apiClient.get('/user-address')
  }
  useEffect(() => {}, [])
  return <Table />
}
