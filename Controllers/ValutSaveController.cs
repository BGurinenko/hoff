using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IO;

namespace WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValutSaveController : ControllerBase
    {
        private readonly ILogger<ValutSaveController> _logger;

        public ValutSaveController(ILogger<ValutSaveController> logger)
        {
            _logger = logger;
        }

        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [HttpGet]
        public void Get(string value)
        {
            log.Debug("установка валюты = " + value);
            using (StreamWriter writer = System.IO.File.CreateText("valuta.txt"))
            {
                writer.WriteLine(value);
            }
        }
    }
}
