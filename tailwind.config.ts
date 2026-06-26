import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 状态色
        'status-online': '#22c55e',
        'status-suspect': '#f59e0b',
        'status-dead': '#ef4444',
        // 风险色
        'risk-low': '#22c55e',
        'risk-medium': '#f59e0b',
        'risk-high': '#ef4444',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
