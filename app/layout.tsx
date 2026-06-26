import type { Metadata } from 'next';
import { CompareProvider } from '@/components/CompareProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'TokenHub — API 中转站信息聚合平台',
    template: '%s | TokenHub',
  },
  description:
    '聚合国内外 API 中转站信息,提供模型支持、价格、口碑、运营状态的横向对比。不提供 API 销售或代理服务,仅供信息参考。',
  keywords: ['API中转', 'OpenAI中转', 'Claude中转', '大模型API', '价格对比', '中转站'],
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen flex-col">
        <CompareProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CompareProvider>
      </body>
    </html>
  );
}
