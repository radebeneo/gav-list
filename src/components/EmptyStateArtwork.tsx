import images from "@/config/images";
import { Image } from "react-native";

export default function EmptyStateArtwork() {
  return (
    <Image
      source={images.emptyState}
      className="h-36 w-48 self-center"
      resizeMode="contain"
      accessible={false}
    />
  );
}
