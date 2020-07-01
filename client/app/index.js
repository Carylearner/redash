import React from "react";
import ReactDOM from "react-dom";

import "@/config";

import ApplicationArea from "@/components/ApplicationArea";
import offlineListener from "@/services/offline-listener";

//ReactDOM.render(element, container[, callback]) 如果提供了可选的回调函数，该回调将在组件被渲染或更新之后被执行。
ReactDOM.render(<ApplicationArea />, document.getElementById("application-root"), () => {
  offlineListener.init();
});
