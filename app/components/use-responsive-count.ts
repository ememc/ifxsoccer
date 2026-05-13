"use client";

import { useEffect, useState } from "react";

type ResponsiveCountOptions = {
    desktop: number;
    mobile: number;
    tablet?: number;
    tabletBreakpoint?: number;
    desktopBreakpoint?: number;
};

const getResponsiveCount = ({
    desktop,
    mobile,
    tablet,
    tabletBreakpoint = 768,
    desktopBreakpoint = 1024,
}: ResponsiveCountOptions) => {
    if (typeof window === "undefined") {
        return desktop;
    }

    const width = window.innerWidth;

    if (width >= desktopBreakpoint) {
        return desktop;
    }

    if (typeof tablet === "number" && width >= tabletBreakpoint) {
        return tablet;
    }

    return mobile;
};

export const useResponsiveCount = (options: ResponsiveCountOptions) => {
    const {
        desktop,
        mobile,
        tablet,
        tabletBreakpoint = 768,
        desktopBreakpoint = 1024,
    } = options;
    const [visibleCount, setVisibleCount] = useState(() => getResponsiveCount(options));

    useEffect(() => {
        const updateVisibleCount = () => {
            setVisibleCount(getResponsiveCount({
                desktop,
                mobile,
                tablet,
                tabletBreakpoint,
                desktopBreakpoint,
            }));
        };

        updateVisibleCount();
        window.addEventListener("resize", updateVisibleCount);

        return () => {
            window.removeEventListener("resize", updateVisibleCount);
        };
    }, [desktop, desktopBreakpoint, mobile, tablet, tabletBreakpoint]);

    return visibleCount;
};
