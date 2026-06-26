import Disclaimer from './Disclaimer';

export default function Footer() {
  return (
    <footer className="mt-auto">
      <Disclaimer />
      <div className="bg-white px-4 py-4 text-center">
        <p className="text-xs text-gray-400">
          TokenHub © {new Date().getFullYear()} — API 中转站信息聚合平台
          <span className="mx-2">·</span>
          数据来源:公开信息收集 & 用户提交
          <span className="mx-2">·</span>
          不提供任何 API 销售或代理服务
        </p>
      </div>
    </footer>
  );
}
