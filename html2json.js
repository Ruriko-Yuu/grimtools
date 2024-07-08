function htmlToJson(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.querySelector("body");
  return elementToJson(body);
}
function elementToJson(element) {
  const obj = {};
  obj.tagName = element.tagName.toLowerCase();
  if (element.hasAttributes()) {
    obj.attributes = {};
    for (let attr of element.attributes) { obj.attributes[attr.name] = attr.value; }
  }
  if (element.hasChildNodes()) {
    obj.children = [];
    for (let child of element.childNodes) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        obj.children.push(elementToJson(child));
      } else if (child.nodeType === Node.TEXT_NODE) {
        obj.text = child.textContent.trim();
      }
    }
  } return obj;
}