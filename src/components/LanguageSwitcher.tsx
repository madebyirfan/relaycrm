// === src/components/LanguageSwitcher.tsx ===
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  return (
    <Select
      defaultValue={i18n.language}
      onChange={(val) => i18n.changeLanguage(val)}
      options={[
        { value: 'en', label: 'English' },
        { value: 'ar', label: 'عربي' },
      ]}
      className="w-28"
    />
  );
};

export default LanguageSwitcher;