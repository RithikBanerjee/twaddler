using System;
using System.Web.Optimization;

namespace Twaddle
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/assets/commoncss").Include(
                        "~/assets/css/jquery.common.css",
                        "~/assets/css/jquery.ui.all.css"));

            bundles.Add(new ScriptBundle("~/assets/commonjs").Include(
                         "~/assets/js/jquery-1.8.2.min.js",
                         "~/assets/js/jquery.ui.core.js",
                         "~/assets/js/jquery.ui.widget.js",
                         "~/assets/js/jquery.ui.mouse.js",
                         "~/assets/js/jquery.ui.draggable.js",
                         "~/assets/js/jquery.ui.resizable.js",
                         "~/assets/js/jquery.signalR-1.0.0.js",
                         "~/assets/js/jquery.common.js"));
        }
    }
}
