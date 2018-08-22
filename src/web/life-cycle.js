import {render} from "../core/render";

const lifeCycle = (spec) => {
	let rootNode;
	if (spec._svenjs.rootNode) {
		rootNode = spec._svenjs.rootNode;
	}
	if (spec.hasOwnProperty("attrs")  && spec.attrs.hasOwnProperty("sjxid")) {
		if (!rootNode) rootNode = document.querySelector("[sjxid='" + spec.attrs.sjxid + "']");
	}

	if (spec.isMounted) {
		render(spec, rootNode);
		if (spec.hasOwnProperty('_didUpdate')) spec._didUpdate.apply(spec);
	}
};

export default lifeCycle;
