function compose(...fns) {
  return function(...args) {
    return fns.reduceRight((acc, i) => i.apply(this, args), args);
  };
}

export function SubCollector() {
  return function collector(target: { ngOnDestroy: () => void }, key: string): void {
    const subsMap = new Map();

    function unsubscribe() {
      this[key].forEach(sub => sub.unsubscribe());
      subsMap.delete(this);
    }

    Object.defineProperty(target, key, {
      configurable: false,
      get() {
        const subs = subsMap.get(this);
        if (!subs) {
          subsMap.set(this, []);
        }
        return subsMap.get(this);
      },
      set(newSub) {
        this[key].push(newSub);
      },
    });

    const old = target.ngOnDestroy || (() => null);
    Object.defineProperty(target, "ngOnDestroy", {
      configurable: false,
      get() {
        return compose(unsubscribe, old).bind(this);
      },
    });
  };
}
