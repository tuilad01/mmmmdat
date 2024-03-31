import TextBox, { TextBoxProps } from "./TextBox";

function FormGroup({
  label,
  textBoxProps,
}: {
  label: string;
  textBoxProps?: TextBoxProps;
}) {
  return (
    <div className="mb-2">
      <label htmlFor="" className="text-lg block mb-2 capitalize">
        {label}
      </label>
      {textBoxProps ? <TextBox {...textBoxProps} /> : <TextBox />}
    </div>
  );
}

export default FormGroup;
