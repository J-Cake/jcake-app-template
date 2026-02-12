import React from 'react';

type RouterContextType = {
    url: URL;
    navigate: (to: string, payload?: any) => void;
    page: React.ReactNode;

    onNavigate: (callback: (to: URL) => void) => void;
};

export const RouterContext = React.createContext<RouterContextType | null>(null);

const BASE_URL = window.location.origin;

export type RouterConfig = {
    [Path in string]: (props: { path: Path, match: URLPatternResult }) => React.ReactNode;
}


const onNavigateCallbacks: ((to: URL) => void)[] = [];

export default function Router(props: { config: RouterConfig, children?: React.ReactNode }) {
    const [url, setUrl] = React.useState(new URL(window.location.href));

    React.useEffect(() => {
        let handler: (e: PopStateEvent) => void;

        window.addEventListener('popstate', handler = e => {
            e.preventDefault();
            setUrl(new URL(window.location.href));
        });

        return () => window.removeEventListener('popstate', handler);
    }, []);

    const navigate = React.useCallback((to: string, payload?: any) => {
        window.history.pushState(payload, "", to);
        setUrl(new URL(window.location.href));
    }, [setUrl]);

    const page = React.useMemo(() => {
        for (const [path, component] of Object.entries(props.config)) {
            const match = new URLPattern(path, BASE_URL).exec(url);

            if (match)
                return <div id="main">
                    {component({path, match})}
                </div>;
        }

        return null;
    }, [url, props.config]);

    React.useEffect(() => onNavigateCallbacks.forEach(i => i(new URL(window.location.href))), [url]);

    const onNavigate = React.useCallback((callback: (to: URL) => void) => {
        onNavigateCallbacks.push(callback);
    }, []);

    return <RouterContext.Provider value={{url, navigate, page, onNavigate}}>
        {props.children}
    </RouterContext.Provider>;
}

export function Link(props: { to: string, children: React.ReactNode, className?: string }) {
    const ctx = React.useContext(RouterContext);
    if (!ctx) throw new Error("Link must be used inside a Router");

    const handle = function (e: React.MouseEvent<HTMLAnchorElement>) {
        if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
            e.preventDefault();
            ctx.navigate(props.to);
        }
    };

    return <a href={props.to} onClick={handle} className={props.className}>
        {props.children}
    </a>;
}

export function navigateImmediately(to: string) {
    const ctx = React.useContext(RouterContext);
    if (!ctx) throw new Error("Link must be used inside a Router");

    ctx.navigate(to);
}

export function RouterView(): React.ReactNode {
    const ctx = React.useContext(RouterContext);

    if (!ctx) throw new Error("RouterView must be used inside a Router");

    if (ctx.page)
        return ctx.page;

    else
        return <div>{"Not found"}</div>;
}