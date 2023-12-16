import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import './style.scss';
import * as borrowBookService from '../../services/BorrowBookService.js';
import { Dropdown } from 'semantic-ui-react';

const HomePage = () => {
  const [barData, setBarData] = useState(null);
  const [typeVertical, setTypeVertical] = useState([1, 2]);
  const [publishMonth, setPublishMonth] = useState(11);
  const [publishYear, setPublishYear] = useState(2023);

  const years = Array.from({ length: 50 }, (_, index) => {
    const currentYear = new Date().getFullYear();
    return { key: currentYear - index, text: `${currentYear - index}`, value: currentYear - index };
  });

  const months = [
    { key: 1, text: '1', value: 1 },
    { key: 2, text: '2', value: 2 },
    { key: 3, text: '3', value: 3 },
    { key: 4, text: '4', value: 4 },
    { key: 5, text: '5', value: 5 },
    { key: 6, text: '6', value: 6 },
    { key: 7, text: '7', value: 7 },
    { key: 8, text: '8', value: 8 },
    { key: 9, text: '9', value: 9 },
    { key: 10, text: '10', value: 10 },
    { key: 11, text: '11', value: 11 },
    { key: 12, text: '12', value: 12 },
  ];

  const fetchData = async () => {
    try {
      const typeParam = JSON.stringify(typeVertical);
      const result = await borrowBookService.aggregateByMonth({ getBy: typeParam, month: publishMonth, year: publishYear });

      // Tạo một mảng các ngày trong tháng (1 đến 31)
      const allDaysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

      // Biến đổi dữ liệu để tạo biểu đồ Bar
      const labels = allDaysInMonth.map(day => `${day}`);
      const dataValues = allDaysInMonth.map(day => {
        const foundItem = result.find(item => item._id === day);
        return foundItem ? foundItem.soLuong : 0;
      });

      // Sử dụng dữ liệu để cập nhật state
      setBarData({
        labels: labels,
        datasets: [
          {
            label: 'Ngày',
            data: dataValues,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FFD700', '#00FF00'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FFD700', '#00FF00'],
          },
        ],
      });
    } catch (error) {
      console.error('ERR: ', error);
      setBarData(null); // Đặt barData thành null nếu có lỗi
    }
  };

  useEffect(() => {
    fetchData();
  }, [typeVertical, publishMonth, publishYear]);

  // Dữ liệu và tùy chọn cho biểu đồ Bar
  const barOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className='CombinedChartsPage'>
      {/* Biểu đồ Bar */}
      <div className='ChartContainer'>
        <select
          style={{
            fontSize: "16px",
            padding: "8px",
            marginRight: "10px"
          }}
          onChange={(e) => setTypeVertical(JSON.parse(e.target.value))}
          value={JSON.stringify(typeVertical)}
        >
          <option value={JSON.stringify([1, 2])}>Tổng đơn</option>
          <option value={JSON.stringify([1])}>Đơn mượn</option>
          <option value={JSON.stringify([2])}>Đơn trả</option>
        </select>
        <label style={{
          fontSize: "16px",
          padding: "8px",
        }}>Tháng</label>
        <Dropdown
          placeholder="Select Month"
          value={publishMonth}
          selection
          options={months}
          onChange={(_, data) => setPublishMonth(data.value)}
          style={{
            marginRight: "10px"
          }}
        />

        <label
          style={{
            fontSize: "16px",
            padding: "8px",
          }}>Năm</label>
        <Dropdown
          placeholder="Select Year"
          value={publishYear}
          selection
          options={years}
          onChange={(_, data) => setPublishYear(data.value)}
        />

        {barData ? <Bar data={barData} options={barOptions} /> : <div>No data available</div>}
      </div>
    </div>
  );
};

export default HomePage;
