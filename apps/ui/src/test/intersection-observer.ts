import { vi } from "vitest";

type Instance = {
	callback: IntersectionObserverCallback;
	elements: Set<Element>;
};

const instances = new Set<Instance>();

// Install a controllable IntersectionObserver; call `intersect()` to simulate
// every observed element scrolling into view.
export function mockIntersectionObserver() {
	instances.clear();
	vi.stubGlobal(
		"IntersectionObserver",
		class {
			private instance: Instance;
			constructor(callback: IntersectionObserverCallback) {
				this.instance = { callback, elements: new Set() };
				instances.add(this.instance);
			}
			observe(el: Element) {
				this.instance.elements.add(el);
			}
			unobserve(el: Element) {
				this.instance.elements.delete(el);
			}
			disconnect() {
				instances.delete(this.instance);
			}
			takeRecords() {
				return [];
			}
		},
	);

	return {
		intersect(isIntersecting = true) {
			for (const { callback, elements } of [...instances]) {
				const entries = [...elements].map(
					(target) => ({ isIntersecting, target }) as IntersectionObserverEntry,
				);
				callback(entries, {} as IntersectionObserver);
			}
		},
	};
}
