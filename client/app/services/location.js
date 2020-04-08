import { isNil, isUndefined, isFunction, isObject, trimStart, mapValues, omitBy, extend } from "lodash";
import qs from "query-string";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

function normalizeLocation(rawLocation) {
  const { pathname, search, hash } = rawLocation;
  const result = {};

  result.path = pathname;
  result.search = mapValues(qs.parse(search), value => (isNil(value) ? true : value));
  result.hash = trimStart(hash, "#");
  result.url = `${pathname}${search}${hash}`;

  return result;
}

const location = {
  listen(handler) {
    if (isFunction(handler)) {
      return history.listen((unused, action) => handler(location, action));
    } else {
      return () => {};
    }
  },

  confirmChange(handler) {
    if (isFunction(handler)) {
      return history.block(nextLocation => {
        return handler(normalizeLocation(nextLocation), location);
      });
    } else {
      return () => {};
    }
  },

  update(newLocation, replace = false) {
    if (isObject(newLocation)) {
      // remap fields and remove undefined ones
      newLocation = omitBy(
        {
          pathname: newLocation.path,
          search: newLocation.search,
          hash: newLocation.hash,
        },
        isUndefined
      );

      // keep existing fields (!)
      newLocation = extend(
        {
          pathname: location.path,
          search: location.search,
          hash: location.hash,
        },
        newLocation
      );

      // serialize search and keep existing search parameters (!)
      if (isObject(newLocation.search)) {
        newLocation.search = omitBy(extend({}, location.search, newLocation.search), isNil);
        newLocation.search = mapValues(newLocation.search, value => (value === true ? null : value));
        newLocation.search = qs.stringify(newLocation.search);
      }
    }
    if (replace) {
      history.replace(newLocation);
    } else {
      history.push(newLocation);
    }
  },

  url: undefined,

  path: undefined,
  setPath(path, replace = false) {
    location.update({ path }, replace);
  },

  search: undefined,
  setSearch(search, replace = false) {
    location.update({ search }, replace);
  },

  hash: undefined,
  setHash(hash, replace = false) {
    location.update({ hash }, replace);
  },
};

function locationChanged() {
  extend(location, normalizeLocation(history.location));
}
/* lodash中extend用法
function Foo() {
  this.a = 1;
}
function Bar() {
  this.c = 3;
}
Foo.prototype.b = 2;
Bar.prototype.d = 4; 
_.assignIn({ 'a': 0 }, new Foo, new Bar);
// => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 } */

/*
Listen!
History使用观察者模式来在地址发生改变的时候来通知外部的代码。
每个history对象都有一个listen方法，这个方法接收一个函数作为它的参数。
这个函数会被添加到history中的用于保存监听函数的数组中。任何时候当地址发生改变时（无论是通过在代码中调用history对象的方法还是通过点击浏览器的按钮），
history对象会调用它所有的监听函数。这使得你能够编写一些代码用于监听当地址发生改变时，来执行相关的操作。
*/
history.listen(locationChanged);
locationChanged(); // init service

export default location;
