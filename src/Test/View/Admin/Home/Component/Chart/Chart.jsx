import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import Loading from "../Customer/Loading";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

const ChartComponent = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}chart`, {
          headers: {
            Authorization: "tangkas",
            "Content-Type": "application/json",
          },
        });

        setChartData(response.data);
      } catch (error) {
      
      }
    };

    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    if (chartData) {
      const existingChart = Chart.getChart("myChart");
      if (existingChart) {
        existingChart.destroy();
      }

      const ctx = document.getElementById("myChart");

      if (ctx) {
        const filteredData = selectedYear
          ? chartData.monthlyEarnings.filter((data) =>
              data.month.startsWith(selectedYear)
            )
          : chartData.monthlyEarnings;

        const shouldUseLineChart = filteredData.length > 4;

        const data = {
          labels: filteredData.map((data) => data.month),
          datasets: [
            {
              label: "Traffic Pendapatan",
              data: filteredData.map((data) => data.totalEarnings),
              backgroundColor: shouldUseLineChart
                ? "rgba(75, 192, 192, 0.2)"
                : filteredData.map((data, index) => {
                    if (
                      index > 0 &&
                      data.totalEarnings < filteredData[index - 1].totalEarnings
                    ) {
                      return "rgba(255, 0, 0, 0.2)";
                    }
                    return "rgba(75, 192, 192, 0.2)";
                  }),
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              type: shouldUseLineChart ? "line" : "bar",
            },
          ],
        };

        new Chart(ctx, {
          type: shouldUseLineChart ? "line" : "bar",
          data,
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            animation: {
              duration: 0,
            },
          },
        });
      } else {
        console.error("Cannot find element with id 'myChart'");
      }
    }
  }, [chartData, selectedYear]);

  const getUniqueYears = () => {
    if (chartData) {
      const uniqueYears = new Set(
        chartData.monthlyEarnings.map((data) => data.month.substring(0, 4))
      );
      return Array.from(uniqueYears);
    }
    return [];
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const formatRupiah = (amount) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(amount);
  };
  const generateExcelReport = () => {
    if (chartData) {
      const headers = ["Tahun", "Total Pendapatan"];

      const wsData = [
        ["Tangkas Jaya Teknik"],
        headers,
        ...chartData.monthlyEarnings.map((data) => [
          data.month.substring(0, 4), // Extract only the year part
          data.totalEarnings,
        ]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      const titleStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2F75B5" } },
        alignment: { horizontal: "center" },
      };
      ws["!rows"] = [titleStyle, titleStyle, ...Array(wsData.length - 2)];

      const dataStyle = {
        font: { color: { rgb: "333333" } },
        fill: { fgColor: { rgb: "F4F4F4" } },
        alignment: { horizontal: "right" },
      };

      wsData.forEach((row, rowIndex) => {
        row.forEach((cellValue, colIndex) => {
          const cellAddress = XLSX.utils.encode_cell({
            r: rowIndex,
            c: colIndex,
          });
          ws[cellAddress] = { v: cellValue, s: dataStyle };
        });
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Monthly Earnings");

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `Laporan_Keuangan_TangKas_${selectedYear}.xlsx`);
    }
  };

  return (
    <div className="bg-gray-100  rounded-md shadow-md px-12 p-8 w-full ">
      <h2 className="text-2xl font-bold mb-4 flex justify-center  ">
        Diagram Pendapatan Bulanan
      </h2>
      <div className="border-b border mb-4">

      </div>

      <div className="p-5 overflow-auto h-[750px] ">
        {chartData && selectedYear ? (
          <div>
            {chartData.monthlyEarnings.length > 0 ? (
              <>
                <div className="flex justify-between px-8 ">
                  <div className="mt-2 text-xs flex flex-col border-gray-400 border p-2 rounded-lg">
                    Total Pendapatan Tahun {selectedYear}
                    <span className="flex justify-center mt-2 text-lg text-green-500 font-bold">
                      {formatRupiah(
                        chartData.monthlyEarnings
                          .filter((data) => data.month.startsWith(selectedYear))
                          .reduce(
                            (total, data) => total + data.totalEarnings,
                            0
                          )
                      )}
                    </span>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="yearSelect" className="mr-2">
                      Pilih Tahun:
                    </label>
                    <select
                      id="yearSelect"
                      onChange={handleYearChange}
                      value={selectedYear}
                      className="border p-2 rounded-md"
                    >
                      {getUniqueYears().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    onClick={generateExcelReport}
                    className="bg-biru h-10 items-center p-2 text-white font-bold rounded-lg ease-in overflow-hidden hover:scale-105 duration-300 cursor-pointer "
                  >
                    Download Laporan
                  </div>
                </div>
                <canvas id="myChart" className="w-full h-40"></canvas>
              </>
            ) : (
              <div className="mt-2 flex justify-center">
                Data pendapatan saat ini tidak tersedia.
              </div>
            )}
          </div>
        ) : (
          <div className="mt-2">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};
export default ChartComponent;
