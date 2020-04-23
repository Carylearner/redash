import os
import simplejson
from flask import url_for

WEBPACK_MANIFEST_PATH = os.path.join(
    os.path.dirname(__file__), "../../client/dist/", "asset-manifest.json"
)


def configure_webpack(app):
    app.extensions["webpack"] = {"assets": None}

    def get_asset(path):
        assets = app.extensions["webpack"]["assets"]
        # in debug we read in this file each request
        if assets is None or app.debug:
            try:
                with open(WEBPACK_MANIFEST_PATH) as fp:
                    assets = simplejson.load(fp)
            except IOError:
                app.logger.exception("Unable to load webpack manifest")
                assets = {}
            app.extensions["webpack"]["assets"] = assets
        return url_for("static", filename=assets.get(path, path))

    @app.context_processor
    def webpack_assets():
        return {"asset_url": get_asset}
    #context_processor在flask中被称作上下文处理器，借助context_processor我们可以让所有自定义变量在模板中可见，
    #作为一个装饰器函数，所修饰的函数的返回结果必须是dict，届时dict中的key将作为变量在所有模板中可见。
