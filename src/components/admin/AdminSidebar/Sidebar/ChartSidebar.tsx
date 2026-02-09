import Li from "../Li";
import { IconType } from "react-icons";

export const ChartSidebar = ({
    charts,
    location,
    setShowModal,
}: {
    charts: { name: string; icon: IconType; url: string }[];
    location: any;
    setShowModal: (value: boolean) => void;
}) => {
    return (
        <div>
            <h5>Charts</h5>
            <ul onClick={() => setShowModal(false)}>
                {charts.map((item, index) => (
                    <Li
                        key={index}
                        url={item.url}
                        text={item.name}
                        location={location}
                        Icon={item.icon}
                    />
                ))}
            </ul>
        </div>
    );
};
