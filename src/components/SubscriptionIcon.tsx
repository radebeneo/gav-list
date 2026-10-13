import type { ImageSourcePropType } from "react-native";
import { Image } from "react-native";
import { SvgUri } from "react-native-svg";

interface SubscriptionIconProps {
  source: ImageSourcePropType | any;
  size?: number;
  className?: string;
}

const getRemoteUri = (source: ImageSourcePropType) => {
  if (
    typeof source === "object" &&
    source !== null &&
    !Array.isArray(source) &&
    "uri" in source &&
    typeof (source as any).uri === "string"
  ) {
    return (source as any).uri;
  }

  return null;
};

const SubscriptionIcon = ({
  source,
  size = 40,
  className,
}: SubscriptionIconProps) => {
  const uri = getRemoteUri(source);

  if (uri?.endsWith(".svg")) {
    return <SvgUri uri={uri} width={size} height={size} />;
  }

  return (
    <Image
      source={source}
      className={className}
      style={!className ? { width: size, height: size } : undefined}
      resizeMode="contain"
    />
  );
};

export default SubscriptionIcon;
