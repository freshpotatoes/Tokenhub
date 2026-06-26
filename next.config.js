/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片域名白名单 — 部署后添加各中转站的 logo 域名
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    // 本地 fallback 用首字母头像,不需要远程图片
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
