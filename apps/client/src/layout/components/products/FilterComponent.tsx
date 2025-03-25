import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Layout,
  Collapse,
  Checkbox,
  Slider,
  Select,
  Tag,
  Space,
  Typography,
  Button,
} from 'antd'
import { fetchBrands } from '@store/slices/brandSlice'
import { fetchCategories } from '@store/slices/categorySlice'
import { fetchAttributes } from '@store/slices/attributeSlice'
import { AppDispatch, RootState } from '@store/store'

const { Sider } = Layout
const { Panel } = Collapse
const { Title } = Typography

const FilterComponent = ({ selectedFilters, setSelectedFilters }) => {
  const dispatch = useDispatch<AppDispatch>()

  // Lấy dữ liệu từ Redux store
  const categories = useSelector((state: RootState) => state.categories.data)
  const brands = useSelector((state: RootState) => state.brands.data)
  const attributes = useSelector((state: RootState) => state.attributes.data)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchBrands())
    dispatch(fetchAttributes())
  }, [dispatch])

  // Xử lý chọn filter
  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: key === 'brand' || key === 'category' ? value.map(Number) : value,
    }))
  }

  return (
    <Sider
      width={350}
      style={{ background: '#fff', padding: 20, borderRadius: 8 }}
    >
      <Title level={3}>Bộ lọc sản phẩm</Title>

      <Collapse>
        {categories?.map((category) => (
          <Panel header={category.name} key={category.id}>
            <Space direction="vertical">
              {/* {category?.items.map((item) => (
                <Checkbox
                  key={item.id}
                  onChange={(e) =>
                    handleFilterChange(
                      'category',
                      e.target.checked ? item.id : null,
                    )
                  }
                >
                  {item.name}
                </Checkbox>
              ))} */}
            </Space>
          </Panel>
        ))}
      </Collapse>

      {/* Lọc khoảng giá */}
      <Title level={5}>Khoảng giá</Title>
      <Slider
        range
        min={100000}
        max={10000000}
        step={50000}
        defaultValue={[500000, 5000000]}
        onChange={(value) => handleFilterChange('priceRange', value)}
      />

      {/* Lọc theo thương hiệu */}
      <Title level={5}>Thương hiệu</Title>
      <Select
        mode="multiple"
        placeholder="Chọn thương hiệu"
        style={{ width: '100%' }}
        onChange={(value) => handleFilterChange('brand', value)}
      >
        {brands?.map((brand) => (
          <Select.Option key={brand.id} value={brand.id}>
            {brand.name}
          </Select.Option>
        ))}
      </Select>

      <Collapse style={{ marginTop: 20 }}>
        {attributes?.map((attr) => (
          <Panel header={attr.name} key={attr.id}>
            <Space direction="vertical">
              {attr.values.map((valObj) => (
                <Checkbox
                  key={valObj.id}
                  onChange={(e) => {
                    const selectedValues = selectedFilters[attr.name] || []
                    handleFilterChange(
                      attr.name,
                      e.target.checked
                        ? [...selectedValues, valObj.value]
                        : selectedValues.filter((v) => v !== valObj.value),
                    )
                  }}
                >
                  {valObj.value}
                </Checkbox>
              ))}
            </Space>
          </Panel>
        ))}
      </Collapse>

      {Object.values(selectedFilters).some((val) => val.length > 0) && (
        <div style={{ marginTop: 20 }}>
          <Title level={5}>Đã chọn:</Title>
          <Space wrap>
            {Object.entries(selectedFilters).map(([key, value]) =>
              value.length > 0 ? (
                <Tag
                  closable
                  key={key}
                  onClose={() => handleFilterChange(key, [])}
                >
                  {key}: {Array.isArray(value) ? value.join(', ') : value}
                </Tag>
              ) : null,
            )}
          </Space>
          <Button
            type="link"
            danger
            onClick={() =>
              setSelectedFilters((prev) =>
                Object.keys(prev).reduce(
                  (acc, key) => ({ ...acc, [key]: [] }),
                  {},
                ),
              )
            }
          >
            Bỏ hết
          </Button>
        </div>
      )}
    </Sider>
  )
}

export default FilterComponent
