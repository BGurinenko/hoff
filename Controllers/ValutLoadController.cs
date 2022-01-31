using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValutLoadController : ControllerBase
    {
        private readonly ILogger<ValutLoadController> _logger;

        public ValutLoadController(ILogger<ValutLoadController> logger)
        {
            _logger = logger;
        }

        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [HttpGet]
        public string Get()
        {
            log.Debug("текущая валюта");
            var res = System.IO.File.ReadAllText("valuta.txt");
            return res.Substring(0, res.Length-1);
        }
    }
}
