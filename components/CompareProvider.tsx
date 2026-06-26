'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

interface CompareContextValue {
  slugs: string[];
  toggle: (slug: string) => void;
  isSelected: (slug: string) => boolean;
  clear: () => void;
}

const CompareContext = createContext<CompareContextValue>({
  slugs: [],
  toggle: () => {},
  isSelected: () => false,
  clear: () => {},
});

const STORAGE_KEY = 'tokenhub-compare-slugs';

/**
 * 对比选择 Context Provider
 * 状态持久化到 localStorage,刷新不丢失
 */
export function CompareProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // 初始化:从 localStorage 恢复
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setSlugs(parsed);
      }
    } catch {
      // 数据损坏则忽略
    }
    setLoaded(true);
  }, []);

  // 持久化:slugs 变化时写入 localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    }
  }, [slugs, loaded]);

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
    );
  }, []);

  const isSelected = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs]
  );

  const clear = useCallback(() => setSlugs([]), []);

  return (
    <CompareContext.Provider value={{ slugs, toggle, isSelected, clear }}>
      {children}
    </CompareContext.Provider>
  );
}

/** Hook:在任意客户端组件中访问对比选择状态 */
export function useCompare() {
  return useContext(CompareContext);
}
