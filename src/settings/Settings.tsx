import Anchor from "../components/Anchor";
import Button from "../components/Button";
import { GroupManagement } from "../group/group-management";

function SettingPage() {
  const handleRemoveAllGroups = () => {
    new GroupManagement().removeAllGroups();
  };
  return (
    <section className="p-4">
      <Anchor toUrl={"/"} name="Home" />
      <div className="mt-4">
        <Button
          name="Remove all groups"
          onClick={handleRemoveAllGroups}
        ></Button>
      </div>
    </section>
  );
}

export default SettingPage;
