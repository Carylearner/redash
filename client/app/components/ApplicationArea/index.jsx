import React, { useState, useEffect } from "react";
import routes from "@/pages";
import Router from "./Router";
import handleNavigationIntent from "./handleNavigationIntent";
import ErrorMessage from "./ErrorMessage";

export default function ApplicationArea() {
  const [currentRoute, setCurrentRoute] = useState(null);
  const [unhandledError, setUnhandledError] = useState(null);

  useEffect(() => {
    if (currentRoute && currentRoute.title) {
      document.title = currentRoute.title;
    }
  }, [currentRoute]);

  useEffect(() => {
    function globalErrorHandler(event) {
      event.preventDefault();
      setUnhandledError(event.error);
    }

    document.body.addEventListener("click", handleNavigationIntent, false);
    window.addEventListener("error", globalErrorHandler, false);

    /*
    事件捕获，从dom结构上到下，window.addEventListener先于document.addEventListener被捕获事件冒泡，
    从dom结构底层向上传递，document.addEventListener先于window.addEventListener被触发
    addEventListener函数的最后一个布尔型参数 true - 事件句柄在捕获阶段执行 false- 默认, 事件句柄在冒泡阶段执行
    参见https://www.runoob.com/jsref/dom-obj-event.html文档
    */
    
    return () => {
      document.body.removeEventListener("click", handleNavigationIntent, false);
      window.removeEventListener("error", globalErrorHandler, false);
    };
  }, []);

  if (unhandledError) {
    return <ErrorMessage error={unhandledError} />;
  }

  return <Router routes={routes} onRouteChange={setCurrentRoute} />;
}
