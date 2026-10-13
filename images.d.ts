declare module "*.png" {
    const value: any;
    export default value;
}

declare module "*.jpg" {
    const value: any;
    export default value;
}

declare module "*.jpeg" {
    const value: any;
    export default value;
}

declare module "*.gif" {
    const value: any;
    export default value;
}

declare module "*.svg" {
    import type { ComponentType } from "react";
    import type { SvgProps } from "react-native-svg";

    const value: ComponentType<SvgProps>;
    export default value;
}