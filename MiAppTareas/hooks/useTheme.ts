import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  const toggle = () => setIsDark((v) => !v);

  return { isDark, toggle, setIsDark };
}
