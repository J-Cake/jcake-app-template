import React from 'react';
import DOM from 'react-dom/client';

import '../css/main.css';
import ModalProvider from "./modal.js";
import Router, {RouterContext, RouterView} from "./router.js";

export const root = DOM.createRoot(document.querySelector('#root')!);

root.render(<>
	<Router config={{
		"/": () => <Home />,
	}}>
		<ModalProvider>
			<Header />
			<RouterView/>
		</ModalProvider>
	</Router>
</>);

export function Header(props: {}) {
	const [menuOpen, setMenuOpen] = React.useState(false);
	const router = React.useContext(RouterContext);

	router?.onNavigate(() => setMenuOpen(false));

	return <header id="nav" className="hint">

	</header>
}

export function Home() {
	return <h1>{"Welcome Home"}</h1>
}