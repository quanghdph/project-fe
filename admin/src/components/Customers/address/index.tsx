// src/components/AddressPage.tsx
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Card,
  Table,
  Space,
  Modal,
  Select,
} from "antd";
import { getListAddressCustomer } from "src/features/customer/action";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { createAxiosJwt } from "src/helper/axiosInstance";
import { PaginationProps } from "antd/es/pagination";
import { useDebounce } from "use-debounce";

type FormData = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

const AddressPage: React.FC = () => {
  const [data, setData] = useState<FormData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FormData | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");

  const [customerOption, setCustomerOption] = useState();
  const [search, setSearch] = useState<string>("");
  const [value] = useDebounce(search, 1000);

  const navigate = useNavigate();

  // ** Variables
  const customer = useAppSelector((state) => state.customer);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phường",
      dataIndex: "ward",
      key: "ward",
    },
    {
      title: "Quận",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Thành phố",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Mã địa chỉ",
      dataIndex: "addressCode",
      key: "addressCode",
    },
    {
      title: "Địa chỉ chi tiết",
      dataIndex: "addressDetail",
      key: "addressDetail",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text: string, record: FormData) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    reset();
    setIsModalVisible(true);
  };

  const handleOk: SubmitHandler<FormData> = (values) => {
    if (selectedItem) {
      // Update existing item
      const updatedData = data.map((item) =>
        item === selectedItem ? { ...item, ...values } : item,
      );
      setData(updatedData);
    } else {
      // Add new item
      setData([...data, values]);
    }

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (record: FormData) => {
    setSelectedItem(record);
    Object.entries(record).forEach(([key, value]) => {
      setValue(key as keyof FormData, value);
    });
    showModal();
  };

  const handleDelete = (record: FormData) => {
    const filteredData = data.filter((item) => item !== record);
    setData(filteredData);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchFunction = getListAddressCustomer;

      try {
        const params = { page: page, limit: limit, filter: filter };
        await fetchFunction({
          params,
          navigate,
          axiosClientJwt,
          dispatch,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [page, limit]);

  const dataRender = (): any => {
    if (!customer.listAddress.loading && customer.listAddress.result) {
      if (customer.listAddress.result.listAddresses) {
        return customer.listAddress.result.listAddresses.map(
          (address, index: number) => {
            return {
              key: index,
              id: address.id,
              name: `${address.customer.firstName} ${address.customer.lastName}`,
              ward: address.ward,
              district: address.district,
              city: address.city,
              addressCode: address.addressCode,
              addressDetail: address.addressDetail,
            };
          },
        );
      }
    }
    return [];
  };

  const handleOnChangePagination = (e: number) => {
    setPage(e);
  };

  const handleOnShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize,
  ) => {
    setPage(current);
    setLimit(pageSize);
  };

  useEffect(() => {
    if (!customer.list.loading && customer.list.result) {
      const listOption = customer.list.result.listCustomer
        ? customer.list.result.listCustomer.map((item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          }))
        : customer.list.result.map((item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          }));
      if (!value) {
        setCustomerOption(listOption);
      } else {
        listOption && setCustomerOption(listOption);
      }
    }
  }, [customer.list.result, customer.list.loading, value]);

  const onCustomerChange = (value: string) => {
    // if (!customer?.list.loading && customer.list.result?.listCustomer) {
    //   const currentCustomerSelect = customer.list.result?.listCustomer.filter(
    //     (e) => value == e.id,
    //   );
    //   setValue("customer", currentCustomerSelect[0]);
    // }
  };

  const onCustomerSearch = (value: string) => {
    setSearch(value);
  };

  const filterCustomerOption = (): any => {
    return customerOption;
  };

  return (
    <Row>
      <Col span={24}>
        <Card title="Danh sách địa chỉ">
          <Button
            type="primary"
            onClick={showModal}
            style={{ marginBottom: 16 }}
          >
            Thêm địa chỉ
          </Button>

          <Table
            dataSource={dataRender()}
            columns={columns}
            loading={customer.listAddress.loading}
            pagination={{
              total: customer.listAddress.result?.total,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              defaultCurrent: page,
              onChange: handleOnChangePagination,
              onShowSizeChange: handleOnShowSizeChange,
              defaultPageSize: limit,
              responsive: true,
            }}
          />

          <Modal
            title={selectedItem ? "Sửa địa chỉ" : "Thêm mới địa chỉ"}
            open={isModalVisible}
            onOk={handleSubmit(handleOk)}
            onCancel={handleCancel}
          >
            <Form layout="vertical">
              <Form.Item>
                <Select
                  {...control}
                  showSearch
                  placeholder="Tìm kiếm khách hàng"
                  optionFilterProp="children"
                  onChange={onCustomerChange}
                  onSearch={onCustomerSearch}
                  filterOption={filterCustomerOption}
                  style={{ width: "100%" }}
                  options={customerOption}
                />
              </Form.Item>
              <Form.Item
                label="Phường"
                name="ward"
                rules={[
                  {
                    required: true,
                    message: "Please enter the street address!",
                  },
                ]}
              >
                <Input {...control} />
              </Form.Item>

              <Form.Item
                label="Quận"
                name="district"
                rules={[
                  { required: true, message: "Please enter the district!" },
                ]}
              >
                <Input {...control} />
              </Form.Item>

              <Form.Item
                label="Thành phố"
                name="city"
                rules={[{ required: true, message: "Please enter the city!" }]}
              >
                <Input {...control} />
              </Form.Item>

              <Form.Item
                label="Địa chỉ chi tiết"
                name="addressDetail"
                rules={[
                  { required: true, message: "Please enter the zip code!" },
                ]}
              >
                <Input {...control} />
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </Col>
    </Row>
  );
};

export default AddressPage;
