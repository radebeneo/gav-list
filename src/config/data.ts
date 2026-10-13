import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";
import ExploreIcon from "../../assets/icons/explore.svg";
import SavedIcon from "../../assets/icons/saved.svg";
import DetailsIcon from "../../assets/icons/details.svg";
import ProfileIcon from "../../assets/icons/profile.svg";

interface AppTab {
    name: string;
    title: string;
    icon: ComponentType<SvgProps>;
}

export const tabs: AppTab[] = [
    { name: "index", title: "Home", icon: ExploreIcon },
    { name: "subscriptions", title: "Saved Places", icon: SavedIcon },
    { name: "insights", title: "Details", icon: DetailsIcon },
    { name: "settings", title: "Profile", icon: ProfileIcon },
];
