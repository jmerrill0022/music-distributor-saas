function useUploadDraft<T>(key: string, initial: T) {
    const [value, setValue] = React.useState<T>(initial);
  
    React.useEffect(() => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) setValue(JSON.parse(raw));
      } catch {}
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    React.useEffect(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {}
    }, [key, value]);
  
    return [value, setValue] as const;
  }