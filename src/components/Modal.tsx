import Button from "./Button";

function Modal({
  title,
  children,
  onOk,
  onCancel,
}: {
  title: string;
  children: React.ReactNode | string;
  onOk?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center bg-opacity-80">
      <div className="bg-white w-[90%] md:w-[600px] rounded-lg">
        <div className="p-4 border-b-2 ">
          <span className="font-bold text-2xl">{title}</span>
        </div>
        <div className="p-4">{children}</div>
        <div className="p-4 border-t-2 flex justify-end gap-2">
          <Button name="Ok" onClick={onOk} />
          <Button name="Cancel" onClick={onCancel} />
        </div>
      </div>
    </div>
  );
}

export default Modal;
