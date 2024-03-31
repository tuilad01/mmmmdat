import { useEffect, useState } from "react";

export interface TextBoxProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}
function TextBox({ value, placeholder, onChange }: TextBoxProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(inputValue);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <input
      type="text"
      value={inputValue}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-1"
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
}

export default TextBox;
