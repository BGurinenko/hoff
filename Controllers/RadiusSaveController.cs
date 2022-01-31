using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IO;

namespace WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RadiusSaveController : ControllerBase
    {
        private readonly ILogger<RadiusSaveController> _logger;

        public RadiusSaveController(ILogger<RadiusSaveController> logger)
        {
            _logger = logger;
        }

        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [HttpGet]
        public void Get(string value)
        {
            using (StreamWriter writer = System.IO.File.CreateText("radius.txt"))
            {
                log.Debug("сохранение радиуса = " + value);
                writer.WriteLine(value);
            }
        }
    }
}
