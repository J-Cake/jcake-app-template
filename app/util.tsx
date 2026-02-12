import React from 'react';

// language=CSS
const css = `
.dot {
	background: currentColor;
    
	animation: fade 1.5s infinite;
	animation-delay: 0s;
}

.dot2 {
    animation-delay: 0.5s;
}

.dot3 {
    animation-delay: 1s;
}

@keyframes fade {
	from {
		opacity: 0.3;
	}
	
	to {
		opacity: 0.9;
	}
}
`;

export function Awaited<T, Err = never>(props: { promise: Promise<T>, children: PromiseResult<T, Err>, alt?: React.ReactNode }): React.ReactNode {
	const [res, setRes] = React.useState(null as PromiseValue<T, Err>);

	React.useEffect(() => {
		(async () => await props.promise)()
			.then(res => setRes({done: res}))
			.catch(err => setRes({err: err}));
	}, [props.promise, setRes]);

	if (isPending(res))
		return props.alt ?? <div>
			<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: '1em' }}>
				<style>{css}</style>
				<circle className="dot dot1" cx="4" cy="12" r="3"/>
				<circle className="dot dot2" cx="12" cy="12" r="3"/>
				<circle className="dot dot3" cx="20" cy="12" r="3"/>
			</svg>
		</div>;

	else if (isOk(res))
		return typeof props.children == 'function' ? props.children(res.done) : props.children.ok(res.done);

	else if (isErr(res))
		return typeof props.children == 'function' ? props.children(res.err) : props.children.err(res.err);
}

const isOk = <T, Err = Error>(res: PromiseValue<T, Err>): res is { done: T } => res != null && 'done' in res;
const isErr = <T, Err = Error>(res: PromiseValue<T, Err>): res is { err: Err } => res != null && 'err' in res;
const isPending = <T, Err = Error>(res: PromiseValue<T, Err>): res is null => res == null;

type PromiseValue<T, Err = Error> = null | { done: T } | { err: Err };
export type PromiseResult<T, Err = never> = ((t: T | Err) => React.ReactNode) | {
	ok: (t: T) => React.ReactNode,
	err: (err: Err) => React.ReactNode,
}

export function Interval<T>(props: { duration: number, callback: () => T, children: (t: T) => React.ReactNode }) {
	const [res, setRes] = React.useState(null as null | { done: any });

	React.useEffect(() => {
		setRes({done: props.callback()});

		const interval = setInterval(() => {
			setRes({done: props.callback()});
		}, props.duration);
		return () => clearInterval(interval);
	}, []);

	return props.children(res?.done);
}