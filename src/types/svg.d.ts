declare module '*.svg?react' {
    import type * as React from 'react';

    const Component: React.FC<React.SVGProps<SVGSVGElement>>;
    export default Component;
}
