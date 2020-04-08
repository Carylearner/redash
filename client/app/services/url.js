import { pick, extend } from "lodash";

const link = document.createElement("a"); // the only way to get an instance of Location class
// add to document to apply <base> href
link.style.display = "none";
document.body.appendChild(link);

const fragmentProps = ["origin", "protocol", "host", "hostname", "port", "pathname", "search", "hash", "href"];

export function parse(url) {
  link.setAttribute("href", url);
  return pick(link, fragmentProps);
}
/*
pick 创建一个从 object 中选中的属性的对象。
*/

export function stringify(fragments) {
  extend(link, pick(fragments, fragmentProps));
  return link.href; // absolute URL
}

export function normalize(url) {
  link.setAttribute("href", url);
  return link.href; // absolute URL
}

export default { parse, stringify, normalize };
