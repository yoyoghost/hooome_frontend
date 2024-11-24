import React from 'react';
import { Table } from 'antd';
import { createStyles } from 'antd-style';

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const columns = [
  {
    title: '股票名称',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: '交易日期',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
  },
  {
    title: '操作方式',
    dataIndex: 'address',
    key: '1',
    width: 150,
  },
  {
    title: '交易点位',
    dataIndex: 'address',
    key: '2',
    width: 150,
  },
  {
    title: '交易数量',
    dataIndex: 'address',
    key: '3',
    width: 150,
  },
  {
    title: '剩余交易数量',
    dataIndex: 'address',
    key: '4',
    width: 150,
  },
  {
    title: '交易金额',
    dataIndex: 'address',
    key: '5',
    width: 150,
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: () => <a>action</a>,
  },
];

const dataSource = Array.from({
  length: 100,
}).map((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}));

const InProgressOrderPage = () => {
  const { styles } = useStyle();
  return (
    <Table
      className={styles.customTable}
      columns={columns}
      dataSource={dataSource}
      scroll={{
        x: 'max-content',
        y: 55 * 5,
      }}
    />
  );
};
export default InProgressOrderPage;