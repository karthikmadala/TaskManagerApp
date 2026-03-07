declare module 'react-native-vector-icons/Ionicons' {
  import { ComponentType } from 'react';

  interface IconProps {
    name: string;
    size?: number;
    color?: string;
  }

  const Ionicons: ComponentType<IconProps>;
  export default Ionicons;
}
