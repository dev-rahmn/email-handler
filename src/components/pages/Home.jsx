// Home.js
import React, { useCallback } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler // 👈 ADD THIS
} from 'chart.js';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler // 👈 AND REGISTER IT HERE
);

// Static data for Pie Charts with expanded slices
const pieData1 = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
  datasets: [{
    data: [300, 50, 100, 150, 200],
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
  }],
};

const pieData2 = {
  labels: ['Orange', 'Cyan', 'Magenta', 'Lime', 'Pink'],
  datasets: [{
    data: [200, 150, 75, 50, 125],
    backgroundColor: ['#FF9F40', '#00FFFF', '#FF00FF', '#BFFF00', '#FFC0CB'],
    hoverBackgroundColor: ['#FF9F40', '#00FFFF', '#FF00FF', '#BFFF00', '#FFC0CB'],
  }],
};

// Options for Pie Charts with legend at the bottom and animations
const pieOptions = {
  responsive: true,
  maintainAspectRatio: false, // Allow chart to fill its container
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  animation: {
    duration: 1500,
    easing: 'easeInOutQuad',
  }
};

// Static data for Bar Charts with additional data points and datasets
const barData1 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'],
  datasets: [
    {
      label: 'Sales',
      data: [65, 59, 80, 81, 56, 75, 90, 110, 95, 120],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
    {
      label: 'Expenses',
      data: [30, 45, 50, 60, 40, 55, 70, 80, 65, 90],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    }
  ],
};

const barData2 = {
  labels: ['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Revenue',
      data: [45, 75, 60, 90, 100, 85, 70, 95, 110, 130],
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    },
    {
      label: 'Profit',
      data: [20, 35, 25, 50, 60, 45, 30, 55, 70, 80],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }
  ],
};

// Options for Bar Charts with bounce animation
const barOptions = {
  responsive: true,
  maintainAspectRatio: false, // Allow chart to fill its container
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  animation: {
    duration: 2000,
    easing: 'easeOutBounce', // Bounce easing effect
  }
};

// Static data for Area Charts using Line charts with fill enabled
const areaData1 = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Visitors',
    data: [200, 450, 300, 500, 700, 600, 800],
    fill: true,
    backgroundColor: 'rgba(255, 159, 64, 0.5)',
    borderColor: 'rgba(255, 159, 64, 1)',
    tension: 0.4,
  },
  {
    label: 'employees',
    data: [90, 490, 200, 800, 300, 900, 200],
    fill: true,
    backgroundColor: 'rgba(25, 159, 64, 0.5)',
    borderColor: 'rgba(25, 159, 64, 1)',
    tension: 0.4,
  }
],
};

const areaData2 = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
  datasets: [{
    label: 'Orders',
    data: [50, 100, 150, 100, 200, 180],
    fill: true,
    backgroundColor: 'rgba(54, 162, 235, 0.6)',
    borderColor: 'rgba(54, 162, 235, 1)',
    tension: 0.4,
  },
  {
    label: 'cancelled order',
    data: [20, 40, 80, 60, 90, 20],
    fill: true,
    backgroundColor: 'rgba(25, 19, 64, 0.6)',
    borderColor: 'rgba(120, 19, 64, 1)',
    tension: 0.4,
  }
],
};

// Options for Area Charts with animation removed
const areaOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
  animation: false
};

const Home = () => {
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
}, []);

const particlesLoaded = useCallback(async container => {
  
}, []);
  return (
    <div className="relative">
      {/* Particle background */}
      <Particles
        id="tsparticles"
        className="absolute top-0 left-0 w-full h-full z-0"
        init={particlesInit}
            loaded={particlesLoaded}
        options={{
          fullScreen: false,
          background: {
            color: {
              value: "#00000000", // transparent to show gradient
            },
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: 50,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#ffffff",
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.5,
              random: false,
            },
            size: {
              value: 3,
              random: true,
            },
            links: {
              enable: true,
              distance: 150,
              color: "#911111",
              opacity: 0.6,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
              direction: "none",
              outMode: "bounce",
            },
          },
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse",
              },
              onClick: {
                enable: true,
                mode: "push",
              },
            },
            modes: {
              repulse: {
                distance: 100,
                duration: 0.4,
              },
              push: {
                quantity: 4,
              },
            },
          },
          detectRetina: true,
        }}
      />

      {/* Main Content */}
      <div className="pt-20 pb-16 px-4 min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-[length:200%_200%] animate-gradient-x z-10 relative">
        <h1 className="text-3xl font-bold mb-10 text-center text-white">Dashboard Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

         
        <div 
          className="bg-white shadow-cyanShadow p-6 rounded-md hover:shadow-xl transition-shadow duration-300" 
          style={{ height: '450px' }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-grey">Pie Chart 1</h2>
          <div className="relative h-[360px]">
            <Pie data={pieData1} options={pieOptions} />
          </div>
        </div>

        {/* Bar Chart 2 */}
        <div 
          className="bg-white shadow-cyanShadow p-6 rounded-md hover:shadow-xl transition-shadow duration-300" 
          style={{ height: '450px' }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-grey">Bar Chart 2</h2>
          <div className="relative h-[360px]">
            <Bar data={barData2} options={barOptions} />
          </div>
        </div>

        {/* Bar Chart 1 */}
        <div 
          className="bg-white shadow-cyanShadow p-6 rounded-md hover:shadow-xl transition-shadow duration-300" 
          style={{ height: '450px' }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-grey">Bar Chart 1</h2>
          <div className="relative h-[360px]">
            <Bar data={barData1} options={barOptions} />
          </div>
        </div>

        {/* Pie Chart 2 */}
        <div 
          className="bg-white shadow-cyanShadow p-6 rounded-md hover:shadow-xl transition-shadow duration-300" 
          style={{ height: '450px' }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-grey">Pie Chart 2</h2>
          <div className="relative h-[360px]">
            <Pie data={pieData2} options={pieOptions} />
          </div>
        </div>

        {/* Area Chart 1 */}
        <div 
          className="bg-white shadow-cyanShadow p-6 rounded-md hover:shadow-xl transition-shadow duration-300" 
          style={{ height: '450px' }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-grey">Area Chart 1</h2>
          <div className="relative h-[360px]">
            <Line data={areaData1} options={areaOptions} />
          </div>
        </div>

        {/* Area Chart 2 */}
        <div 
          className="bg-white shadow-cyanShadow p-6 rounded-md hover:shadow-xl transition-shadow duration-300" 
          style={{ height: '450px' }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-grey">Area Chart 2</h2>
          <div className="relative h-[360px]">
            <Line data={areaData2} options={areaOptions} />
          </div>
        </div>

      </div>
    </div>
    </div>
  );
};

export default Home;
