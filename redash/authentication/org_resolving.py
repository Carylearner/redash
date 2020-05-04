import logging

from flask import g, request
from werkzeug.local import LocalProxy

from redash.models import Organization

#g对象在一次请求中的所有的代码的地方，都可以使用，g.变量名=变量值
def _get_current_org():
    if "org" in g:
        return g.org

    if request.view_args is None:
        slug = g.get("org_slug", "default")
    else:
        slug = request.view_args.get("org_slug", g.get("org_slug", "default"))

    g.org = Organization.get_by_slug(slug)
    logging.debug("Current organization: %s (slug: %s)", g.org, slug)
    return g.org


# TODO: move to authentication
current_org = LocalProxy(_get_current_org)
