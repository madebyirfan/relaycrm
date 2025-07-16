// src/components/LanguageSwitcher.tsx
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select
      defaultValue={i18n.language}
      style={{ width: 100 }}
      onChange={handleChange}
      options={[
        { value: 'en', label: 'English' },
        { value: 'ar', label: 'Arabic' },
      ]}
    />
  );
};

export default LanguageSwitcher;
