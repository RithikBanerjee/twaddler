using System;
using System.Web.Mvc;

namespace Twaddle.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}