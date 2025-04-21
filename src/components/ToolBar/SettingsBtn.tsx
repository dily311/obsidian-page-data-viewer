import { usePlugin } from "context/PluginContext";
import { EllipsisVertical } from "lucide-react";
import EditModal from "Modal/EditModal";

export default function SettingsBtn() {
    const plugin = usePlugin();
    const handleClick = () => {
        console.log("클릭");
        const modal = new EditModal(plugin.app);
        modal.open();
    }
	return (
        <div className="toolBar-action-button"  onClick={handleClick}>
            <button className="clickable-icon toolBar_setting">
                <EllipsisVertical className="svg-icon" />
            </button>
        </div>
	);
}
